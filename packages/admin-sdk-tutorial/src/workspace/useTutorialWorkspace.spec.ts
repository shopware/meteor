import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ACTIVE_LESSON_STORAGE_KEY,
  LESSON_DRAFTS_STORAGE_KEY,
} from "./storage";
import { useTutorialWorkspace } from "./useTutorialWorkspace";

class MemoryStorage implements Storage {
  public readonly entries = new Map<string, string>();

  get length(): number {
    return this.entries.size;
  }

  clear(): void {
    this.entries.clear();
  }

  getItem(key: string): string | null {
    return this.entries.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.entries.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.entries.delete(key);
  }

  setItem(key: string, value: string): void {
    this.entries.set(key, value);
  }
}

function createWorkspace(windowStorage: Storage) {
  return useTutorialWorkspace({ windowStorage });
}

describe("useTutorialWorkspace", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("opens the first authored lesson when storage is empty", () => {
    const workspace = createWorkspace(new MemoryStorage());

    expect(workspace.activeLessonId.value).toBe("dispatch-notification");
    expect(workspace.activeLesson.value?.lesson.title).toBe("Dispatch your first notification");
    expect(workspace.currentDraft.value).toContain("Draft notification");
  });

  it("restores the persisted active lesson by lesson id", () => {
    const windowStorage = new MemoryStorage();
    windowStorage.setItem(
      ACTIVE_LESSON_STORAGE_KEY,
      JSON.stringify("understand-hidden-location")
    );

    const workspace = createWorkspace(windowStorage);

    expect(workspace.activeLessonId.value).toBe("understand-hidden-location");
    expect(workspace.activeLesson.value?.lesson.title).toBe("Understand hidden locations");
  });

  it("keeps a separate draft for each lesson across lesson switches", () => {
    const workspace = createWorkspace(new MemoryStorage());

    workspace.updateDraft(`${workspace.currentDraft.value}\n// dispatch-notification draft`);
    vi.advanceTimersByTime(750);

    workspace.openLesson("understand-hidden-location");
    workspace.updateDraft(`${workspace.currentDraft.value}\n// understand-hidden-location draft`);
    vi.advanceTimersByTime(750);

    workspace.openLesson("dispatch-notification");
    expect(workspace.currentDraft.value).toContain("dispatch-notification draft");

    workspace.openLesson("understand-hidden-location");
    expect(workspace.currentDraft.value).toContain("understand-hidden-location draft");
  });

  it("marks the lesson dirty only when the draft differs from starterCode", () => {
    const workspace = createWorkspace(new MemoryStorage());
    const starterCode = workspace.currentDraft.value;

    expect(workspace.isDirty.value).toBe(false);

    workspace.updateDraft(`${starterCode}\n// changed`);
    expect(workspace.isDirty.value).toBe(true);

    workspace.updateDraft(starterCode);
    expect(workspace.isDirty.value).toBe(false);
  });

  it("falls back to empty state when persisted data is malformed", () => {
    const windowStorage = new MemoryStorage();
    windowStorage.setItem(ACTIVE_LESSON_STORAGE_KEY, "{");
    windowStorage.setItem(LESSON_DRAFTS_STORAGE_KEY, "{\"dispatch-notification\":");

    const workspace = createWorkspace(windowStorage);

    expect(workspace.activeLessonId.value).toBe("dispatch-notification");
    expect(workspace.currentDraft.value).toContain("Draft notification");
  });

  it("does not restore showSolution state after a fresh instance is created", () => {
    const windowStorage = new MemoryStorage();
    const firstWorkspace = createWorkspace(windowStorage);

    firstWorkspace.updateDraft(`${firstWorkspace.currentDraft.value}\n// persisted draft`);
    firstWorkspace.showSolution();
    vi.advanceTimersByTime(750);

    const secondWorkspace = createWorkspace(windowStorage);

    expect(secondWorkspace.currentDraft.value).toContain("persisted draft");
    expect(secondWorkspace.isSolutionVisible.value).toBe(false);
  });
});

export const ACTIVE_LESSON_STORAGE_KEY = "meteor-admin-sdk-tutorial.activeLessonId";
export const LESSON_DRAFTS_STORAGE_KEY = "meteor-admin-sdk-tutorial.lessonDrafts";

export interface WorkspaceSnapshot {
  activeLessonId: string | null;
  lessonDrafts: Record<string, string>;
}

function parseJsonValue(windowStorage: Storage, key: string): unknown {
  const storedValue = windowStorage.getItem(key);

  if (storedValue === null) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return null;
  }
}

function normalizeLessonDrafts(value: unknown): Record<string, string> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
}

export function loadWorkspaceSnapshot(windowStorage: Storage): WorkspaceSnapshot {
  const activeLessonValue = parseJsonValue(windowStorage, ACTIVE_LESSON_STORAGE_KEY);
  const lessonDraftsValue = parseJsonValue(windowStorage, LESSON_DRAFTS_STORAGE_KEY);

  return {
    activeLessonId: typeof activeLessonValue === "string" ? activeLessonValue : null,
    lessonDrafts: normalizeLessonDrafts(lessonDraftsValue),
  };
}

export function saveWorkspaceSnapshot(windowStorage: Storage, snapshot: WorkspaceSnapshot): void {
  windowStorage.setItem(
    ACTIVE_LESSON_STORAGE_KEY,
    JSON.stringify(snapshot.activeLessonId)
  );
  windowStorage.setItem(
    LESSON_DRAFTS_STORAGE_KEY,
    JSON.stringify(snapshot.lessonDrafts)
  );
}

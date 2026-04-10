import {
  computed,
  getCurrentScope,
  onScopeDispose,
  ref,
  type ComputedRef,
  type Ref,
} from "vue";

import { loadLessonCatalog } from "../catalog";
import type { TutorialCatalogPart, TutorialLessonCatalogEntry } from "../catalog/types";
import {
  loadWorkspaceSnapshot,
  saveWorkspaceSnapshot,
  type WorkspaceSnapshot,
} from "./storage";

type TimeoutHandle = ReturnType<typeof setTimeout>;

export interface UseTutorialWorkspaceOptions {
  debounceMs?: number;
  clearTimeoutFn?: (timeoutId: TimeoutHandle) => void;
  setTimeoutFn?: (callback: () => void, delay: number) => TimeoutHandle;
  windowStorage?: Storage;
}

interface PersistedWorkspace {
  isSaving: Ref<boolean>;
  schedulePersist: () => void;
  saveImmediately: () => void;
}

function flattenLessons(catalog: TutorialCatalogPart[]): TutorialLessonCatalogEntry[] {
  return catalog.flatMap((part) => part.chapters.flatMap((chapter) => chapter.lessons));
}

function resolveActiveLessonId(
  flatLessons: TutorialLessonCatalogEntry[],
  snapshot: WorkspaceSnapshot
): string | null {
  const storedLessonExists = flatLessons.some((entry) => entry.lesson.id === snapshot.activeLessonId);

  if (storedLessonExists && snapshot.activeLessonId) {
    return snapshot.activeLessonId;
  }

  return flatLessons[0]?.lesson.id ?? null;
}

function createPersistenceController(
  activeLessonId: Ref<string | null>,
  lessonDrafts: Ref<Record<string, string>>,
  options: UseTutorialWorkspaceOptions
): PersistedWorkspace {
  const isSaving = ref(false);
  const debounceMs = options.debounceMs ?? 750;
  const setTimeoutFn = options.setTimeoutFn ?? setTimeout;
  const clearTimeoutFn = options.clearTimeoutFn ?? clearTimeout;
  const windowStorage =
    options.windowStorage ?? (typeof window === "undefined" ? undefined : window.localStorage);

  let pendingSaveId: TimeoutHandle | null = null;

  const clearPendingSave = (): void => {
    if (pendingSaveId !== null) {
      clearTimeoutFn(pendingSaveId);
      pendingSaveId = null;
    }
  };

  const persistSnapshot = (): void => {
    clearPendingSave();
    isSaving.value = false;

    if (!windowStorage) {
      return;
    }

    saveWorkspaceSnapshot(windowStorage, {
      activeLessonId: activeLessonId.value,
      lessonDrafts: lessonDrafts.value,
    });
  };

  const schedulePersist = (): void => {
    if (!windowStorage) {
      return;
    }

    clearPendingSave();
    isSaving.value = true;
    pendingSaveId = setTimeoutFn(() => {
      persistSnapshot();
    }, debounceMs);
  };

  if (getCurrentScope()) {
    onScopeDispose(() => {
      clearPendingSave();
    });
  }

  return {
    isSaving,
    schedulePersist,
    saveImmediately: persistSnapshot,
  };
}

export function useTutorialWorkspace(options: UseTutorialWorkspaceOptions = {}) {
  const catalog = loadLessonCatalog();
  const flatLessons = flattenLessons(catalog);
  const lessonById = new Map(flatLessons.map((entry) => [entry.lesson.id, entry]));
  const windowStorage =
    options.windowStorage ?? (typeof window === "undefined" ? undefined : window.localStorage);
  const snapshot = windowStorage
    ? loadWorkspaceSnapshot(windowStorage)
    : { activeLessonId: null, lessonDrafts: {} };

  const activeLessonId = ref<string | null>(resolveActiveLessonId(flatLessons, snapshot));
  const lessonDrafts = ref<Record<string, string>>({ ...snapshot.lessonDrafts });
  const isSolutionVisible = ref(false);
  const pendingLessonId = ref<string | null>(null);
  const isLessonSwitchConfirmOpen = ref(false);
  const isRestoreStarterConfirmOpen = ref(false);

  const { isSaving, schedulePersist, saveImmediately } = createPersistenceController(
    activeLessonId,
    lessonDrafts,
    options
  );

  const activeLesson = computed<TutorialLessonCatalogEntry | null>(() => {
    if (!activeLessonId.value) {
      return null;
    }

    return lessonById.get(activeLessonId.value) ?? null;
  });

  const starterCode = computed<string>(() => activeLesson.value?.starterCode ?? "");

  const currentDraft = computed<string>(() => {
    const lessonId = activeLessonId.value;

    if (!lessonId) {
      return "";
    }

    if (Object.prototype.hasOwnProperty.call(lessonDrafts.value, lessonId)) {
      return lessonDrafts.value[lessonId];
    }

    return starterCode.value;
  });

  const isDirty = computed<boolean>(() => currentDraft.value !== starterCode.value);

  const updateDraft = (nextDraft: string): void => {
    const lessonId = activeLessonId.value;

    if (!lessonId) {
      return;
    }

    lessonDrafts.value = {
      ...lessonDrafts.value,
      [lessonId]: nextDraft,
    };
    schedulePersist();
  };

  const hideSolution = (): void => {
    isSolutionVisible.value = false;
  };

  const showSolution = (): void => {
    isSolutionVisible.value = true;
  };

  const openLesson = (nextLessonId: string): void => {
    if (!lessonById.has(nextLessonId)) {
      return;
    }

    activeLessonId.value = nextLessonId;
    pendingLessonId.value = null;
    isLessonSwitchConfirmOpen.value = false;
    hideSolution();
    saveImmediately();
  };

  const requestLessonOpen = (nextLessonId: string): void => {
    if (nextLessonId === activeLessonId.value) {
      return;
    }

    if (!lessonById.has(nextLessonId)) {
      return;
    }

    if (isDirty.value) {
      pendingLessonId.value = nextLessonId;
      isLessonSwitchConfirmOpen.value = true;
      return;
    }

    openLesson(nextLessonId);
  };

  const confirmLessonOpen = (): void => {
    if (!pendingLessonId.value) {
      return;
    }

    openLesson(pendingLessonId.value);
  };

  const cancelLessonOpen = (): void => {
    pendingLessonId.value = null;
    isLessonSwitchConfirmOpen.value = false;
  };

  const restoreStarter = (): void => {
    const lessonId = activeLessonId.value;

    if (!lessonId) {
      return;
    }

    lessonDrafts.value = {
      ...lessonDrafts.value,
      [lessonId]: starterCode.value,
    };
    hideSolution();
    saveImmediately();
  };

  const requestRestoreStarter = (): void => {
    if (!activeLesson.value) {
      return;
    }

    isRestoreStarterConfirmOpen.value = true;
  };

  const confirmRestoreStarter = (): void => {
    restoreStarter();
    isRestoreStarterConfirmOpen.value = false;
  };

  const cancelRestoreStarter = (): void => {
    isRestoreStarterConfirmOpen.value = false;
  };

  return {
    catalog,
    flatLessons,
    activeLessonId: activeLessonId as Readonly<Ref<string | null>>,
    activeLesson,
    currentDraft: currentDraft as Readonly<ComputedRef<string>>,
    updateDraft,
    openLesson,
    requestLessonOpen,
    confirmLessonOpen,
    cancelLessonOpen,
    restoreStarter,
    requestRestoreStarter,
    confirmRestoreStarter,
    cancelRestoreStarter,
    flushPendingPersistence: saveImmediately,
    isDirty,
    isSaving,
    isSolutionVisible,
    showSolution,
    hideSolution,
    pendingLessonId: pendingLessonId as Readonly<Ref<string | null>>,
    isLessonSwitchConfirmOpen,
    isRestoreStarterConfirmOpen,
  };
}

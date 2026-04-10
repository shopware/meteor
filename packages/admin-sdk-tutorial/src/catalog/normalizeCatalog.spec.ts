import { describe, expect, it } from "vitest";

import { resolveLessonBundleFilePath } from "./loadLessonCatalog";
import { normalizeCatalog } from "./normalizeCatalog";
import type { TutorialLessonCatalogEntry } from "./types";

function createLessonEntry(overrides: Partial<TutorialLessonCatalogEntry> = {}): TutorialLessonCatalogEntry {
  return {
    part: {
      id: "foundations",
      title: "Foundations",
      order: 1,
    },
    chapter: {
      id: "notifications",
      title: "Notifications",
      order: 1,
    },
    lesson: {
      id: "dispatch-notification",
      title: "Dispatch your first notification",
      order: 1,
      summary: "Summary",
    },
    bundlePath: "../lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification",
    prose: "# Lesson",
    starterFile: "starter.ts",
    starterCode: "export const starter = true;",
    solutionFile: "solution.ts",
    solutionCode: "export const solution = true;",
    primaryEditableFile: "starter.ts",
    supportFiles: [
      {
        path: "support/fake-admin-log.ts",
        contents: "export const log = [];",
      },
    ],
    docsLinks: [
      {
        label: "Guide",
        href: "/guide/api-reference/notification",
      },
    ],
    scenario: {
      kind: "notification",
    },
    ...overrides,
  };
}

describe("normalizeCatalog", () => {
  it("throws when the same lesson id appears twice inside one chapter", () => {
    const firstLesson = createLessonEntry();
    const duplicateLesson = createLessonEntry({
      lesson: {
        ...firstLesson.lesson,
        title: "Duplicate title",
      },
    });

    expect(() => normalizeCatalog([firstLesson, duplicateLesson])).toThrowError(
      'Duplicate lesson id "dispatch-notification" in chapter "notifications"'
    );
  });

  it("throws when the same chapter id appears with conflicting metadata inside one part", () => {
    const firstLesson = createLessonEntry();
    const conflictingChapter = createLessonEntry({
      chapter: {
        ...firstLesson.chapter,
        title: "Different chapter title",
      },
      lesson: {
        id: "dispatch-notification-2",
        title: "Dispatch another notification",
        order: 2,
        summary: "Summary",
      },
    });

    expect(() => normalizeCatalog([firstLesson, conflictingChapter])).toThrowError(
      'Duplicate chapter id "notifications" in part "foundations"'
    );
  });

  it("rejects escaping lesson file references", () => {
    expect(() =>
      resolveLessonBundleFilePath(
        "../lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification",
        "../escape.ts"
      )
    ).toThrowError('Lesson bundle references must not escape the lesson directory: "../escape.ts"');
  });

  it("rejects absolute lesson file references", () => {
    expect(() =>
      resolveLessonBundleFilePath(
        "../lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification",
        "/etc/passwd"
      )
    ).toThrowError('Lesson bundle references must stay relative: "/etc/passwd"');
  });
});

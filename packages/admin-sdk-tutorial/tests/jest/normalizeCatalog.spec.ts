import { describe, expect, test } from "@jest/globals";

import { normalizeCatalog } from "../../src/catalog/normalizeCatalog";
import type { TutorialLessonCatalogEntry } from "../../src/catalog/types";

function createLessonEntry(
  overrides: Partial<TutorialLessonCatalogEntry> = {}
): TutorialLessonCatalogEntry {
  return {
    part: {
      id: "foundations",
      title: "Foundations",
      order: 2,
    },
    chapter: {
      id: "notifications",
      title: "Notifications",
      order: 2,
    },
    lesson: {
      id: "dispatch-notification",
      title: "Dispatch your first notification",
      order: 2,
      summary: "Summary",
    },
    bundlePath:
      "../lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification",
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

describe("normalizeCatalog (jest)", () => {
  test("groups and sorts parts, chapters, and lessons by explicit order", () => {
    const secondLesson = createLessonEntry({
      lesson: {
        id: "understand-hidden-location",
        title: "Understand hidden locations",
        order: 1,
        summary: "Summary",
      },
      chapter: {
        id: "hidden-location",
        title: "Hidden location",
        order: 1,
      },
    });
    const firstLesson = createLessonEntry({
      part: {
        id: "advanced",
        title: "Advanced",
        order: 1,
      },
      chapter: {
        id: "positions",
        title: "Positions",
        order: 1,
      },
      lesson: {
        id: "render-a-position",
        title: "Render a position",
        order: 1,
        summary: "Summary",
      },
    });

    const catalog = normalizeCatalog([secondLesson, firstLesson]);

    expect(catalog.map((part) => part.id)).toEqual(["advanced", "foundations"]);
    expect(catalog[1].chapters.map((chapter) => chapter.id)).toEqual(["hidden-location"]);
    expect(catalog[0].chapters[0].lessons[0].lesson.id).toBe("render-a-position");
  });

  test("rejects duplicate lesson ids within one chapter", () => {
    const firstLesson = createLessonEntry({
      lesson: {
        id: "duplicate-lesson",
        title: "Original",
        order: 1,
        summary: "Summary",
      },
    });
    const duplicateLesson = createLessonEntry({
      lesson: {
        id: "duplicate-lesson",
        title: "Conflicting",
        order: 2,
        summary: "Summary",
      },
    });

    expect(() => normalizeCatalog([firstLesson, duplicateLesson])).toThrow(
      'Duplicate lesson id "duplicate-lesson" in chapter "notifications"'
    );
  });
});

import { describe, expect, it } from "vitest";

import { loadLessonCatalog } from "./loadLessonCatalog";

describe("catalog", () => {
  it("loads the seeded lessons into a deterministic nested catalog", () => {
    const catalog = loadLessonCatalog();

    expect(catalog.map((part) => part.id)).toEqual(["foundations"]);
    expect(catalog[0].chapters.map((chapter) => chapter.id)).toEqual(["notifications", "hidden-location"]);
    expect(catalog[0].chapters[0].lessons[0].lesson.title).toBe("Dispatch your first notification");

    for (const part of catalog) {
      for (const chapter of part.chapters) {
        for (const lesson of chapter.lessons) {
          expect(lesson.bundlePath.startsWith("../lessons/")).toBe(true);
          expect(lesson.prose.length).toBeGreaterThan(0);
          expect(lesson.starterCode.length).toBeGreaterThan(0);
          expect(lesson.solutionCode.length).toBeGreaterThan(0);
          expect(lesson.supportFiles.length).toBeGreaterThan(0);
          expect(lesson.supportFiles.every((file) => file.contents.length > 0)).toBe(true);
          expect(lesson.docsLinks.length).toBeGreaterThan(0);
          expect(lesson.docsLinks.every((link) => link.href.startsWith("/guide/"))).toBe(true);
        }
      }
    }
  });
});

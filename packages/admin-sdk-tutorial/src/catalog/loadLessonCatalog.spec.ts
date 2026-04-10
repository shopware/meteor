import { describe, expect, it } from "vitest";

import { loadLessonCatalogFromModules } from "./loadLessonCatalog";
import type { TutorialLessonManifest } from "./types";

const manifestPath =
  "../lessons/part-99-test/chapter-01-seam/lesson-01-missing-asset/lesson.manifest.ts";
const bundlePath =
  "../lessons/part-99-test/chapter-01-seam/lesson-01-missing-asset";

function createManifest(): TutorialLessonManifest {
  return {
    part: {
      id: "part-99-test",
      title: "Test Part",
      order: 99,
    },
    chapter: {
      id: "chapter-01-seam",
      title: "Seam Chapter",
      order: 1,
    },
    lesson: {
      id: "lesson-01-missing-asset",
      title: "Synthetic lesson",
      order: 1,
      summary: "Summary",
    },
    docsLinks: [
      {
        label: "Guide",
        href: "/guide/api-reference/notification",
      },
    ],
    proseFile: "lesson.md",
    starterFile: "starter.ts",
    solutionFile: "solution.ts",
    supportFiles: ["support/logger.ts", "support/missing.ts"],
    primaryEditableFile: "starter.ts",
    scenario: {
      kind: "notification",
    },
  };
}

function createModules(assetModules: Record<string, string>) {
  return {
    manifests: {
      [manifestPath]: createManifest(),
    },
    assets: assetModules,
  };
}

describe("loadLessonCatalogFromModules", () => {
  it("normalizes a synthetic lesson bundle into the public catalog shape", () => {
    const catalog = loadLessonCatalogFromModules(
      createModules({
        [`${bundlePath}/lesson.md`]: "# Lesson",
        [`${bundlePath}/starter.ts`]: "export const starter = true;",
        [`${bundlePath}/solution.ts`]: "export const solution = true;",
        [`${bundlePath}/support/logger.ts`]: "export const log = [];",
        [`${bundlePath}/support/missing.ts`]: "export const recovered = true;",
      })
    );

    expect(catalog).toHaveLength(1);
    expect(catalog[0].id).toBe("part-99-test");
    expect(catalog[0].chapters).toHaveLength(1);
    expect(catalog[0].chapters[0].id).toBe("chapter-01-seam");
    expect(catalog[0].chapters[0].lessons).toHaveLength(1);
    expect(catalog[0].chapters[0].lessons[0].bundlePath).toBe(bundlePath);
    expect(catalog[0].chapters[0].lessons[0].supportFiles.map((file) => file.path)).toEqual([
      "support/logger.ts",
      "support/missing.ts",
    ]);
  });

  it("throws when a manifest-declared asset is missing from the module map", () => {
    expect(() =>
      loadLessonCatalogFromModules(
        createModules({
          [`${bundlePath}/lesson.md`]: "# Lesson",
          [`${bundlePath}/starter.ts`]: "export const starter = true;",
          [`${bundlePath}/solution.ts`]: "export const solution = true;",
          [`${bundlePath}/support/logger.ts`]: "export const log = [];",
        })
      )
    ).toThrowError(`Missing lesson asset "support/missing.ts" in bundle "${bundlePath}"`);
  });
});

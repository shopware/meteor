import { describe, expect, it } from "vitest";

import dispatchNotification from "../lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification/lesson.manifest";
import understandHiddenLocation from "../lessons/part-01-foundations/chapter-02-hidden-location/lesson-01-understand-hidden-location/lesson.manifest";

const seededLessons = [dispatchNotification, understandHiddenLocation];

describe("manifest integrity", () => {
  it("keeps the seeded lesson set explicit", () => {
    expect(seededLessons).toHaveLength(2);
    expect(seededLessons.map((manifest) => manifest.lesson.id)).toEqual([
      "dispatch-notification",
      "understand-hidden-location",
    ]);
  });

  it("keeps exactly one editable starter and one solution per lesson", () => {
    for (const manifest of seededLessons) {
      expect(manifest.proseFile).toBe("lesson.md");
      expect(manifest.primaryEditableFile).toBe("starter.ts");
      expect(manifest.starterFile).toBe("starter.ts");
      expect(manifest.solutionFile).toBe("solution.ts");
      expect(new Set([manifest.primaryEditableFile, manifest.starterFile, manifest.solutionFile])).toEqual(
        new Set(["starter.ts", "solution.ts"])
      );
    }
  });

  it("requires bundled support files for every lesson", () => {
    for (const manifest of seededLessons) {
      expect(manifest.supportFiles.length).toBeGreaterThanOrEqual(1);
      expect(manifest.supportFiles.every((file) => file.startsWith("support/"))).toBe(true);
    }
  });

  it("keeps documentation links on canonical guide routes", () => {
    for (const manifest of seededLessons) {
      expect(manifest.docsLinks.length).toBeGreaterThan(0);

      for (const link of manifest.docsLinks) {
        expect(link.href.startsWith("/guide/")).toBe(true);
      }
    }
  });
});

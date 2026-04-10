---
phase: 01-lesson-catalog-authoring-model
reviewed: 2026-04-10T11:49:05Z
depth: standard
files_reviewed: 30
files_reviewed_list:
  - packages/admin-sdk-tutorial/.gitignore
  - packages/admin-sdk-tutorial/eslint.config.mjs
  - packages/admin-sdk-tutorial/index.html
  - packages/admin-sdk-tutorial/package.json
  - packages/admin-sdk-tutorial/playwright.config.ts
  - packages/admin-sdk-tutorial/src/App.vue
  - packages/admin-sdk-tutorial/src/catalog/catalog.spec.ts
  - packages/admin-sdk-tutorial/src/catalog/index.ts
  - packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts
  - packages/admin-sdk-tutorial/src/catalog/manifestIntegrity.spec.ts
  - packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.spec.ts
  - packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.ts
  - packages/admin-sdk-tutorial/src/catalog/types.ts
  - packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification/lesson.manifest.ts
  - packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification/lesson.md
  - packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification/solution.ts
  - packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification/starter.ts
  - packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification/support/fake-admin-log.ts
  - packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-02-hidden-location/lesson-01-understand-hidden-location/lesson.manifest.ts
  - packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-02-hidden-location/lesson-01-understand-hidden-location/lesson.md
  - packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-02-hidden-location/lesson-01-understand-hidden-location/solution.ts
  - packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-02-hidden-location/lesson-01-understand-hidden-location/starter.ts
  - packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-02-hidden-location/lesson-01-understand-hidden-location/support/location-constants.ts
  - packages/admin-sdk-tutorial/src/main.ts
  - packages/admin-sdk-tutorial/src/vite-env.d.ts
  - packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts
  - packages/admin-sdk-tutorial/tsconfig.json
  - packages/admin-sdk-tutorial/vite.config.ts
  - packages/admin-sdk-tutorial/vitest.config.ts
  - packages/admin-sdk-tutorial/vitest.setup.ts
findings:
  critical: 0
  warning: 2
  info: 0
  total: 2
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-04-10T11:49:05Z
**Depth:** standard
**Files Reviewed:** 30
**Status:** issues_found

## Summary

Reviewed the final Phase 01 `packages/admin-sdk-tutorial` package plus package-local config and tests. No critical security or crash issues showed up in the current seeded flow, and the package passed `lint:eslint`, `lint:types`, `test:unit`, and `test:e2e` when run via `/Users/jannisleifeld/.volta/bin/pnpm` after the default `pnpm` entrypoint failed due the local Corepack signature problem.

The main problems are around the long-term correctness guarantees the phase intended to establish: normalization does not reject conflicting `order` metadata, and the manifest-integrity suite only covers two hardcoded manifests instead of the lesson set the loader actually discovers.

## Warnings

### WR-01: Conflicting `order` values are not rejected, so catalog order can silently depend on discovery order

**File:** `packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.ts:7-65`
**Issue:** `normalizeCatalog()` sorts parts, chapters, and lessons by their `order` fields, but it never validates that those order values are unique within a sibling set. If two chapters in the same part or two lessons in the same chapter both use `order: 1`, the resulting sequence is determined by the incoming array order from discovery instead of failing fast on conflicting author intent. That contradicts the phase threat model and makes future catalog output nondeterministic under malformed content.
**Fix:**
```ts
function assertUniqueOrders(
  scope: string,
  items: ReadonlyArray<{ id: string; order: number }>
): void {
  const seen = new Map<number, string>();

  for (const item of items) {
    const existing = seen.get(item.order);

    if (existing && existing !== item.id) {
      throw new Error(`Duplicate ${scope} order "${item.order}" for "${existing}" and "${item.id}"`);
    }

    seen.set(item.order, item.id);
  }
}

// Call this for parts, per-part chapters, and per-chapter lessons before sorting.
```

### WR-02: Manifest-integrity coverage does not include newly added lesson bundles

**File:** `packages/admin-sdk-tutorial/src/catalog/manifestIntegrity.spec.ts:3-44`
**Issue:** The integrity suite imports exactly two manifests into `seededLessons` and never discovers the rest of `src/lessons/**/lesson.manifest.ts`. A future lesson can therefore be added to the tutorial and loaded by `loadLessonCatalog()` without ever being checked for `primaryEditableFile`, `supportFiles`, or `/guide/` docs-link rules. That weakens the persistent authoring guarantees this phase was meant to establish.
**Fix:**
```ts
const lessonManifestModules = import.meta.glob("../lessons/**/lesson.manifest.ts", {
  import: "default",
  eager: true
}) as Record<string, TutorialLessonManifest>;

const manifests = Object.values(lessonManifestModules);

for (const manifest of manifests) {
  expect(manifest.primaryEditableFile).toBe("starter.ts");
  expect(manifest.supportFiles.length).toBeGreaterThan(0);
  expect(manifest.docsLinks.every((link) => link.href.startsWith("/guide/"))).toBe(true);
}
```

---

_Reviewed: 2026-04-10T11:49:05Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

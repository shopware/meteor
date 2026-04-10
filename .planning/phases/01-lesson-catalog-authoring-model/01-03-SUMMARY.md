---
phase: 01-lesson-catalog-authoring-model
plan: 03
subsystem: catalog
tags: [tutorial, vite, vitest, catalog, normalization]
requires:
  - phase: 01-01
    provides: tutorial package scaffold, Vitest harness, Wave 0 catalog specs
  - phase: 01-02
    provides: seeded lesson manifests and lesson bundle fixtures
provides:
  - deterministic lesson discovery via `import.meta.glob`
  - normalized `parts -> chapters -> lessons` catalog records with lesson file contents
  - integration coverage for ordering, duplicate ids, and unsafe bundle paths
affects: [01-04, tutorial-shell, runtime-catalog-consumers]
tech-stack:
  added: []
  patterns: [Vite glob lesson discovery, explicit order normalization, lesson-bundle path guards]
key-files:
  created:
    - packages/admin-sdk-tutorial/src/catalog/index.ts
    - packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts
    - packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.ts
  modified:
    - packages/admin-sdk-tutorial/src/catalog/types.ts
    - packages/admin-sdk-tutorial/src/catalog/catalog.spec.ts
    - packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.spec.ts
key-decisions:
  - "Discover lesson bundles statically with Vite glob imports and only expose manifest-declared assets."
  - "Normalize the authored lesson tree into runtime-ready records that already carry prose, starter code, solution code, support files, docs links, and scenario metadata."
patterns-established:
  - "Catalog loader pattern: resolve lesson-local asset references through a shared safe-path helper before reading raw contents."
  - "Catalog normalization pattern: sort exclusively by explicit order metadata and fail fast on conflicting ids."
requirements-completed: [LEARN-03]
duration: 4min
completed: 2026-04-10
---

# Phase 01 Plan 03: Lesson Catalog Loader Summary

**Deterministic lesson catalog loading with safe bundle resolution, normalized `parts -> chapters -> lessons` output, and real seeded-bundle coverage**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-10T11:33:00Z
- **Completed:** 2026-04-10T11:37:16Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Added a static lesson catalog loader that discovers lesson manifests and raw lesson assets with `import.meta.glob`.
- Normalized authored lesson bundles into ordered part, chapter, and lesson records that include prose, starter and solution code, support files, docs links, scenario metadata, and bundle paths.
- Replaced the Wave 0 catalog spec scaffolds with real integration coverage against the seeded lesson bundles plus safety and duplicate-id checks.

## Task Commits

Each task was committed atomically:

1. **Task 1: Build static lesson discovery and normalized catalog assembly** - `3053cae5` (feat)
2. **Task 2: Replace the Wave 0 spec scaffolds with real catalog and normalization coverage** - `43caecf7` (test)

## Files Created/Modified
- `packages/admin-sdk-tutorial/src/catalog/index.ts` - public catalog barrel exports for loader, normalizer, and types
- `packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts` - manifest discovery, safe bundle file resolution, and raw lesson asset loading
- `packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.ts` - explicit order sorting and duplicate/conflict checks for catalog assembly
- `packages/admin-sdk-tutorial/src/catalog/types.ts` - runtime catalog entry, chapter, part, and support-file types
- `packages/admin-sdk-tutorial/src/catalog/catalog.spec.ts` - seeded lesson catalog integration assertions
- `packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.spec.ts` - duplicate-id and unsafe path coverage

## Decisions Made
- Used one shared bundle-path resolver so unsafe file references fail before any asset lookup happens.
- Kept normalization separate from file discovery so future UI phases can reuse ordered catalog assembly independently of raw file loading.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `pnpm` verification commands could not run because Corepack on this machine fails signature validation for `pnpm@10.12.3`. Verification completed with the already-installed local binaries for `vitest`, `eslint`, and `vue-tsc` instead.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The tutorial package now exposes deterministic catalog data for the seeded lesson bundles.
- Phase `01-04` can consume the normalized catalog directly for the browser-visible lesson list without inventing additional content wiring.

## Self-Check: PASSED

- FOUND: `.planning/phases/01-lesson-catalog-authoring-model/01-03-SUMMARY.md`
- FOUND: `3053cae5`
- FOUND: `43caecf7`

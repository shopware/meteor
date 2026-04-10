---
phase: 01-lesson-catalog-authoring-model
plan: 04
subsystem: ui
tags: [vue, vite, playwright, vitest, lesson-catalog]
requires:
  - phase: 01-03
    provides: normalized lesson catalog loader and seeded lesson bundles
provides:
  - browser-rendered parts, chapters, and lesson rows from the normalized catalog
  - focused Playwright coverage for lesson ordering and canonical docs links
  - package-local ignore rules for Playwright runtime artifacts
affects: [phase-02-browser-run-loop, phase-03-fake-admin-shell, lesson-navigation]
tech-stack:
  added: []
  patterns:
    - catalog-first Vue rendering driven by loadLessonCatalog()
    - selector-based Playwright smoke coverage for authored lesson metadata
key-files:
  created:
    - packages/admin-sdk-tutorial/.gitignore
  modified:
    - packages/admin-sdk-tutorial/src/App.vue
    - packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts
key-decisions:
  - "Render the visible tutorial catalog directly from loadLessonCatalog() so authored manifest order remains the UI source of truth."
  - "Assert canonical /guide/... hrefs in Playwright to keep docs-link exposure tied to validated manifest metadata."
  - "Ignore Playwright runtime artifacts inside the tutorial package instead of editing unrelated root ignore rules."
patterns-established:
  - "Catalog UI reads the normalized part -> chapter -> lesson tree without hardcoded lesson rows."
  - "Browser smoke coverage uses stable data-testid selectors instead of brittle text-only DOM traversal."
requirements-completed: [LESS-01]
duration: 5min
completed: 2026-04-10
---

# Phase 01 Plan 04: Browser catalog rendering with canonical lesson metadata

**A Vue catalog view now renders the authored lesson tree from `loadLessonCatalog()` and a focused Playwright smoke test enforces lesson order plus canonical Admin SDK docs links.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-10T11:38:30Z
- **Completed:** 2026-04-10T11:43:41Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Replaced the placeholder tutorial shell with a content-led catalog view that renders ordered parts, chapters, and lessons from normalized lesson data.
- Exposed lesson scenario kind, `primaryEditableFile`, read-only support-file counts, and canonical docs links without adding any editor or runtime controls.
- Added a focused Playwright smoke test that fails if lesson order or approved docs-link targets regress.

## Task Commits

Each task was committed atomically:

1. **Task 1: Render the ordered lesson list from the normalized catalog** - `9a4f304b` (feat)
2. **Task 2: Replace the browser scaffold with a focused ordered-list smoke test** - `b83968de` (test)

Additional hygiene commit:

3. **Ignore generated Playwright artifacts** - `aa0fa8b4` (chore)

## Files Created/Modified

- `packages/admin-sdk-tutorial/src/App.vue` - Renders the ordered lesson catalog with stable selectors and manifest-backed metadata.
- `packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts` - Verifies browser-visible lesson order and canonical docs-link targets.
- `packages/admin-sdk-tutorial/.gitignore` - Ignores package-local Playwright runtime artifacts created during focused e2e runs.

## Decisions Made

- Rendered the UI straight from `loadLessonCatalog()` instead of duplicating lesson rows in component state, which satisfies the phase threat mitigation against stale or hardcoded catalog content.
- Kept the browser proof narrow and deterministic by asserting only the authored lesson order and `/guide/...` hrefs through stable `data-testid` selectors.
- Scoped Playwright artifact ignores to `packages/admin-sdk-tutorial/.gitignore` so this plan would not modify the already-dirty root `.gitignore`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Ignored generated Playwright artifacts at the package level**
- **Found during:** Final hygiene after Task 2
- **Issue:** The required focused Playwright run created `packages/admin-sdk-tutorial/test-results/.last-run.json`, which would otherwise leave untracked runtime output in the worktree.
- **Fix:** Added `packages/admin-sdk-tutorial/.gitignore` entries for `test-results/` and `playwright-report/`.
- **Files modified:** `packages/admin-sdk-tutorial/.gitignore`
- **Verification:** `git check-ignore -v packages/admin-sdk-tutorial/test-results/.last-run.json`
- **Committed in:** `aa0fa8b4`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The deviation was limited to verification hygiene. No product scope changed.

## Issues Encountered

- Corepack-backed `pnpm` failed with a signature verification error in this environment. All package commands were rerun with the Volta-managed `~/.volta/bin/pnpm` binary, as allowed by the plan constraints.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The tutorial package now shows a browser-visible catalog outcome for Phase 1 and exposes selectors future phases can build on.
- Later runtime/editor work can consume the same normalized loader without revisiting the lesson authoring model or browser smoke harness.

## Self-Check: PASSED

- Verified summary exists at `.planning/phases/01-lesson-catalog-authoring-model/01-04-SUMMARY.md`.
- Verified task commits `9a4f304b`, `b83968de`, and `aa0fa8b4` exist in git history.

---
*Phase: 01-lesson-catalog-authoring-model*
*Completed: 2026-04-10*

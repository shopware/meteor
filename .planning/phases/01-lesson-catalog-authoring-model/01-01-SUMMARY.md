---
phase: 01-lesson-catalog-authoring-model
plan: 01
subsystem: ui
tags: [vue, vite, vitest, playwright, typescript]
requires: []
provides:
  - tutorial workspace package scaffolding under `packages/admin-sdk-tutorial/`
  - typed lesson manifest contract for part/chapter/lesson authoring
  - package-local lint, typecheck, unit, and browser smoke harnesses
affects: [phase-01-plan-02, phase-01-plan-04, tutorial-catalog, tutorial-runtime]
tech-stack:
  added: [Vue 3, Vite 5, Vitest 3, Playwright]
  patterns: [package-local harness ownership, explicit lesson file-role metadata, deterministic Playwright webServer config]
key-files:
  created:
    - packages/admin-sdk-tutorial/package.json
    - packages/admin-sdk-tutorial/eslint.config.mjs
    - packages/admin-sdk-tutorial/vite.config.ts
    - packages/admin-sdk-tutorial/vitest.config.ts
    - packages/admin-sdk-tutorial/playwright.config.ts
    - packages/admin-sdk-tutorial/src/catalog/types.ts
    - packages/admin-sdk-tutorial/src/catalog/catalog.spec.ts
    - packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.spec.ts
    - packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts
  modified:
    - packages/admin-sdk-tutorial/package.json
    - packages/admin-sdk-tutorial/vitest.config.ts
    - packages/admin-sdk-tutorial/playwright.config.ts
key-decisions:
  - "Use a package-local Vue 3 + Vite app shell instead of copying the older admin-sdk build flow."
  - "Freeze lesson authoring around explicit part/chapter/lesson metadata plus prose/starter/solution/support file roles."
  - "Use a direct Vite Playwright webServer command and URL wait target so the browser harness is deterministic."
patterns-established:
  - "Each tutorial package owns its own lint, typecheck, unit, and e2e scripts."
  - "Lesson manifests encode ordering and file roles explicitly before loader logic exists."
requirements-completed: [LEARN-03]
duration: 7min
completed: 2026-04-10
---

# Phase 01 Plan 01: Lesson Catalog Authoring Model Summary

**Vue/Vite tutorial package scaffolding with a typed lesson manifest contract and verified unit/browser harness scaffolds**

## Performance

- **Duration:** 7 min
- **Started:** 2026-04-10T11:14:29Z
- **Completed:** 2026-04-10T11:21:12Z
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments

- Added `packages/admin-sdk-tutorial/` as a new workspace package with package-local `dev`, `build`, `lint:*`, `test:unit`, and `test:e2e` scripts.
- Created the Phase 1 authoring contract in [`packages/admin-sdk-tutorial/src/catalog/types.ts`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/src/catalog/types.ts) with explicit hierarchy and file-role fields.
- Added Wave 0 unit and browser scaffolds plus a Playwright web server configuration that reaches the package-local app reliably.

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold the `packages/admin-sdk-tutorial` workspace package and package-local harnesses** - `e5c97d1b` (feat)
2. **Task 2: Freeze the authoring contract and create Wave 0 spec scaffolds** - `1cd47ccb` (feat)
3. **Verification fix: Make the package-local smoke harness reachable** - `c0ace704` (fix)

## Files Created/Modified

- [`packages/admin-sdk-tutorial/package.json`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/package.json) - defines the new workspace package, scripts, and package-local toolchain.
- [`packages/admin-sdk-tutorial/index.html`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/index.html) - provides the minimal Vite app entry so `/` resolves for browser tests.
- [`packages/admin-sdk-tutorial/vitest.config.ts`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/vitest.config.ts) - sets up jsdom, setup files, and excludes the e2e directory from unit runs.
- [`packages/admin-sdk-tutorial/playwright.config.ts`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/playwright.config.ts) - scopes browser tests to `tests/e2e` and starts the package-local Vite server on `127.0.0.1:4173`.
- [`packages/admin-sdk-tutorial/src/catalog/types.ts`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/src/catalog/types.ts) - establishes the tutorial authoring manifest contract for later loader/content plans.
- [`packages/admin-sdk-tutorial/src/catalog/catalog.spec.ts`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/src/catalog/catalog.spec.ts) - plants the catalog discovery spec scaffold.
- [`packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.spec.ts`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.spec.ts) - plants the normalization and ordering spec scaffold.
- [`packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts) - plants the browser-visible lesson catalog smoke scaffold.

## Decisions Made

- Followed the research recommendation to start the tutorial package as a standalone Vue 3 + Vite app with package-local ownership of tooling.
- Encoded part, chapter, and lesson metadata separately so later catalog normalization can remain deterministic without relying on filesystem ordering.
- Kept the Phase 1 browser app limited to a single shell element and deferred editor/runtime/fake-admin concerns to later plans.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added a real Vite entry document**
- **Found during:** Task 1
- **Issue:** The package scaffold had no `index.html`, so the app could not actually serve `/` for the promised browser harness.
- **Fix:** Added [`packages/admin-sdk-tutorial/index.html`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/index.html) with the package-local `#app` mount and `src/main.ts` entry.
- **Files modified:** `packages/admin-sdk-tutorial/index.html`
- **Verification:** `pnpm --dir packages/admin-sdk-tutorial lint:eslint`, `pnpm --dir packages/admin-sdk-tutorial lint:types`
- **Committed in:** `e5c97d1b`

**2. [Rule 3 - Blocking] Corrected the Vitest harness to match the plan's run command**
- **Found during:** Task 2
- **Issue:** `vue-tsc` rejected the config spread pattern, Vitest was collecting the Playwright file, and `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` stayed in watch mode.
- **Fix:** Switched [`packages/admin-sdk-tutorial/vitest.config.ts`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/vitest.config.ts) to `mergeConfig(...)`, excluded `tests/e2e/**`, and changed the unit script to `vitest run`.
- **Files modified:** `packages/admin-sdk-tutorial/package.json`, `packages/admin-sdk-tutorial/vitest.config.ts`
- **Verification:** `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run`
- **Committed in:** `1cd47ccb`

**3. [Rule 3 - Blocking] Fixed the Playwright web server startup command**
- **Found during:** Final verification
- **Issue:** The original `webServer.command` launched Vite through `pnpm dev -- ...`, which left the tutorial URL unreachable during the browser smoke run.
- **Fix:** Updated [`packages/admin-sdk-tutorial/playwright.config.ts`](/Users/jannisleifeld/Sites/meteor/packages/admin-sdk-tutorial/playwright.config.ts) to use `pnpm exec vite --host 127.0.0.1 --port 4173 --strictPort` and wait on the explicit tutorial URL.
- **Files modified:** `packages/admin-sdk-tutorial/playwright.config.ts`
- **Verification:** `pnpm --dir packages/admin-sdk-tutorial test:e2e`
- **Committed in:** `c0ace704`

---

**Total deviations:** 3 auto-fixed (1 missing critical, 2 blocking)
**Impact on plan:** All auto-fixes were required to make the promised package-local harnesses executable. Scope stayed within the plan.

## Issues Encountered

- The default `pnpm` path failed in this environment because Corepack could not verify the package manager signature. Verification continued through the already installed Volta-managed pnpm binary at `/Users/jannisleifeld/.volta/tools/image/packages/pnpm/bin/pnpm`.
- No package-local Jest suite exists for `packages/admin-sdk-tutorial`; verification for this new package used the planned Vitest and Playwright harnesses instead.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The tutorial package is ready for lesson content seeding and catalog loader implementation.
- Package-local lint, typecheck, unit, and e2e entrypoints now exist and run against the new package.

## Self-Check: PASSED

- FOUND: `.planning/phases/01-lesson-catalog-authoring-model/01-01-SUMMARY.md`
- FOUND: `e5c97d1b`
- FOUND: `1cd47ccb`
- FOUND: `c0ace704`

---
*Phase: 01-lesson-catalog-authoring-model*
*Completed: 2026-04-10*

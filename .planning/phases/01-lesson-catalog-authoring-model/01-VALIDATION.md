---
phase: 01
slug: lesson-catalog-authoring-model
status: partial
nyquist_compliant: false
wave_0_complete: true
created: 2026-04-10
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `vitest` 3.x + `@playwright/test` 1.45.x |
| **Config file** | `packages/admin-sdk-tutorial/vitest.config.ts` and `packages/admin-sdk-tutorial/playwright.config.ts` |
| **Quick run command** | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` |
| **Full suite command** | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run && pnpm --dir packages/admin-sdk-tutorial test:e2e` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run`
- **After every plan wave:** Run `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run && pnpm --dir packages/admin-sdk-tutorial test:e2e`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | LEARN-03 | T-01-01 | Package-local lint, typecheck, unit, and e2e harnesses exist and run from the tutorial package | lint/typecheck | `pnpm --dir packages/admin-sdk-tutorial lint:eslint && pnpm --dir packages/admin-sdk-tutorial lint:types` | ✅ `package.json`, `vitest.config.ts`, `playwright.config.ts` | ✅ green |
| 01-01-02 | 01 | 1 | LEARN-03 | T-01-03 | The lesson authoring contract and Wave 0 scaffolds exist before content and loader work begins | unit | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` | ✅ `src/catalog/types.ts`, `catalog.spec.ts`, `normalizeCatalog.spec.ts` | ✅ green |
| 01-02-01 | 02 | 2 | LEARN-03 | T-02-01 | Lesson manifests keep file roles local, explicit, and single-editable | integration | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` | ✅ `manifestIntegrity.spec.ts` | ✅ green |
| 01-02-02 | 02 | 2 | LEARN-03 | T-02-02 | Lesson docs links stay on canonical `/guide/...` routes | integration | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` | ✅ `manifestIntegrity.spec.ts` | ✅ green |
| 01-03-01 | 03 | 3 | LEARN-03 | T-03-01 / T-03-02 | Loader rejects escaping and absolute bundle paths; missing-asset error path remains manual-only under current seams | unit + manual | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` | ✅ `normalizeCatalog.spec.ts` | ⚠️ partial |
| 01-03-02 | 03 | 3 | LEARN-03 | T-03-03 | Catalog normalization stays deterministic and fails on duplicate chapter or lesson ids | unit | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` | ✅ `catalog.spec.ts`, `normalizeCatalog.spec.ts` | ✅ green |
| 01-04-01 | 04 | 4 | LESS-01 | T-04-01 | Ordered lesson list renders from `loadLessonCatalog()` instead of hardcoded rows | e2e | `pnpm --dir packages/admin-sdk-tutorial exec playwright test tests/e2e/lesson-catalog.spec.ts` | ✅ `tests/e2e/lesson-catalog.spec.ts` | ✅ green |
| 01-04-02 | 04 | 4 | LESS-01 | T-04-02 / T-04-03 | Browser UI exposes only canonical docs links through the focused smoke path | e2e | `pnpm --dir packages/admin-sdk-tutorial exec playwright test tests/e2e/lesson-catalog.spec.ts` | ✅ `tests/e2e/lesson-catalog.spec.ts` | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ partial/manual-only*

---

## Wave 0 Requirements

- [x] `packages/admin-sdk-tutorial/vitest.config.ts` — package-local unit/integration harness
- [x] `packages/admin-sdk-tutorial/playwright.config.ts` — browser verification harness
- [x] `packages/admin-sdk-tutorial/src/catalog/catalog.spec.ts` — loader integration coverage for the seeded catalog
- [x] `packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.spec.ts` — normalization, escaping-path, and absolute-path coverage
- [x] `packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts` — browser-visible ordered lesson-list smoke coverage

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Missing manifest-declared asset throws an explicit loader error | LEARN-03 | The throw path is inside private helpers that close over eager `import.meta.glob` state, so it is not safely injectable without changing implementation code or mutating shared seeded lesson fixtures | In a disposable branch, temporarily rename a manifest-declared lesson asset, run `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run`, confirm the loader throws `Missing lesson asset ...`, then restore the fixture before committing |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or manual-only rationale
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** partial 2026-04-10

## Validation Audit 2026-04-10

| Metric | Count |
|--------|-------|
| Gaps found | 3 |
| Resolved | 2 |
| Escalated | 1 |

### Commands Verified

- `/Users/jannisleifeld/.volta/bin/pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` → green, 3 files passed, 9 tests passed
- `/Users/jannisleifeld/.volta/bin/pnpm --dir packages/admin-sdk-tutorial exec playwright test tests/e2e/lesson-catalog.spec.ts` → green, 1 test passed
- `/Users/jannisleifeld/.volta/bin/pnpm --dir packages/admin-sdk-tutorial lint:eslint:fix` → green
- `/Users/jannisleifeld/.volta/bin/pnpm --dir packages/admin-sdk-tutorial lint:eslint` → green
- `/Users/jannisleifeld/.volta/bin/pnpm --dir packages/admin-sdk test:unit` → green, 18 suites passed, 175 tests passed

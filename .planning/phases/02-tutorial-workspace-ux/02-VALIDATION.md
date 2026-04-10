---
phase: 02
slug: tutorial-workspace-ux
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-04-10
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `vitest` 3.x + `@playwright/test` 1.45.x |
| **Config file** | `packages/admin-sdk-tutorial/vitest.config.ts` and `packages/admin-sdk-tutorial/playwright.config.ts` |
| **Quick run command** | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` |
| **Full suite command** | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run && pnpm --dir packages/admin-sdk-tutorial test:e2e` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run`
- **After every plan wave:** Run `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run && pnpm --dir packages/admin-sdk-tutorial exec playwright test tests/e2e/tutorial-workspace.spec.ts`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | LESS-05 | T-01-01 / T-01-02 | Active lesson and per-lesson drafts persist only by stable lesson id and restore deterministically | integration | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` | ❌ W0 expansion |
| 02-01-02 | 01 | 1 | RUN-01 | T-01-03 | Workspace state exposes the current editable draft without mutating support-file or solution data | integration | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` | ❌ W0 expansion |
| 02-02-01 | 02 | 2 | LESS-02 / RUN-01 | T-02-01 | Desktop and narrow-screen workspace shells expose guidance, editor, and preview placeholder without execution controls | integration + e2e | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` and `pnpm --dir packages/admin-sdk-tutorial exec playwright test tests/e2e/tutorial-workspace.spec.ts` | ❌ W0 expansion |
| 02-03-01 | 03 | 3 | LESS-03 | T-03-01 | Solution compare is read-only, reversible, and does not replace learner draft | integration + e2e | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` and Playwright compare assertions | ❌ W0 expansion |
| 02-03-02 | 03 | 3 | LESS-04 | T-03-02 / T-03-03 | Restore starter requires confirmation and only resets the active lesson draft | integration + e2e | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` and Playwright restore assertions | ❌ W0 expansion |
| 02-04-01 | 04 | 4 | LESS-05 | T-04-01 | Refresh restores the last lesson and local draft on the same device | e2e | `pnpm --dir packages/admin-sdk-tutorial exec playwright test tests/e2e/tutorial-workspace.spec.ts` | ❌ W0 expansion |
| 02-04-02 | 04 | 4 | LESS-02 / LESS-03 / LESS-04 / RUN-01 | T-04-02 | Browser smoke coverage proves workspace layout, editing, compare, and recovery flows end-to-end | e2e | `pnpm --dir packages/admin-sdk-tutorial exec playwright test tests/e2e/tutorial-workspace.spec.ts` | ❌ W0 expansion |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ partial/manual-only*

---

## Wave 0 Requirements

- [x] `packages/admin-sdk-tutorial/vitest.config.ts` — package-local unit and integration harness already exists
- [x] `packages/admin-sdk-tutorial/playwright.config.ts` — package-local browser harness already exists
- [ ] `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.spec.ts` — state and persistence coverage for drafts, dirty flags, and recovery flows
- [ ] `packages/admin-sdk-tutorial/tests/e2e/tutorial-workspace.spec.ts` — browser-visible workspace, compare, restore, and refresh coverage

---

## Manual-Only Verifications

All planned Phase 2 behaviors should be covered with automated tests. No manual-only behaviors are expected in the target plan set.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 45s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

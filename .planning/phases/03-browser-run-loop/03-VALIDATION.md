---
phase: 03
slug: browser-run-loop
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `Vitest 3.0.5` for unit/integration, `Playwright 1.47.2` for browser acceptance, and `Jest 29.7.0` for the repo-required legacy package suite |
| **Config file** | `packages/admin-sdk-tutorial/vitest.config.ts`, `packages/admin-sdk-tutorial/playwright.config.ts`, `packages/admin-sdk-tutorial/jest.config.cjs` |
| **Quick run command** | `../../node_modules/.bin/vitest run src/App.spec.ts src/workspace/useTutorialWorkspace.spec.ts src/runtime/**/*.spec.ts` |
| **Full suite command** | `../../node_modules/.bin/vitest run && ../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts && ../../node_modules/.bin/jest --config jest.config.cjs` |
| **Estimated runtime** | ~90 seconds |

---

## Sampling Rate

- **After every task commit:** Run `../../node_modules/.bin/vitest run src/runtime/**/*.spec.ts src/App.spec.ts`
- **After every plan wave:** Run `../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts`
- **Before `/gsd-verify-work`:** `../../node_modules/.bin/vitest run && ../../node_modules/.bin/playwright test && ../../node_modules/.bin/jest --config jest.config.cjs` must be green
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | RUN-02 | T-03-01 / — | Explicit runs compile the active draft only on user action | integration + e2e | `../../node_modules/.bin/vitest run src/runtime/preview-controller.spec.ts src/App.spec.ts && ../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts -g "explicit run"` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | RUN-03 | T-03-02 / T-03-03 | Compile and runtime diagnostics render without collapsing the shell | integration + e2e | `../../node_modules/.bin/vitest run src/runtime/preview-bridge.spec.ts src/runtime/preview-controller.spec.ts && ../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts -g "diagnostics"` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 1 | RUN-04 | T-03-04 / T-03-05 | Restart replaces the preview session while preserving the current draft | integration + e2e | `../../node_modules/.bin/vitest run src/runtime/preview-session.spec.ts src/App.spec.ts && ../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts -g "restart"` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 1 | SHELL-05 | T-03-06 / T-03-07 | Host and preview only communicate over a validated session-scoped bridge | integration + e2e | `../../node_modules/.bin/vitest run src/runtime/preview-session.spec.ts src/runtime/preview-bridge.spec.ts && ../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts -g "isolated preview"` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 2 | RUN-05 | T-03-08 / — | Learner execution stays browser-local with no hosted sandbox dependency | unit + e2e | `../../node_modules/.bin/vitest run src/runtime/preview-controller.spec.ts && ../../node_modules/.bin/playwright test tests/e2e/tutorial-run-loop.spec.ts -g "browser local"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `packages/admin-sdk-tutorial/src/runtime/preview-controller.spec.ts` — compile/run state machine coverage for RUN-02, RUN-03, RUN-04, RUN-05
- [ ] `packages/admin-sdk-tutorial/src/runtime/preview-session.spec.ts` — iframe teardown/replacement and session-token coverage for RUN-04 and SHELL-05
- [ ] `packages/admin-sdk-tutorial/src/runtime/preview-bridge.spec.ts` — `postMessage` envelope validation, source checks, and diagnostics relay coverage for RUN-03 and SHELL-05
- [ ] `packages/admin-sdk-tutorial/tests/e2e/tutorial-run-loop.spec.ts` — browser acceptance for run, diagnostics, restart, and dirty-state versus last-success state
- [ ] `pnpm --dir packages/admin-sdk-tutorial add -D esbuild-wasm` — install the browser bundler dependency once the local Corepack signature issue is resolved

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Preview iframe stays sandboxed with only the required capabilities for the chosen asset-loading strategy | SHELL-05 | The exact iframe `sandbox` attribute and resulting browser security posture need an explicit human check in the rendered DOM | Run the tutorial, trigger a preview session, inspect the iframe element in devtools, and confirm the final `sandbox` value matches the plan without `allow-same-origin` unless the implementation explicitly documents and accepts that tradeoff |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

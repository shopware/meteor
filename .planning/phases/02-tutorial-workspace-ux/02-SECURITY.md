---
phase: 02
slug: tutorial-workspace-ux
status: verified
threats_open: 0
asvs_level: 1
created: 2026-04-10
---

# Phase 02 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Browser local storage -> workspace state | Persisted lesson selection and drafts are rehydrated into the Vue workspace on startup. | Lesson ids and learner-authored draft strings |
| Lesson catalog -> workspace UI shell | Repo-authored lesson metadata, prose, docs links, and code assets drive the visible workspace. | Lesson titles, summaries, markdown prose, starter code, solution code, support-file metadata |
| Workspace state -> destructive UI actions | Compare, restore, and lesson-switch flows read and mutate the current draft through a shared composable. | Active lesson id, dirty state, pending lesson id, starter-code resets |
| Playwright/Vitest harness -> browser workspace verification | Package-local tests exercise refresh, compare, restore, and narrow-screen behavior against the tutorial app. | Local browser commands, DOM assertions, deterministic localhost server config |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-01-01 | Tampering | `packages/admin-sdk-tutorial/src/workspace/storage.ts` | mitigate | Storage loading parses JSON defensively, rejects non-object draft maps, and keeps only string draft entries. Evidence: `packages/admin-sdk-tutorial/src/workspace/storage.ts:9-40` | closed |
| T-01-02 | Denial of Service | `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.ts` | mitigate | Startup ignores stale lesson ids and falls back to the first authored lesson instead of failing bootstrap. Evidence: `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.ts:37-48` | closed |
| T-01-03 | Tampering | `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.ts` | mitigate | Persistence writes only `activeLessonId` and `lessonDrafts`; compare and confirmation state stay in memory and reset on reopen. Evidence: `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.ts:71-82`, `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.ts:120-131` | closed |
| T-02-01 | Information Disclosure | `packages/admin-sdk-tutorial/src/workspace/lessonProse.ts` | mitigate | Lesson prose is tokenized into headings, paragraphs, bullets, code, and links without raw HTML passthrough. Evidence: `packages/admin-sdk-tutorial/src/workspace/lessonProse.ts:42-130` | closed |
| T-02-02 | Spoofing | `packages/admin-sdk-tutorial/src/App.vue` | mitigate | The preview area is explicitly labeled `Preview`, states that interactive output arrives in Phase 3, and exposes no run controls. Evidence: `packages/admin-sdk-tutorial/src/App.vue:433-444` | closed |
| T-02-03 | Denial of Service | `packages/admin-sdk-tutorial/src/App.vue` | mitigate | The shell reuses a single `useTutorialWorkspace()` state source rather than reloading lesson data in multiple UI branches. Evidence: `packages/admin-sdk-tutorial/src/App.vue:12-42`, `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.ts:110-280` | closed |
| T-03-01 | Tampering | `packages/admin-sdk-tutorial/src/App.vue` | mitigate | Solution compare renders in a separate read-only panel and never rebinds the editable draft buffer. Evidence: `packages/admin-sdk-tutorial/src/App.vue:399-429`, `packages/admin-sdk-tutorial/src/App.spec.ts:92-114` | closed |
| T-03-02 | Tampering | `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.ts` | mitigate | Restore starter is split into request/confirm actions and persists only after the destructive action is confirmed. Evidence: `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.ts:224-253`, `packages/admin-sdk-tutorial/src/App.spec.ts:116-138` | closed |
| T-03-03 | Repudiation | `packages/admin-sdk-tutorial/src/App.vue` | mitigate | Dirty lesson switches surface explicit copy that the draft stays saved locally before opening the next lesson. Evidence: `packages/admin-sdk-tutorial/src/App.vue:460-472`, `packages/admin-sdk-tutorial/tests/e2e/tutorial-workspace.spec.ts:73-80` | closed |
| T-04-01 | Repudiation | `packages/admin-sdk-tutorial/tests/e2e/tutorial-workspace.spec.ts` | mitigate | The browser suite asserts the refresh-and-recovery flow directly so persisted draft regressions cannot hide behind manual testing. Evidence: `packages/admin-sdk-tutorial/tests/e2e/tutorial-workspace.spec.ts:11-55` | closed |
| T-04-02 | Denial of Service | `packages/admin-sdk-tutorial/tests/e2e/tutorial-workspace.spec.ts` | mitigate | End-to-end coverage stays scoped to one focused spec with locator-based assertions, keeping verification fast and stable. Evidence: `packages/admin-sdk-tutorial/tests/e2e/tutorial-workspace.spec.ts:11-81` | closed |
| T-04-03 | Spoofing | `packages/admin-sdk-tutorial/src/App.spec.ts` | mitigate | Integration coverage verifies the compare and restore controls expose the intended labels and confirmation surfaces. Evidence: `packages/admin-sdk-tutorial/src/App.spec.ts:92-138` | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

No accepted risks.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-04-10 | 12 | 12 | 0 | Codex |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-04-10

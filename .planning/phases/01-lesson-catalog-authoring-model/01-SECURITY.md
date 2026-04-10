---
phase: 01
slug: lesson-catalog-authoring-model
status: verified
threats_open: 0
asvs_level: 1
created: 2026-04-10
---

# Phase 01 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Repo package config -> build/test tooling | Package-local scripts and Playwright config drive verification behavior for the tutorial package. | Local script commands and Vite/Playwright runtime settings |
| Authored lesson metadata -> loader/runtime | Lesson manifests choose which lesson assets and docs links are exposed to the runtime catalog. | Relative lesson bundle paths, file-role metadata, docs-link metadata |
| Manifest file references -> raw asset loader | The loader resolves manifest-declared asset paths into raw module contents. | Lesson-local markdown, starter/solution code, support files |
| Normalized catalog -> rendered browser UI | The browser UI trusts normalized catalog output for order, metadata, and rendered docs links. | Ordered lesson records, scenario metadata, canonical `/guide/...` hrefs |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-01-01 | Tampering | `packages/admin-sdk-tutorial/package.json` scripts | mitigate | Package-local `test:unit` and `test:e2e` scripts are explicit and non-watch (`vitest run`, `playwright test`). Evidence: `packages/admin-sdk-tutorial/package.json:16-17` | closed |
| T-01-02 | Denial of Service | `packages/admin-sdk-tutorial/playwright.config.ts` | mitigate | Playwright is scoped to `./tests/e2e` with a controlled package-local Vite web server and fixed localhost URL. Evidence: `packages/admin-sdk-tutorial/playwright.config.ts:4-25` | closed |
| T-01-03 | Tampering | `packages/admin-sdk-tutorial/src/catalog/types.ts` | mitigate | The manifest contract requires explicit `proseFile`, `starterFile`, `solutionFile`, `supportFiles`, and `primaryEditableFile`. Evidence: `packages/admin-sdk-tutorial/src/catalog/types.ts:29-40` | closed |
| T-02-01 | Tampering | `lesson.manifest.ts` files | mitigate | Seeded manifests keep lesson file references lesson-local and integrity tests enforce single editable starter plus required support files. Evidence: `packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification/lesson.manifest.ts:26-30`, `packages/admin-sdk-tutorial/src/catalog/manifestIntegrity.spec.ts:17-33` | closed |
| T-02-02 | Spoofing | `docsLinks` metadata | mitigate | Seeded docs links point only to canonical `/guide/...` routes and integrity tests enforce that prefix. Evidence: `packages/admin-sdk-tutorial/src/lessons/part-01-foundations/chapter-01-notifications/lesson-01-dispatch-notification/lesson.manifest.ts:20-24`, `packages/admin-sdk-tutorial/src/catalog/manifestIntegrity.spec.ts:36-43` | closed |
| T-02-03 | Information Disclosure | Lesson prose and support files | accept | Phase 1 lesson assets are intentionally repo-authored teaching materials and do not carry secret or user-provided data. Accepted risk documented below. | closed |
| T-03-01 | Tampering | `packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts` | mitigate | The loader only reads from explicit lesson globs and rejects absolute or escaping paths before resolution. Evidence: `packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts:6-28` | closed |
| T-03-02 | Information Disclosure | `packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts` | mitigate | The loader exposes only manifest-declared `proseFile`, `starterFile`, `solutionFile`, and `supportFiles`. Evidence: `packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts:48-72` | closed |
| T-03-03 | Denial of Service | `packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.ts` | mitigate | Normalization throws on conflicting part/chapter metadata and duplicate lesson ids, preventing nondeterministic catalog output. Evidence: `packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.ts:28-49` | closed |
| T-04-01 | Tampering | `packages/admin-sdk-tutorial/src/App.vue` | mitigate | The UI renders lesson rows directly from `loadLessonCatalog()` and the browser smoke test locks the concrete lesson order. Evidence: `packages/admin-sdk-tutorial/src/App.vue:2-5`, `packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts:11-16` | closed |
| T-04-02 | Information Disclosure | `packages/admin-sdk-tutorial/src/App.vue` | mitigate | Rendered docs links come from validated manifest metadata and Playwright asserts the exact allowed hrefs. Evidence: `packages/admin-sdk-tutorial/src/App.vue:61-71`, `packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts:17-20` | closed |
| T-04-03 | Denial of Service | `packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts` | mitigate | The browser smoke test stays narrowly scoped to a single deterministic spec with stable selectors and no external-service dependency. Evidence: `packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts:3-20` | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-01-01 | T-02-03 | The lesson prose and support files are first-party repo-authored teaching assets for the prototype, so exposing them in the tutorial bundle is intentional and does not disclose sensitive data. | Codex / gsd-secure-phase | 2026-04-10 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-04-10 | 12 | 12 | 0 | Codex + gsd-security-auditor |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-04-10

# Phase 1: Lesson Catalog & Authoring Model - Research

**Researched:** 2026-04-10 [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]
**Domain:** Repo-owned lesson content architecture for a Vue/Vite browser tutorial package inside the Meteor monorepo. [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/PROJECT.md]
**Confidence:** HIGH for repo-fit and package structure, MEDIUM for the one added markdown dependency recommendation. [VERIFIED: package.json] [VERIFIED: packages/component-library/package.json] [CITED: https://vite.dev/guide/features.html] [CITED: https://github.com/markdown-it/markdown-it]

<user_constraints>
## User Constraints (from CONTEXT.md)

Copied verbatim from `/Users/jannisleifeld/Sites/meteor/.planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md`. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]

### Locked Decisions
### Lesson hierarchy
- **D-01:** The tutorial model should support `parts -> chapters -> lessons` from the beginning, even in the first small prototype.

### Authoring format
- **D-02:** Lessons should use a hybrid authoring model.
- **D-03:** Teaching prose should live in Markdown-oriented content, while metadata, scenario wiring, and file references should live in typed manifests.

### Lesson asset packaging
- **D-04:** Each lesson should be stored as a small virtual file set rather than a single raw file.
- **D-05:** v1 should still expose one primary editable learner file per lesson, with supporting files kept fixed alongside it.

### Package and filesystem shape
- **D-06:** The new tutorial package should be content-first rather than app-first.
- **D-07:** The lesson tree should be the center of gravity in the package layout, with runtime and shell code supporting that content model.

### Docs relationship
- **D-08:** Tutorial content should be authored separately from `docs/admin-sdk`.
- **D-09:** Lessons should link back to canonical Admin SDK docs for deeper reading instead of directly reusing docs content.

### Claude's Discretion
- Exact field names and TypeScript shapes for manifests.
- Whether lesson prose is a single markdown file per lesson or a slightly more segmented content structure.
- Exact subdirectory naming under the content-first package, as long as the lesson tree remains the primary organizing principle.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LESS-01 | User can open an ordered list of tutorial lessons inside the browser. [VERIFIED: .planning/REQUIREMENTS.md] | Use an explicit course catalog index plus browser-loaded lesson manifests so ordering is declared, testable, and not inferred from filesystem sorting. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] [CITED: https://vite.dev/guide/features.html] |
| LEARN-03 | Tutorial authors can define starter code, solution code, lesson text, and scenario metadata for each lesson in a structured format inside the repo. [VERIFIED: .planning/REQUIREMENTS.md] | Use per-lesson folders with Markdown prose, raw starter and solution files, and typed manifests validated at load time. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] [CITED: https://vite.dev/guide/assets.html] [CITED: https://zod.dev/] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- New implementation work belongs in the existing `pnpm` workspace and Turborepo structure under `packages/`. [VERIFIED: AGENTS.md]
- Prefer source files over generated output. [VERIFIED: AGENTS.md]
- The repo already uses Vue 3, Vite, Vitest, Playwright, and package-local configs rather than one monolithic root app config. [VERIFIED: AGENTS.md] [VERIFIED: packages/component-library/package.json] [VERIFIED: examples/admin-sdk-app/package.json] [VERIFIED: packages/admin-sdk/package.json]
- Completed implementation work is expected to run linter autofix, Jest where relevant, and include good integration coverage. [VERIFIED: AGENTS.md]
- This research phase does not have a repo-root `CLAUDE.md` or any project skills under `.claude/skills` or `.agents/skills`. [VERIFIED: repo directory scan on 2026-04-10]

## Summary

Phase 1 should establish a content-first tutorial package whose primary responsibility is loading and exposing an ordered lesson catalog, not building a generic editor or runtime sandbox. The repo evidence already supports a Vue 3 + Vite package pattern, package-local tests, and browser-driven examples, while the phase decisions lock in a hybrid authoring model: Markdown for prose, typed manifests for scenario metadata, and repo-owned raw source files for starter and solution assets. [VERIFIED: .planning/PROJECT.md] [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] [VERIFIED: packages/component-library/package.json] [VERIFIED: examples/admin-sdk-app/package.json]

The safest implementation shape is an explicit top-level catalog that defines part, chapter, and lesson order, plus per-lesson folders that each contain `lesson.manifest.ts`, `content.md`, `starter/*`, `solution/*`, and optional fixed support files. Vite already supports glob-based module discovery and raw string imports, which means the package can stay entirely repo-owned and statically analyzable without inventing a custom loader or pulling in a CMS-style content system. [CITED: https://vite.dev/guide/features.html] [CITED: https://vite.dev/guide/assets.html] [VERIFIED: packages/component-library/src/components/icons-media/mt-icon/mt-icon.vue]

The main planning risk is overgeneralization. If Phase 1 introduces generic multi-file editing, frontmatter-driven everything, or filesystem-derived ordering, later phases will inherit unnecessary complexity. Keep the authoring surface intentionally narrow: one editable learner file, fixed companion files, typed scenario metadata, and a browser-visible catalog with no generic IDE semantics. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]

**Primary recommendation:** Build a new content-first package under `packages/` with an explicit `parts -> chapters -> lessons` catalog, per-lesson folders, Markdown prose rendered from raw imports, and typed manifests validated on load. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] [CITED: https://vite.dev/guide/features.html] [CITED: https://vite.dev/guide/assets.html] [CITED: https://zod.dev/]

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `vue` | `^3.5.0` from `examples/admin-sdk-app` [VERIFIED: examples/admin-sdk-app/package.json] | Render the lesson catalog and authoring-driven tutorial UI in-browser. [VERIFIED: examples/admin-sdk-app/package.json] | Vue 3 is already the repo’s active browser UI framework in examples and the component library. [VERIFIED: AGENTS.md] [VERIFIED: packages/component-library/package.json] [VERIFIED: examples/admin-sdk-app/package.json] |
| `vite` | `^5.1.4` from `examples/admin-sdk-app` [VERIFIED: examples/admin-sdk-app/package.json] | Package-local dev server and browser build pipeline for the new tutorial package. [VERIFIED: examples/admin-sdk-app/package.json] | Vite is already used for browser-facing packages and supports static glob imports and raw asset loading needed for lesson content ingestion. [VERIFIED: packages/component-library/vite.config.ts] [VERIFIED: examples/admin-sdk-app/src/server.ts] [CITED: https://vite.dev/guide/features.html] [CITED: https://vite.dev/guide/assets.html] |
| `typescript` | `^5.3.3` from `examples/admin-sdk-app` [VERIFIED: examples/admin-sdk-app/package.json] | Define the lesson, chapter, and catalog contracts in typed manifests. [VERIFIED: examples/admin-sdk-app/package.json] | The repo’s package code and Admin SDK docs/examples are TypeScript-centric, and typed manifests directly match the locked authoring decision. [VERIFIED: AGENTS.md] [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] |
| `@shopware-ag/meteor-admin-sdk` | `workspace:*` [VERIFIED: examples/admin-sdk-app/package.json] | Keep the tutorial package aligned with the real SDK surface from the start, even if Phase 1 only needs metadata links and future-proofing. [VERIFIED: .planning/PROJECT.md] | The project constraint explicitly requires teaching actual Admin SDK semantics. [VERIFIED: .planning/PROJECT.md] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `markdown-it` | latest stable at implementation time; verify before install. [CITED: https://www.npmjs.com/package/markdown-it] [ASSUMED] | Convert repo-authored lesson Markdown into HTML in the browser. [CITED: https://www.npmjs.com/package/markdown-it] | Use it if Phase 1 renders lesson prose now instead of deferring rendering to Phase 2. It is safe by default and supports CommonMark plus extensions. [CITED: https://github.com/markdown-it/markdown-it] |
| `zod` | `^3.25.75` already used in the workspace, while official docs confirm Zod 4 is now stable upstream. [VERIFIED: packages/tokens/package.json] [VERIFIED: packages/icon-kit/package.json] [CITED: https://zod.dev/] | Validate lesson manifests and produce actionable errors when authoring data is malformed. [CITED: https://zod.dev/] | Use it if you want runtime validation for manifests; prefer the workspace-major already in use to avoid introducing both Zod 3 and Zod 4 into the same repo area. [VERIFIED: packages/tokens/package.json] [VERIFIED: packages/icon-kit/package.json] [ASSUMED] |
| `vitest` | `^3.0.5` to `^3.0.9` already used in active packages. [VERIFIED: packages/component-library/package.json] [VERIFIED: packages/tokens/package.json] [VERIFIED: packages/icon-kit/package.json] | Unit and integration tests for catalog loading, manifest validation, and lesson ordering. [VERIFIED: packages/component-library/package.json] | Use for fast package-local coverage because it already runs in `jsdom` in the repo and matches Vite. [VERIFIED: packages/component-library/vitest.config.ts] |
| `@playwright/test` | `^1.45.0` in `packages/admin-sdk`. [VERIFIED: packages/admin-sdk/package.json] | Browser smoke coverage for “ordered list of lessons visible in browser.” [VERIFIED: .planning/REQUIREMENTS.md] | Use for one thin browser check once the package renders the catalog in a real page. [VERIFIED: packages/admin-sdk/playwright.config.ts] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Markdown prose + typed manifest | Frontmatter-only Markdown files | Frontmatter collapses content and scenario wiring into one document, which conflicts with the locked decision to keep prose and typed metadata separate. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] |
| Explicit course catalog index | Filesystem sort by folder names | Filesystem order is brittle, hard to review, and too implicit for requirement `LESS-01`. [VERIFIED: .planning/REQUIREMENTS.md] [ASSUMED] |
| One editable learner file + fixed support files | Generic multi-file editor model | Generic multi-file authoring broadens scope toward v2 `AUTHR-01` and violates the narrow prototype boundary. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: .planning/PROJECT.md] |
| Vite raw/glob imports | Custom FS loader or runtime fetch manifest | Custom loaders add maintenance without buying capability that Vite already provides statically. [CITED: https://vite.dev/guide/features.html] [CITED: https://vite.dev/guide/assets.html] |

**Installation:** Add only the missing content-layer dependency unless you confirm the package needs stronger runtime validation immediately. [VERIFIED: packages/component-library/package.json] [VERIFIED: packages/tokens/package.json]

```bash
pnpm --dir packages/<tutorial-package> add markdown-it
pnpm --dir packages/<tutorial-package> add -D vitest @playwright/test
```

**Version verification:** `markdown-it` should be verified at install time because an authoritative package page was identifiable in-session but not safely extractable as a precise version line through the available tooling. [CITED: https://www.npmjs.com/package/markdown-it] [ASSUMED] `zod` official docs confirm that Zod 4 is stable, but the current workspace already uses `3.25.75`, so reusing the existing major is the safer repo-fit recommendation for this phase. [CITED: https://zod.dev/] [VERIFIED: packages/tokens/package.json] [VERIFIED: packages/icon-kit/package.json]

## Architecture Patterns

### Recommended Project Structure

```text
packages/
└── <tutorial-package>/                         # New content-first tutorial package [VERIFIED: .planning/PROJECT.md]
    ├── package.json                           # Package-local scripts and deps [VERIFIED: AGENTS.md]
    ├── vite.config.ts                         # Browser dev/build entry [VERIFIED: examples/admin-sdk-app/package.json]
    ├── vitest.config.ts                       # Package-local unit/integration tests [VERIFIED: packages/component-library/vitest.config.ts]
    ├── playwright.config.ts                   # Thin browser smoke test [VERIFIED: packages/admin-sdk/playwright.config.ts]
    ├── src/
    │   ├── app/                               # Minimal browser app shell for Phase 1 catalog UI [ASSUMED]
    │   ├── catalog/                           # Catalog loader, types, selectors [ASSUMED]
    │   ├── content/
    │   │   ├── catalog.ts                     # Explicit parts/chapters/lessons order [ASSUMED]
    │   │   └── parts/
    │   │       └── <part-slug>/
    │   │           └── <chapter-slug>/
    │   │               └── <lesson-slug>/
    │   │                   ├── lesson.manifest.ts
    │   │                   ├── content.md
    │   │                   ├── starter/
    │   │                   │   ├── main.ts
    │   │                   │   └── support.ts
    │   │                   └── solution/
    │   │                       ├── main.ts
    │   │                       └── support.ts
    │   └── index.ts
    └── e2e/
        └── lesson-catalog.spec.ts
```

### Pattern 1: Explicit Catalog Index

**What:** Maintain one top-level `catalog.ts` that declares the ordered part, chapter, and lesson IDs, then resolve actual lesson content from those IDs. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] [ASSUMED]
**When to use:** Always for Phase 1, because order is a product decision, not an implementation accident. [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/REQUIREMENTS.md]
**Example:**

```ts
// Source inspiration: Vite glob imports + locked course hierarchy decisions.
// https://vite.dev/guide/features.html
export const courseCatalog = [
  {
    id: "part-1",
    title: "Getting Started",
    chapters: [
      {
        id: "chapter-1",
        title: "Notifications",
        lessons: ["hello-notification", "notification-actions"],
      },
    ],
  },
] as const;
```

### Pattern 2: Lesson Folder as Virtual File Set

**What:** Treat each lesson as a folder containing authored prose, a typed manifest, and two parallel virtual file sets: starter and solution. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]
**When to use:** For every lesson, even if the starter/solution only differ in one file, because Phase 1 explicitly needs structured starter code and solution code in-repo. [VERIFIED: .planning/REQUIREMENTS.md]
**Example:**

```ts
// Source inspiration: Zod parse flow + repo decision to separate prose from typed metadata.
// https://zod.dev/
import { z } from "zod";

export const lessonManifestSchema = z.object({
  id: z.string(),
  title: z.string(),
  editableFile: z.string(),
  docsLinks: z.array(z.string().url()),
  scenario: z.object({
    type: z.enum(["notification", "location", "position"]),
  }),
});

export type LessonManifest = z.infer<typeof lessonManifestSchema>;
```

### Pattern 3: Vite-Native Content Loading

**What:** Load lesson manifests as modules and lesson Markdown/code files as raw strings via `import.meta.glob` and `?raw`. [CITED: https://vite.dev/guide/features.html] [CITED: https://vite.dev/guide/assets.html]
**When to use:** For all authored lesson assets so the package remains statically analyzable and repo-owned. [VERIFIED: .planning/PROJECT.md]
**Example:**

```ts
// Source: https://vite.dev/guide/features.html and https://vite.dev/guide/assets.html
const manifestModules = import.meta.glob("./content/parts/**/lesson.manifest.ts", {
  eager: true,
});

const markdownModules = import.meta.glob("./content/parts/**/content.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const starterModules = import.meta.glob("./content/parts/**/starter/**/*", {
  query: "?raw",
  import: "default",
  eager: true,
});
```

### Anti-Patterns to Avoid

- **Filesystem-is-the-catalog:** Do not let folder names or alphabetical order determine lesson sequence. That makes product ordering implicit and fragile. [VERIFIED: .planning/REQUIREMENTS.md] [ASSUMED]
- **Manifest-everything Markdown frontmatter:** Do not collapse scenario wiring, lesson copy, and code assets into one MD file. The locked decision already rejects that shape. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]
- **Generic IDE semantics:** Do not expose arbitrary file creation, deletion, or multi-file editing in Phase 1. That belongs to deferred v2 authoring depth. [VERIFIED: .planning/REQUIREMENTS.md]
- **Runtime fetch authoring model:** Do not fetch lesson JSON over HTTP from inside the package when all content lives in-repo. Static imports are simpler and more deterministic. [VERIFIED: .planning/PROJECT.md] [CITED: https://vite.dev/guide/features.html]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown rendering | Regex-based markdown parser | `markdown-it` | Markdown parsing has edge cases, plugins, and security-related defaults already handled by a mature parser. [CITED: https://github.com/markdown-it/markdown-it] |
| Manifest validation | Ad hoc `if` chains spread through loaders | One central schema validator, preferably `zod` | Authoring errors should fail fast with useful diagnostics instead of producing partial catalogs or silent drift. [CITED: https://zod.dev/] [ASSUMED] |
| Content discovery | Manual import lists per lesson file | `import.meta.glob` | Vite already supports glob imports and raw asset loading with literal paths. [CITED: https://vite.dev/guide/features.html] [CITED: https://vite.dev/guide/assets.html] |
| Lesson ordering | Alphabetical folder naming conventions | Explicit `catalog.ts` order | Requirement `LESS-01` is about a stable ordered lesson list, not incidental filename order. [VERIFIED: .planning/REQUIREMENTS.md] |
| v1 authoring surface | A general-purpose virtual IDE model | One editable file plus fixed support files | The roadmap and out-of-scope list explicitly reject generic browser IDE scope. [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/REQUIREMENTS.md] |

**Key insight:** The complexity in this phase is not rendering a list, it is preserving a narrow authoring contract that later runtime phases can consume without reopening content structure decisions. [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]

## Common Pitfalls

### Pitfall 1: Deriving Order from Paths

**What goes wrong:** Lessons render in a surprising or unstable order because code sorts slugs or depends on glob result order. [ASSUMED]
**Why it happens:** Static discovery is convenient, so teams skip an explicit course index. [ASSUMED]
**How to avoid:** Keep one canonical catalog index that references lesson IDs and use tests to assert visible order. [VERIFIED: .planning/REQUIREMENTS.md] [ASSUMED]
**Warning signs:** A rename changes lesson order or two engineers disagree about where a new lesson should appear. [ASSUMED]

### Pitfall 2: Letting the Manifest Become a Mini CMS

**What goes wrong:** Phase 1 grows fields for arbitrary tabs, multiple editors, dynamic dependencies, and configurable run pipelines. [ASSUMED]
**Why it happens:** The manifest becomes the easiest place to encode future ideas. [ASSUMED]
**How to avoid:** Allow only fields needed for `LESS-01` and `LEARN-03`, plus the already-decided scenario metadata and docs links. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]
**Warning signs:** New manifest fields describe editor chrome, package installation, or runtime orchestration rather than lesson content. [ASSUMED]

### Pitfall 3: Mixing Prose and Wiring Too Tightly

**What goes wrong:** Every lesson edit touches code, metadata, and prose in one file, which makes reviews noisy and reuse harder. [ASSUMED]
**Why it happens:** Frontmatter or MDX feels convenient early on. [ASSUMED]
**How to avoid:** Keep prose in Markdown and keep lesson behavior in typed manifests. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]
**Warning signs:** Non-technical content edits trigger TypeScript changes or manifest merge conflicts. [ASSUMED]

### Pitfall 4: Non-Literal Vite Globs

**What goes wrong:** Content loading breaks at build time because glob arguments are built from variables or unsupported alias patterns. [CITED: https://vite.dev/guide/features.html]
**Why it happens:** `import.meta.glob` is convenient, but Vite requires literal glob arguments. [CITED: https://vite.dev/guide/features.html]
**How to avoid:** Keep glob patterns literal and relative to the loader module. [CITED: https://vite.dev/guide/features.html]
**Warning signs:** Loader code starts concatenating strings to form glob paths. [ASSUMED]

## Code Examples

Verified patterns from official sources and repo evidence:

### Vite Raw Asset Loading for Lesson Prose

```ts
// Source: https://vite.dev/guide/assets.html
import content from "./content.md?raw";
```

### Vite Glob Loader for Lesson Files

```ts
// Source: https://vite.dev/guide/features.html
const modules = import.meta.glob("./parts/**/content.md", {
  query: "?raw",
  import: "default",
});
```

### Repo-Proven `import.meta.glob` Pattern

```ts
// Source pattern: packages/component-library/src/components/icons-media/mt-icon/mt-icon.vue
const icons = import.meta.glob("/node_modules/@shopware-ag/meteor-icon-kit/icons/**/*.svg", {
  import: "default",
  eager: false,
});
```

### Zod Validation Shape

```ts
// Source: https://zod.dev/
import * as z from "zod";

const Lesson = z.object({
  id: z.string(),
  title: z.string(),
});

const result = Lesson.safeParse(input);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Filesystem order or route order as content model | Explicit catalog indexes plus statically discovered content modules | Established Vite-era content loading pattern; exact ecosystem date not material here. [CITED: https://vite.dev/guide/features.html] [ASSUMED] | Keeps lesson order reviewable and testable. [ASSUMED] |
| Monolithic MDX/frontmatter tutorial files | Split prose Markdown plus typed metadata/manifests | Matches the user’s locked phase decision from 2026-04-10. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] | Makes content editing and runtime wiring easier to review independently. [ASSUMED] |
| General-purpose embedded IDEs for learning | Constrained lesson sandboxes with explicit file models | Reflected by this project’s out-of-scope line against generic browser IDE behavior. [VERIFIED: .planning/REQUIREMENTS.md] | Prevents Phase 1 from absorbing v2 authoring scope. [VERIFIED: .planning/REQUIREMENTS.md] |

**Deprecated/outdated:**
- Frontmatter-only lesson configuration is the wrong fit for this phase because it violates the locked separation between prose and typed manifests. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]
- Generic multi-file authoring is explicitly v2 scope, not Phase 1. [VERIFIED: .planning/REQUIREMENTS.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Reusing workspace `zod` 3.x is preferable to introducing `zod` 4 for this phase. [ASSUMED] | Standard Stack | Low to medium. The plan may need a dependency decision task if the team prefers the latest major everywhere. |
| A2 | The new tutorial package should use an explicit `src/app`, `src/catalog`, and `src/content` split. [ASSUMED] | Architecture Patterns | Low. Naming can change without affecting the underlying content-first approach. |
| A3 | Phase 1 will render lesson prose now rather than deferring all Markdown rendering to Phase 2. [ASSUMED] | Standard Stack | Medium. If prose rendering is deferred, `markdown-it` can move to a later phase. |
| A4 | Glob result order should not be trusted across environments, so explicit catalog order is required. [ASSUMED] | Common Pitfalls | Low. Even if current environments appear stable, explicit order is still safer for planning. |

## Open Questions

1. **What exact package name should the tutorial use under `packages/`?** [ASSUMED]
   What we know: It must live in `packages/` as a new package inside the workspace. [VERIFIED: .planning/PROJECT.md]
   What's unclear: The final published or private package name is not yet locked. [ASSUMED]
   Recommendation: Decide the package name in planning so test commands and import paths stay stable. [ASSUMED]

2. **Should lesson prose stay as one `content.md` file or be segmented?** [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]
   What we know: Markdown prose plus typed manifests is locked, but the exact file granularity is left to discretion. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]
   What's unclear: Whether one file is enough for future step-by-step narration. [ASSUMED]
   Recommendation: Start with one `content.md` per lesson and only split when Phase 2 exposes a concrete need. [ASSUMED]

3. **Should docs links point at repo paths, deployed docs URLs, or both?** [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] [VERIFIED: docs/admin-sdk/README.md]
   What we know: Lessons should link back to canonical Admin SDK docs rather than duplicate them. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]
   What's unclear: Whether the tutorial runtime should store canonical public URLs, repo-relative paths, or both. [ASSUMED]
   Recommendation: Store canonical public URLs in manifests and optionally keep repo-relative references only for maintainer comments or tests. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite dev/build and test scripts | ✓ [VERIFIED: node --version] | `v22.13.1` [VERIFIED: node --version] | — |
| npm | Registry and script fallback | ✓ [VERIFIED: npm --version] | `10.9.2` [VERIFIED: npm --version] | — |
| pnpm | Workspace-native installs and package scripts | ✗ on this machine right now; invocation failed under Corepack signature verification. [VERIFIED: pnpm --version] | configured as `10.12.3` in root metadata, but current command failed before reporting a usable version. [VERIFIED: package.json] [VERIFIED: pnpm --version] | Limited fallback: `npm` can inspect metadata, but real workspace execution should fix `pnpm` first. [ASSUMED] |
| Python 3 | Not required by this phase, but present for repo tooling if needed | ✓ [VERIFIED: python3 --version] | `3.14.4` [VERIFIED: python3 --version] | — |
| Global Jest CLI | Not required for planning this package; package-local test runners are the standard pattern | ✗ globally. [VERIFIED: command -v jest >/dev/null 2>&1 && jest --version || true] | — | Use package-local scripts instead. [VERIFIED: packages/admin-sdk/package.json] [VERIFIED: packages/create-meteor-extension/package.json] |

**Missing dependencies with no fallback:**
- `pnpm` is effectively blocked until the Corepack signature issue is fixed, which will block normal workspace installs and test runs for implementation. [VERIFIED: pnpm --version]

**Missing dependencies with fallback:**
- No global Jest CLI is present, but package-local Jest or Vitest usage is already the repo norm. [VERIFIED: packages/admin-sdk/package.json] [VERIFIED: packages/component-library/package.json] [VERIFIED: packages/create-meteor-extension/package.json]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.x for unit/integration plus Playwright 1.45+ for browser smoke coverage. [VERIFIED: packages/component-library/package.json] [VERIFIED: packages/admin-sdk/package.json] |
| Config file | `packages/<tutorial-package>/vitest.config.ts` and `packages/<tutorial-package>/playwright.config.ts` should be created in Wave 0 because the package does not exist yet. [ASSUMED] |
| Quick run command | `pnpm --dir packages/<tutorial-package> test:unit --run` after the package exists and `pnpm` is repaired. [ASSUMED] |
| Full suite command | `pnpm --dir packages/<tutorial-package> test:unit --run` plus `pnpm --dir packages/<tutorial-package> test:e2e --project=chromium`. [ASSUMED] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LESS-01 | Ordered lesson list renders in the browser. [VERIFIED: .planning/REQUIREMENTS.md] | Playwright smoke plus one integration test around catalog ordering. [ASSUMED] | `pnpm --dir packages/<tutorial-package> test:e2e --project=chromium` [ASSUMED] | ❌ Wave 0 [ASSUMED] |
| LEARN-03 | Starter code, solution code, lesson text, and scenario metadata load from structured repo content. [VERIFIED: .planning/REQUIREMENTS.md] | Vitest unit/integration around manifest validation and asset loading. [ASSUMED] | `pnpm --dir packages/<tutorial-package> test:unit --run` [ASSUMED] | ❌ Wave 0 [ASSUMED] |

### Sampling Rate

- **Per task commit:** `pnpm --dir packages/<tutorial-package> test:unit --run` once the package exists. [ASSUMED]
- **Per wave merge:** Unit/integration plus one browser smoke test. [ASSUMED]
- **Phase gate:** Catalog browser list and structured authoring loader must both be green before `/gsd-verify-work`. [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/REQUIREMENTS.md] [ASSUMED]

### Wave 0 Gaps

- [ ] `packages/<tutorial-package>/package.json` with package-local scripts. [ASSUMED]
- [ ] `packages/<tutorial-package>/vitest.config.ts` and optional `vitest.setup.ts`. [ASSUMED]
- [ ] `packages/<tutorial-package>/playwright.config.ts`. [ASSUMED]
- [ ] `packages/<tutorial-package>/src/catalog/lesson-catalog.spec.ts` for order and manifest-shape tests. [ASSUMED]
- [ ] `packages/<tutorial-package>/e2e/lesson-catalog.spec.ts` for browser-visible list coverage. [ASSUMED]
- [ ] `pnpm` repair before normal workspace installs or package-local test execution. [VERIFIED: pnpm --version]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no. [VERIFIED: .planning/PROJECT.md] | No auth is in scope for this browser-local prototype phase. [VERIFIED: .planning/PROJECT.md] |
| V3 Session Management | no. [VERIFIED: .planning/PROJECT.md] | Browser refresh persistence is a later phase concern, not authenticated session handling. [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/REQUIREMENTS.md] |
| V4 Access Control | no. [VERIFIED: .planning/PROJECT.md] | No user-role system or privilege model is introduced in Phase 1. [VERIFIED: .planning/PROJECT.md] |
| V5 Input Validation | yes. [VERIFIED: .planning/REQUIREMENTS.md] | Validate manifests at load time with typed schemas or equivalent centralized validation. [CITED: https://zod.dev/] [ASSUMED] |
| V6 Cryptography | no. [VERIFIED: .planning/PROJECT.md] | No crypto requirement appears in this phase scope. [VERIFIED: .planning/PROJECT.md] |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Unsafely rendering authored Markdown into `v-html` | Tampering / XSS | Use a mature Markdown parser and keep HTML disabled by default unless there is an explicit need for raw HTML. [CITED: https://github.com/markdown-it/markdown-it] |
| Silent authoring drift from malformed manifests | Tampering | Fail fast on manifest validation during catalog load. [CITED: https://zod.dev/] [ASSUMED] |
| Over-broad runtime file loading | Tampering | Keep Vite glob patterns literal and scoped to lesson content directories only. [CITED: https://vite.dev/guide/features.html] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md` - locked decisions, discretion areas, and canonical references. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md]
- `.planning/REQUIREMENTS.md` - exact requirement text for `LESS-01` and `LEARN-03`, plus v2 scope boundaries. [VERIFIED: .planning/REQUIREMENTS.md]
- `.planning/PROJECT.md` - package placement, prototype scope, and non-negotiable constraints. [VERIFIED: .planning/PROJECT.md]
- `.planning/ROADMAP.md` - phase goal, success criteria, and sequencing. [VERIFIED: .planning/ROADMAP.md]
- `AGENTS.md` - repo workflow expectations and monorepo orientation. [VERIFIED: AGENTS.md]
- `packages/component-library/package.json` - active Vue/Vite/Vitest/browser UI package patterns and existing `codemirror` availability. [VERIFIED: packages/component-library/package.json]
- `examples/admin-sdk-app/package.json` and `examples/admin-sdk-app/src/server.ts` - closest existing browser-app pattern in the repo. [VERIFIED: examples/admin-sdk-app/package.json] [VERIFIED: examples/admin-sdk-app/src/server.ts]
- `packages/component-library/src/components/icons-media/mt-icon/mt-icon.vue` - repo-proven `import.meta.glob` usage. [VERIFIED: packages/component-library/src/components/icons-media/mt-icon/mt-icon.vue]
- `https://vite.dev/guide/features.html` - official `import.meta.glob`, `query`, and caveat behavior. [CITED: https://vite.dev/guide/features.html]
- `https://vite.dev/guide/assets.html` - official `?raw` string import behavior. [CITED: https://vite.dev/guide/assets.html]

### Secondary (MEDIUM confidence)

- `https://github.com/markdown-it/markdown-it` - official README for parser capabilities and default safety posture. [CITED: https://github.com/markdown-it/markdown-it]
- `https://www.npmjs.com/package/markdown-it` - authoritative package page used to confirm the package exists and should be version-checked again at install time. [CITED: https://www.npmjs.com/package/markdown-it]
- `https://zod.dev/` - official Zod parse and schema guidance, plus confirmation that Zod 4 is stable upstream. [CITED: https://zod.dev/]

### Tertiary (LOW confidence)

- None. [VERIFIED: current research session]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH for Vue/Vite/Vitest/Playwright repo fit, MEDIUM for the `markdown-it` addition because the repo does not already use a markdown renderer. [VERIFIED: packages/component-library/package.json] [VERIFIED: examples/admin-sdk-app/package.json] [VERIFIED: packages/admin-sdk/package.json] [CITED: https://www.npmjs.com/package/markdown-it]
- Architecture: HIGH because it is directly constrained by locked decisions and aligns with Vite’s documented static content-loading model. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] [CITED: https://vite.dev/guide/features.html] [CITED: https://vite.dev/guide/assets.html]
- Pitfalls: MEDIUM because several are evidence-based planning inferences rather than repo incidents already observed here. [ASSUMED]

**Research date:** 2026-04-10 [VERIFIED: current session]
**Valid until:** 2026-05-10 for repo-fit findings, or sooner if the package manager/toolchain situation changes. [ASSUMED]

# Phase 1: Lesson Catalog & Authoring Model - Research

**Researched:** 2026-04-10
**Domain:** Repo-owned Vue/Vite lesson catalog and authoring model for the Meteor Admin SDK tutorial package
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** The tutorial model should support `parts -> chapters -> lessons` from the beginning, even in the first small prototype.
- **D-02:** Lessons should use a hybrid authoring model.
- **D-03:** Teaching prose should live in Markdown-oriented content, while metadata, scenario wiring, and file references should live in typed manifests.
- **D-04:** Each lesson should be stored as a small virtual file set rather than a single raw file.
- **D-05:** v1 should still expose one primary editable learner file per lesson, with supporting files kept fixed alongside it.
- **D-06:** The new tutorial package should be content-first rather than app-first.
- **D-07:** The lesson tree should be the center of gravity in the package layout, with runtime and shell code supporting that content model.
- **D-08:** Tutorial content should be authored separately from `docs/admin-sdk`.
- **D-09:** Lessons should link back to canonical Admin SDK docs for deeper reading instead of directly reusing docs content.

### the agent's Discretion
- Exact field names and TypeScript shapes for manifests.
- Whether lesson prose is a single markdown file per lesson or a slightly more segmented content structure.
- Exact subdirectory naming under the content-first package, as long as the lesson tree remains the primary organizing principle.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<project_constraints>
## Project Constraints (from AGENTS.md)

- New implementation must stay inside the GSD workflow rather than as ad hoc repo edits. [VERIFIED: AGENTS.md]
- The tutorial belongs in a new workspace package under `packages/`. [VERIFIED: AGENTS.md, .planning/PROJECT.md, pnpm-workspace.yaml]
- After implementation work, run the linter with autofix, but only fix linter errors caused by the change set. [VERIFIED: AGENTS.md]
- After implementation work, run Jest. [VERIFIED: AGENTS.md]
- New code needs good integration coverage, not just unit coverage. [VERIFIED: AGENTS.md]
- Comments should explain only non-obvious intent or constraints. [VERIFIED: AGENTS.md]
- Use GitHub MCP for GitHub-related work. [VERIFIED: AGENTS.md]
- Use subagents for context-heavy work when they materially help. [VERIFIED: AGENTS.md]
</project_constraints>

<research_summary>
## Summary

Phase 1 should be implemented as a new content-first workspace package at `packages/admin-sdk-tutorial/`. The repo already uses Vue 3 and Vite for new browser-facing code, and those conventions are a better fit than copying the older `packages/admin-sdk` build setup. [VERIFIED: examples/admin-sdk-app/package.json, examples/nuxt-app/package.json, packages/component-library/package.json, packages/admin-sdk/package.json]

The phase should lock down a typed lesson manifest model, a deterministic catalog loader, and a minimal browser-visible ordered lesson list that proves `LESS-01` and `LEARN-03`. It should not drift into the browser run loop, fake admin shell, or generic multi-file IDE behavior yet. The strongest repo-aligned pattern is to colocate lesson prose, starter code, solution code, and fixed support files per lesson, then assemble the `parts -> chapters -> lessons` tree through static module discovery rather than a hand-maintained central registry. [VERIFIED: .planning/ROADMAP.md, .planning/REQUIREMENTS.md, .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md, packages/component-library/src/components/icons-media/mt-icon/mt-icon.vue]

**Primary recommendation:** Build a new Vue 3 + Vite package at `packages/admin-sdk-tutorial/` with a content-first `src/lessons/**` tree, typed lesson manifests, a loader based on `import.meta.glob`, and tests that prove explicit ordering, manifest completeness, and a browser-rendered lesson catalog.
</research_summary>

<standard_stack>
## Standard Stack

The established repo-aligned tools for this phase are:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `vue` | `^3.5.0` | Render the tutorial package UI and lesson catalog | Current browser-facing examples in the repo use Vue 3. [VERIFIED: examples/admin-sdk-app/package.json, examples/nuxt-app/package.json] |
| `vite` | `^5.1.4` | Bundle the tutorial package, support module discovery, and serve the browser app | The repo already uses Vite for new app-style packages and examples. [VERIFIED: examples/admin-sdk-app/package.json] |
| `@vitejs/plugin-vue` | `^4.6.2` | Vite integration for Vue SFCs | Present in the existing Vue 3 example app. [VERIFIED: examples/admin-sdk-app/package.json] |
| `typescript` | `^5.3.3` | Define the typed lesson manifest contracts and loaders | Existing Vue 3 example packages rely on TypeScript 5.x. [VERIFIED: examples/admin-sdk-app/package.json, packages/component-library/package.json] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `vitest` | `^3.0.5` | Fast unit/integration coverage for catalog building and manifest validation | Use for all loader, ordering, and manifest-shape verification in this phase. [VERIFIED: packages/component-library/package.json, packages/component-library/vitest.config.ts] |
| `@playwright/test` | `^1.45.0` | Browser-level proof that the ordered lesson list renders | Use for `LESS-01`, because the requirement is explicitly browser-visible. [VERIFIED: packages/component-library/playwright.config.ts, examples/nuxt-app/package.json] |
| `@shopware-ag/meteor-admin-sdk` | `workspace:*` | Anchor lesson scenarios to real SDK semantics and future tutorial runtime work | Use as a dependency target so the tutorial package stays aligned with the real SDK surface. [VERIFIED: .planning/PROJECT.md, packages/component-library/package.json, examples/admin-sdk-app/package.json] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain Vite Vue package | Nuxt 3 | Nuxt already exists in-repo, but it adds routing/runtime complexity that Phase 1 does not need. [VERIFIED: examples/nuxt-app/package.json] |
| Colocated lesson modules | Central giant catalog manifest | A single central manifest is easier to start but becomes brittle, duplicates file paths, and fights the content-first constraint. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] |
| Raw Markdown source in lesson folders | Directly merging lesson text into TS-only manifest files | TS-only lesson prose makes authoring, reviewing, and docs-linking harder, and contradicts the Markdown-oriented decision. [VERIFIED: .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] |

**Installation:**
```bash
pnpm --dir packages/admin-sdk-tutorial add vue @shopware-ag/meteor-admin-sdk
pnpm --dir packages/admin-sdk-tutorial add -D vite @vitejs/plugin-vue typescript vitest @playwright/test
```

**Version verification:** These versions are verified against the repo's current package manifests rather than external registries. [VERIFIED: examples/admin-sdk-app/package.json, packages/component-library/package.json]
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
packages/admin-sdk-tutorial/
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── src/
│   ├── app/                    # Minimal tutorial shell for the browser-visible lesson list
│   ├── catalog/                # Lesson types, loaders, and tree normalization
│   ├── lessons/
│   │   └── part-01/
│   │       └── chapter-01/
│   │           └── notification-basics/
│   │               ├── lesson.manifest.ts
│   │               ├── lesson.md
│   │               ├── starter.ts
│   │               ├── solution.ts
│   │               └── support/
│   │                   └── constants.ts
│   └── main.ts
└── tests/
    └── e2e/
```

### Pattern 1: Colocated Lesson Bundles
**What:** Each lesson owns its own prose, manifest, starter code, solution code, and fixed support files in a single folder.
**When to use:** Always. This is the simplest way to satisfy the hybrid authoring model and virtual file set decision without opening generic multi-file authoring.
**Example:**
```ts
export interface TutorialLessonManifest {
  id: string;
  title: string;
  order: number;
  part: { id: string; title: string; order: number };
  chapter: { id: string; title: string; order: number };
  editableFile: "starter.ts";
  supportFiles: string[];
  docsLinks: Array<{ label: string; href: string }>;
  scenario: { kind: "notification" | "location" | "position" };
}
```
Source: repo constraints plus phase decisions. [ASSUMED]

### Pattern 2: Static Catalog Discovery With Explicit Ordering
**What:** Discover lesson manifests with `import.meta.glob`, then sort by explicit `order` fields for parts, chapters, and lessons.
**When to use:** During app bootstrap and test fixtures; never rely on filesystem order or glob result order.
**Example:**
```ts
const lessonModules = import.meta.glob("./lessons/**/lesson.manifest.ts", {
  import: "default",
  eager: true
});
```
Source pattern: `import.meta.glob` usage already exists in the repo. [VERIFIED: packages/component-library/src/components/icons-media/mt-icon/mt-icon.vue]

### Pattern 3: Runtime-Seam Metadata, Not Runtime Implementation
**What:** Record scenario metadata now so later phases can branch into hidden-iframe vs rendered-surface behavior without restructuring the lesson model.
**When to use:** Manifest design only; actual runtime branching remains for later phases.
**Example:**
```ts
type LessonScenario =
  | { kind: "notification"; runtimeSurface: "rendered" }
  | { kind: "location"; runtimeSurface: "hidden-and-rendered" };
```
Source motivation: the Admin SDK example already branches by runtime surface. [VERIFIED: examples/admin-sdk-app/src/frontend/main.ts] [ASSUMED: exact field names]

### Anti-Patterns to Avoid
- **Filesystem-order catalogs:** Glob and directory ordering are not the product contract. Put `order` on every part, chapter, and lesson.
- **TS-only lesson prose:** Keeping lesson text inside TS manifests makes authoring and reviewing worse, and violates the Markdown-oriented decision.
- **Generic IDE scope creep:** Do not plan package installation, terminal emulation, arbitrary file creation, or unrestricted multi-file editing into Phase 1.
- **Docs duplication:** Link back to `docs/admin-sdk` instead of copying canonical explanations into lesson files.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lesson discovery | A central registry that manually imports every lesson | `import.meta.glob` over colocated lesson manifests | The repo already uses Vite module globbing; manual registries drift immediately as lessons grow. [VERIFIED: packages/component-library/src/components/icons-media/mt-icon/mt-icon.vue] |
| Browser proof of catalog order | Ad hoc local testing only | Playwright browser assertions for the lesson list | `LESS-01` is browser-visible, so unit tests alone are not enough. [VERIFIED: .planning/REQUIREMENTS.md, packages/component-library/playwright.config.ts] |
| Manifest regression checking | Informal object-shape conventions | Typed manifest exports plus Vitest fixtures that load every lesson | The requirement is structured repo-authored content, so the shape must be asserted centrally. [VERIFIED: .planning/REQUIREMENTS.md, packages/component-library/vitest.config.ts] |
| Docs linkage | Copy-pasted docs snippets | Explicit `docsLinks` metadata that points to canonical docs pages | Duplicated docs content will drift and violates the "complement, not replace" constraint. [VERIFIED: .planning/PROJECT.md, .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] |

**Key insight:** The dangerous custom work in this phase is not a missing library; it is inventing unnecessary surface area. The safest implementation is the smallest one that freezes a durable lesson contract.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Ordering Drift
**What goes wrong:** Lessons appear in the wrong order, or chapter/part boundaries become implicit and fragile.
**Why it happens:** Order is inferred from file names or discovery order instead of explicit catalog fields.
**How to avoid:** Require explicit `order` metadata at every tree level and test the normalized output.
**Warning signs:** A renamed folder changes the rendered order, or two lessons share the same implicit slot.

### Pitfall 2: Prose and Wiring Split Without Ownership
**What goes wrong:** Markdown and manifests diverge, leaving missing starter files, broken docs links, or mismatched scenario metadata.
**Why it happens:** Prose lives in one directory tree while manifests and code live elsewhere.
**How to avoid:** Keep each lesson's markdown and typed manifest in the same folder and load them together.
**Warning signs:** Manifest paths start pointing outside the lesson folder, or authors must edit multiple distant files for a single lesson.

### Pitfall 3: Prototype Scope Creep
**What goes wrong:** Phase 1 starts building the run loop, fake admin shell, or multi-file editor instead of freezing the authoring model.
**Why it happens:** The lesson file-set idea gets mistaken for a generic browser IDE requirement.
**How to avoid:** Keep one editable learner file, fixed support files, and a minimal lesson list UI only.
**Warning signs:** Plans introduce package installation, code execution orchestration, or shell event rendering in this phase.

### Pitfall 4: Docs Forking
**What goes wrong:** Tutorial prose begins duplicating canonical Admin SDK explanations, causing drift across docs and lessons.
**Why it happens:** Lessons treat themselves as standalone documentation instead of guided practice.
**How to avoid:** Store only the lesson-specific teaching flow locally and link out to canonical Admin SDK docs for deeper explanation.
**Warning signs:** Lesson markdown copies paragraphs from `docs/admin-sdk` or embeds long API references.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from this repo:

### Module Discovery
```ts
const icons = import.meta.glob("/node_modules/@shopware-ag/meteor-icon-kit/icons/**/*.svg", {
  import: "default",
  eager: false,
});
```
Source: `packages/component-library/src/components/icons-media/mt-icon/mt-icon.vue` [VERIFIED]

### Runtime-Surface Split
```ts
import { location } from "@shopware-ag/meteor-admin-sdk";

if (location.is(location.MAIN_HIDDEN)) {
  import("./init/init-app");
} else {
  import("./locations/init-locations");
}
```
Source: `examples/admin-sdk-app/src/frontend/main.ts` [VERIFIED]

### Vitest + jsdom Baseline
```ts
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./vitest.setup.ts"],
    },
  }),
);
```
Source: `packages/component-library/vitest.config.ts` [VERIFIED]
</code_examples>

<sota_updates>
## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Vue 2 / older package-specific build conventions | Vue 3 + Vite for new browser-facing work | Already present in current repo examples | The tutorial package should follow the Vue 3 + Vite path, not the older `packages/admin-sdk` build style. [VERIFIED: packages/admin-sdk/package.json, examples/admin-sdk-app/package.json] |
| Static docs as the only teaching surface | Hands-on tutorial package plus canonical docs links | Project decision for this initiative | Lesson content should stay separate from `docs/admin-sdk` and link back for depth. [VERIFIED: .planning/PROJECT.md, .planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md] |

**Deprecated/outdated:**
- Using Phase 1 to model a full generic browser IDE is outdated for this project scope; the current direction is a constrained lesson system with one editable learner file and fixed support assets. [VERIFIED: .planning/PROJECT.md, .planning/ROADMAP.md]
</sota_updates>

<assumptions_log>
## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | A single `lesson.manifest.ts` per lesson is the cleanest manifest filename | Architecture Patterns | Low — filename can change without changing the model |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.
</assumptions_log>

<open_questions>
## Open Questions (RESOLVED)

1. **Final package name**
   - RESOLVED: Use `packages/admin-sdk-tutorial/` with package name `@shopware-ag/meteor-admin-sdk-tutorial`.
   - Why: It matches the monorepo's package naming style and gives the planner a stable path for all Phase 1 artifacts.

2. **Phase 1 Markdown rendering scope**
   - RESOLVED: Phase 1 stores Markdown as the canonical lesson-prose source and loads it through the catalog model, but the user-visible UI only needs the ordered lesson list and lesson metadata. Full lesson-content presentation can deepen in later phases without changing the authoring model.
   - Why: This satisfies the Markdown-oriented authoring decision and the browser-visible catalog requirement without pulling Phase 2 workspace concerns into Phase 1.
</open_questions>

<environment_availability>
## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Workspace tooling | ✓ | `22.13.0` | — |
| `pnpm` | Workspace tooling | ✓ | `10.12.3` | — |
| Playwright browser tooling | Browser integration verification | [ASSUMED] | `@playwright/test ^1.45.0` in repo manifests | Install browsers during execution if missing |

**Missing dependencies with no fallback:**
- None found in current repo context.

**Missing dependencies with fallback:**
- Browser binaries may need installation even though Playwright is already a repo dependency.
</environment_availability>

<validation_architecture>
## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `vitest` 3.x for manifest/catalog tests + `@playwright/test` 1.45.x for browser proof |
| Config file | `packages/admin-sdk-tutorial/vitest.config.ts` and `packages/admin-sdk-tutorial/playwright.config.ts` |
| Quick run command | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` |
| Full suite command | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run && pnpm --dir packages/admin-sdk-tutorial test:e2e` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| `LESS-01` | Ordered lesson list renders in the browser | e2e | `pnpm --dir packages/admin-sdk-tutorial exec playwright test tests/e2e/lesson-catalog.spec.ts` | ❌ Wave 0 |
| `LEARN-03` | Lesson manifests expose prose, starter, solution, and scenario metadata in a structured format | unit/integration | `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run`
- **Per wave merge:** `pnpm --dir packages/admin-sdk-tutorial test:unit -- --run && pnpm --dir packages/admin-sdk-tutorial test:e2e`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `packages/admin-sdk-tutorial/vitest.config.ts` — establish package-local unit/integration test harness
- [ ] `packages/admin-sdk-tutorial/playwright.config.ts` — establish browser verification harness for `LESS-01`
- [ ] `packages/admin-sdk-tutorial/src/catalog/catalog.spec.ts` — create the lesson-contract and catalog-integrity spec scaffold in Wave 0
- [ ] `packages/admin-sdk-tutorial/src/catalog/normalizeCatalog.spec.ts` — create the normalization/ordering spec scaffold in Wave 0
- [ ] `packages/admin-sdk-tutorial/tests/e2e/lesson-catalog.spec.ts` — create the browser smoke-test scaffold in Wave 0
</validation_architecture>

<security_domain>
## Security Domain

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Phase 1 is local content modeling, not auth |
| V3 Session Management | no | No session boundary is introduced in this phase |
| V4 Access Control | no | No user roles or permission checks are introduced yet |
| V5 Input Validation | yes | Validate manifest shape, constrain file references, and normalize docs links |
| V6 Cryptography | no | No cryptographic feature is needed in this phase |

### Known Threat Patterns for This Phase
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Unsafe lesson markdown rendering | Tampering | Keep lesson prose in repo-owned files and sanitize or restrict raw HTML if rendered |
| Manifest references escaping the lesson folder | Tampering | Resolve lesson assets from statically discovered local modules only |
| Unsafe deep-link protocols in lesson docs links | Spoofing | Allow only `https:` or vetted repo-relative docs/example links |
</security_domain>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/PROJECT.md` — project scope, constraints, and tutorial goals
- `.planning/ROADMAP.md` — Phase 1 goal, requirements, and success criteria
- `.planning/REQUIREMENTS.md` — requirement definitions for `LESS-01` and `LEARN-03`
- `.planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md` — locked decisions and canonical references
- `pnpm-workspace.yaml` — workspace package layout
- `examples/admin-sdk-app/package.json` — Vue 3 + Vite example baseline
- `examples/nuxt-app/package.json` — confirms Vue 3 usage in another browser-facing example
- `packages/component-library/package.json` — Vitest, Playwright, Vue 3, and workspace dependency patterns
- `packages/component-library/vitest.config.ts` — package-local Vitest baseline
- `packages/component-library/playwright.config.ts` — package-local Playwright baseline
- `packages/component-library/src/components/icons-media/mt-icon/mt-icon.vue` — `import.meta.glob` pattern already used in repo
- `examples/admin-sdk-app/src/frontend/main.ts` — runtime-surface split pattern already used in repo
- `docs/admin-sdk/index.md`, `docs/admin-sdk/api-reference/notification.md`, `docs/admin-sdk/concepts/locations.md`, `docs/admin-sdk/concepts/positions.md` — canonical docs the tutorial should deep-link to

### Secondary (MEDIUM confidence)
- `AGENTS.md` — repo workflow and testing constraints consumed by the planner

### Tertiary (LOW confidence)
- None
</sources>

<metadata>
## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - based on current repo package manifests and existing configs
- Architecture: HIGH - driven by locked phase decisions plus repo patterns already in use
- Pitfalls: HIGH - directly derived from phase scope boundaries and the chosen content model
- Code examples: HIGH - all examples are drawn from current repo files

**Research date:** 2026-04-10
**Valid until:** 2026-05-10
</metadata>

---

*Phase: 01-lesson-catalog-authoring-model*
*Research completed: 2026-04-10*
*Ready for planning: yes*

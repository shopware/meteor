# Phase 1: Lesson Catalog & Authoring Model - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase defines the repo-owned lesson system for the interactive Meteor Admin SDK tutorial package. It covers the content hierarchy, authoring model, package/file layout, and lesson asset structure that later phases will build on. It does not implement the browser run loop, fake admin shell behavior, or location rendering itself.

</domain>

<decisions>
## Implementation Decisions

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

### the agent's Discretion
- Exact field names and TypeScript shapes for manifests.
- Whether lesson prose is a single markdown file per lesson or a slightly more segmented content structure.
- Exact subdirectory naming under the content-first package, as long as the lesson tree remains the primary organizing principle.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and phase definition
- `.planning/PROJECT.md` — Project intent, non-negotiables, and the explicit prototype constraints.
- `.planning/REQUIREMENTS.md` — Phase 1 requirements `LESS-01` and `LEARN-03`, plus adjacent constraints from later tutorial phases.
- `.planning/ROADMAP.md` — Phase 1 boundary and success criteria; prevents scope bleed into runtime or fake-admin implementation.

### Existing Admin SDK docs to align tutorial structure with
- `docs/admin-sdk/index.md` — Current introduction and quick-start framing that the tutorial should complement rather than replace.
- `docs/admin-sdk/api-reference/notification.md` — Canonical notification example likely to inform one of the first prototype lessons.
- `docs/admin-sdk/concepts/locations.md` — Canonical explanation of hidden iframe/runtime and `locationId`, which the lesson model must be able to teach later.
- `docs/admin-sdk/concepts/positions.md` — Canonical explanation of `positionId`, which shapes later lesson topics and metadata needs.

### Existing docs publishing context
- `docs/admin-sdk/README.md` — Explains how Admin SDK docs are embedded into the external developer portal, useful for keeping the tutorial-docs relationship clean.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `docs/admin-sdk/` — Existing topic-organized Admin SDK documentation tree that can serve as the canonical reference target for lesson deep links.
- `examples/admin-sdk-app/` — Real app-style Admin SDK example code that can inform future lesson scenarios and sample content.
- `examples/admin-sdk-plugin/` — Real plugin-style Admin SDK example code that can inform future lesson scenarios and compatibility checks.
- `packages/component-library/package.json` — Confirms the repo already depends on `codemirror`, `vue-codemirror6`, Vue 3, Vitest, and Playwright, which reduces friction for the eventual tutorial package.

### Established Patterns
- New publishable code belongs in `packages/<package-name>/` according to `.planning/codebase/STRUCTURE.md`.
- Vue 3 + Vite is an established path in this repo, seen in `examples/admin-sdk-app/package.json`, `examples/nuxt-app/package.json`, and `packages/component-library/package.json`.
- Package-local ownership is the norm in this monorepo: each package carries its own config, scripts, tests, and build entry points.
- Repo conventions favor colocated tests and descriptive domain-oriented filenames, which should shape the tutorial package layout and lesson manifest naming.

### Integration Points
- The new tutorial package should live under `packages/` and depend on `@shopware-ag/meteor-admin-sdk` via workspace linkage.
- The lesson catalog should be designed so later phases can connect it cleanly to a split-pane tutorial shell, browser compile/run loop, and fake admin host without changing the content model.
- Lesson metadata should anticipate direct links into `docs/admin-sdk` and future grounding in example code from `examples/admin-sdk-app` and `examples/admin-sdk-plugin`.

</code_context>

<specifics>
## Specific Ideas

- The desired interaction model is inspired by the Solid tutorial split view and TutorialKit progression, but implementation must stay fully repo-owned.
- Even though v1 should stay narrow, the content model should already be able to express a deeper hierarchy of parts, chapters, and lessons.
- The package should feel content-led rather than runtime-led: lesson authoring is the primary concern in this phase.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---
*Phase: 01-lesson-catalog-authoring-model*
*Context gathered: 2026-04-10*

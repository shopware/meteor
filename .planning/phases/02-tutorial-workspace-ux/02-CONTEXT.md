# Phase 2: Tutorial Workspace UX - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the tutorial workspace shell around the authored lessons. It covers the split-pane reading and editing experience, in-browser lesson editing for the single primary file, solution reveal, starter recovery, and same-device lesson resume. It does not add the explicit browser run loop, runtime isolation, or fake-admin behavior from later phases.

</domain>

<decisions>
## Implementation Decisions

### Workspace composition
- **D-01:** Desktop should default to a two-pane layout with lesson guidance on the left and the working area on the right.
- **D-02:** Inside the working area, the editor should be primary and the preview should sit below it in the same pane for Phase 2.
- **D-03:** The guidance pane should include the lesson title, summary, lesson prose, docs links, and the main workspace actions.
- **D-04:** On narrow screens, the same guidance and workspace sections should remain available through a collapsed stacked or tabbed layout rather than dropping features or forcing desktop-only behavior.

### Lesson navigation
- **D-05:** The workspace should keep a persistent lesson navigation surface available while the user works.
- **D-06:** That navigation should expose the full `parts -> chapters -> lessons` hierarchy, with the current lesson expanded in context.
- **D-07:** Refreshing the page on the same device should reopen the last active lesson directly in the workspace.
- **D-08:** If the current lesson draft differs from the starter state, switching lessons should warn before leaving instead of silently switching.

### Solution reveal
- **D-09:** Showing the solution should open a secondary read-only solution panel rather than replacing learner code.
- **D-10:** The comparison should be a simple side-by-side learner-code versus solution view in Phase 2.
- **D-11:** Closing the solution view should return the learner to their draft exactly as it was.
- **D-12:** Revealing the solution should not require confirmation because it is non-destructive and reversible.

### Persistence and recovery
- **D-13:** Same-device persistence should keep both the last active lesson and the current draft for each visited lesson.
- **D-14:** "Restore starter" should reset only the current lesson's editable draft.
- **D-15:** "Restore starter" is destructive and should always require confirmation.
- **D-16:** Solution-panel visibility should not persist across refresh; lessons should reopen in normal authoring mode.

### the agent's Discretion
- Exact breakpoint values and the concrete mobile collapse pattern.
- Exact pane sizing, resize behavior, and visual hierarchy inside the split workspace.
- The copy and visual treatment for dirty-state warnings and restore confirmations.
- The exact placeholder or fallback preview treatment before Phase 3 introduces the full run loop.

</decisions>

<specifics>
## Specific Ideas

- The workspace should preserve the Solid-style tutorial feel already referenced in `.planning/PROJECT.md`, but it must stay content-led rather than feel like a generic browser IDE.
- The guidance pane is meant to stay useful while coding, not collapse into a minimal metadata stub.
- The user wants the workspace to feel safe: solution reveal is reversible, but lesson switching with unsaved edits and starter restore both need explicit handling.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and constraints
- `.planning/PROJECT.md` — Project intent, prototype constraints, and the external UX references that shape the tutorial shell.
- `.planning/REQUIREMENTS.md` — Phase 2 requirements `LESS-02`, `LESS-03`, `LESS-04`, `LESS-05`, and `RUN-01`.
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, and the boundary to keep Phase 2 separate from the run loop and fake-admin slices.

### Prior locked decisions
- `.planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md` — Locks the content-first package direction, the `parts -> chapters -> lessons` hierarchy, lesson docs linkage, and the single primary editable file model.

### No additional external specs
- No separate ADR or design spec exists yet for the workspace beyond the planning files and prior context above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `packages/admin-sdk-tutorial/src/catalog/types.ts` — Already provides the lesson data shape the workspace will consume, including prose, starter code, solution code, docs links, support files, and the primary editable file.
- `packages/admin-sdk-tutorial/src/App.vue` — Existing browser shell that renders the lesson hierarchy from the normalized catalog and is the natural integration point for the new workspace.
- `packages/component-library/package.json` — Confirms the repo already ships `codemirror` and `vue-codemirror6`, so a CodeMirror-based editor can be added without introducing a foreign stack.
- `packages/admin-sdk/src/data/composables/useSharedState.ts` — Demonstrates an established browser persistence pattern using `localforage`, which may be useful for same-device lesson resume.

### Established Patterns
- `packages/admin-sdk-tutorial` is a package-local Vue 3 + Vite app with its own lint, unit-test, and Playwright setup.
- Phase 1 established that lesson content is the source of truth and runtime UX should be built around that authored lesson model rather than around an IDE abstraction.
- The tutorial currently exposes only one learner-editable file per lesson, so the workspace should optimize hard for a single-file editing flow rather than a multi-file browser IDE.

### Integration Points
- The current catalog page in `packages/admin-sdk-tutorial/src/App.vue` should evolve into the Phase 2 workspace shell rather than being replaced by a separate app entry.
- Lesson navigation should stay grounded in the normalized catalog returned by `loadLessonCatalog()`, so authored order remains the source of truth.
- Persistence should be keyed by stable lesson identity from the catalog so refresh recovery can reopen the last active lesson and its draft safely.

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---
*Phase: 02-tutorial-workspace-ux*
*Context gathered: 2026-04-10*

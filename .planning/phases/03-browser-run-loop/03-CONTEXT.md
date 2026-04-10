# Phase 3: Browser Run Loop - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase adds the first explicit browser-local execution loop to the tutorial workspace. It covers running the current lesson on demand, rendering a minimal isolated preview surface, surfacing compile or runtime failures without breaking the tutorial shell, and restarting the preview runtime without discarding learner edits. It does not introduce the fake admin shell or visible SDK host behavior from Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Run trigger behavior
- **D-01:** Lesson code should execute only when the learner explicitly clicks `Run`.
- **D-02:** Phase 3 should not auto-run on lesson open, after edits, or on a debounce timer.
- **D-03:** After the learner edits code, the workspace should keep the last successful run visible until the learner explicitly runs again, with a clear not-yet-run state for the draft.

### Error and diagnostics flow
- **D-04:** Compile and runtime failures should appear in a dedicated diagnostics panel inside the workspace instead of collapsing the full tutorial shell.
- **D-05:** When a run fails, the preview pane should leave the last-success snapshot model and switch to an error state rather than continuing to show stale successful output.

### Restart and isolation semantics
- **D-06:** `Restart preview` should reset only the preview runtime session and its state.
- **D-07:** Restarting the preview must preserve the learner's current edited code.
- **D-08:** The preview runtime should stay isolated from the tutorial shell so learner execution state cannot leak into the host workspace UI.

### Preview scope before fake-admin work
- **D-09:** Successful runs in Phase 3 should render a minimal isolated lesson app surface.
- **D-10:** Phase 3 should not introduce fake admin chrome or host-shell visuals early; that belongs to Phase 4.

### the agent's Discretion
- The exact placement and copy for the `Run`, `Restart preview`, and diagnostics controls.
- Whether the diagnostics panel uses tabs, stacked sections, or a split layout alongside the preview.
- The exact wording and visual treatment of the "changes not run yet" state.
- The concrete sandboxing mechanism that delivers runtime isolation while staying browser-local and repo-owned.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and project constraints
- `.planning/PROJECT.md` — Project intent, browser-local constraint, fake-admin direction, and the external tutorial references that shape the run-loop UX.
- `.planning/REQUIREMENTS.md` — Phase 3 requirements `RUN-02`, `RUN-03`, `RUN-04`, `RUN-05`, and `SHELL-05`.
- `.planning/ROADMAP.md` — Phase 3 goal, success criteria, and the boundary between the run loop and the later fake-admin shell slice.

### Prior locked decisions
- `.planning/phases/01-lesson-catalog-authoring-model/01-CONTEXT.md` — Locks the content-first tutorial structure, single primary editable file model, and docs-link relationship.
- `.planning/phases/02-tutorial-workspace-ux/02-CONTEXT.md` — Locks the existing split-pane workspace, persistent lesson state, restore/solution behavior, and the temporary placeholder preview concept that Phase 3 replaces.

### Canonical Admin SDK teaching references
- `docs/admin-sdk/api-reference/notification.md` — Defines the notification API that the first tutorial lesson already uses and that the run loop must execute correctly.
- `docs/admin-sdk/concepts/locations.md` — Defines the location semantics used by existing lesson code and constrains how Phase 3 executes those lessons before Phase 4 adds host visuals.
- `docs/admin-sdk/concepts/positions.md` — Defines position concepts referenced by current lesson assets and future run-loop compatibility.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `packages/admin-sdk-tutorial/src/App.vue` — Current workspace shell and placeholder preview area that Phase 3 should evolve rather than replace.
- `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.ts` — Existing lesson selection, draft persistence, dirty-state, and recovery logic that should remain the source of truth while execution state stays separate.
- `packages/admin-sdk-tutorial/src/catalog/loadLessonCatalog.ts` and `packages/admin-sdk-tutorial/src/catalog/types.ts` — Existing catalog and lesson asset model that already carry the code and metadata the run loop must consume.
- `packages/admin-sdk-tutorial/src/lessons/**/starter.ts` and `solution.ts` — Current lesson entry files that show the runtime shapes Phase 3 must support, including async notification dispatch and location-dependent logic.
- `packages/admin-sdk/src/**` — The real Admin SDK package the tutorial must continue to teach against, not a tutorial-only facade.

### Established Patterns
- `packages/admin-sdk-tutorial` already owns its own Vue 3, Vite, Vitest, Jest, and Playwright setup, so the run loop should stay package-local.
- Phase 2 kept draft editing, restore, and solution visibility in workspace state; Phase 3 should add execution state alongside that model, not collapse them into one mutable source.
- The tutorial is intentionally not a generic browser IDE, so execution should stay explicit and lesson-oriented rather than becoming live-preview behavior.

### Integration Points
- The new run loop should plug into the existing workspace actions in `packages/admin-sdk-tutorial/src/App.vue`.
- Preview-session state should stay distinct from persisted lesson drafts in `packages/admin-sdk-tutorial/src/workspace/useTutorialWorkspace.ts`.
- The current lesson's primary editable file and support files should feed the run pipeline without changing the authored lesson packaging model from Phase 1.

</code_context>

<specifics>
## Specific Ideas

- The run loop should feel deliberate rather than IDE-like: learners edit first, then choose when to execute.
- The workspace should preserve a strong mental model between "draft code" and "last run result" instead of blurring them together.
- Failure handling should stay teachable: the shell remains intact, diagnostics are visible, and restart is about recovering runtime state, not erasing learner work.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---
*Phase: 03-browser-run-loop*
*Context gathered: 2026-04-10*

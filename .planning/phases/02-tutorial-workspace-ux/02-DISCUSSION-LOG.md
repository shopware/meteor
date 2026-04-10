# Phase 2: Tutorial Workspace UX - Discussion Log

**Date:** 2026-04-10
**Status:** Completed

## Areas Discussed

- Workspace composition
- Lesson navigation
- Solution reveal
- Persistence and recovery

## Workspace Composition

### Q1
**Question:** What should the default desktop layout be?

**Options presented:**
- `A` Two-pane: lesson guidance on the left, workspace on the right.
- `B` Three-pane: guidance, editor, and preview all visible at once.
- `C` Single main pane with tabs or steps for guidance, editor, and preview.

**Answer:** `A`

### Q2
**Question:** Inside the workspace pane, how should editor and preview be arranged before Phase 3 adds the full run loop?

**Options presented:**
- `A` Editor primary, preview secondary below it.
- `B` Editor and preview side by side.
- `C` Editor and preview as tabs.

**Answer:** `A`

### Q3
**Question:** What should the lesson guidance panel contain at minimum in Phase 2?

**Options presented:**
- `A` Title, summary, lesson prose, docs links, and workspace actions.
- `B` Title, short summary, and docs links only.
- `C` Full prose plus chapter or lesson progression details and metadata.

**Answer:** `A`

### Q4
**Question:** On narrow screens, what should happen?

**Options presented:**
- `A` Keep the same sections but collapse into tabs or stacked sections.
- `B` Force desktop-like split panes with horizontal scroll.
- `C` Support desktop only for now.

**Answer:** `A`

## Lesson Navigation

### Q1
**Question:** While working inside a lesson, how should lesson navigation stay available?

**Options presented:**
- `A` Persistent lesson list or sidebar alongside the current lesson.
- `B` Only previous and next controls inside the lesson.
- `C` A back-to-catalog action only.

**Answer:** `A`

### Q2
**Question:** How much hierarchy should the in-workspace navigation expose?

**Options presented:**
- `A` Parts, chapters, and lessons, with the current lesson expanded in context.
- `B` Chapters and lessons only.
- `C` Just a flat lesson list.

**Answer:** `A`

### Q3
**Question:** When the user refreshes and resumes, where should they land?

**Options presented:**
- `A` Reopen the last active lesson directly in the workspace.
- `B` Return to the catalog with the last lesson highlighted.
- `C` Ask them whether to resume or go back to the catalog.

**Answer:** `A`

### Q4
**Question:** When switching lessons, what should happen if the current lesson draft differs from its starter state?

**Options presented:**
- `A` Auto-save the draft and switch immediately.
- `B` Warn before leaving the lesson.
- `C` Discard unsaved changes unless the user confirms save.

**Answer:** `B`

## Solution Reveal UX

### Q1
**Question:** How should "show solution" appear in the workspace?

**Options presented:**
- `A` Open a secondary read-only solution panel next to or below the learner code.
- `B` Replace the editor contents temporarily with the solution.
- `C` Open the solution in a modal.

**Answer:** `A`

### Q2
**Question:** Once the solution is visible, what comparison style is best for Phase 2?

**Options presented:**
- `A` Simple side-by-side learner code versus solution.
- `B` Inline diff view.
- `C` No explicit comparison, just show the solution.

**Answer:** `A`

### Q3
**Question:** What should happen when the user closes the solution view?

**Options presented:**
- `A` Return to their draft exactly as it was.
- `B` Ask whether to keep the solution visible state persisted.
- `C` Reset the editor to starter state.

**Answer:** `A`

### Q4
**Question:** Should revealing the solution count as a destructive action that needs confirmation?

**Options presented:**
- `A` No, because it is read-only and should be reversible.
- `B` Yes, always ask first.
- `C` Only ask if the lesson has unsaved changes.

**Answer:** `A`

## Persistence And Recovery

### Q1
**Question:** What should persist on the same device after refresh?

**Options presented:**
- `A` Last active lesson plus the current draft for each visited lesson.
- `B` Only the last active lesson.
- `C` Last active lesson, drafts, and UI state like open panels and scroll position.

**Answer:** `A`

### Q2
**Question:** What should "restore starter" reset?

**Options presented:**
- `A` Only the current lesson's editable draft.
- `B` The current lesson draft plus solution visibility and local lesson UI state.
- `C` All saved tutorial progress on the device.

**Answer:** `A`

### Q3
**Question:** Because restore is destructive, how should it behave?

**Options presented:**
- `A` Require confirmation every time.
- `B` Restore immediately with an undo affordance.
- `C` Restore immediately with no confirmation.

**Answer:** `A`

### Q4
**Question:** If the user has viewed the solution, should that state persist across refresh?

**Options presented:**
- `A` No, reopen the lesson in normal authoring mode.
- `B` Yes, preserve whether the solution panel was open.
- `C` Persist it only for the current session, not across refresh.

**Answer:** `A`

## Notes

- The discussion stayed within the phase boundary.
- No deferred ideas were added during the session.

---
status: complete
phase: 02-tutorial-workspace-ux
source:
  - 02-01-SUMMARY.md
  - 02-02-SUMMARY.md
  - 02-03-SUMMARY.md
  - 02-04-SUMMARY.md
started: "2026-04-10T14:13:23Z"
updated: "2026-04-10T14:18:55Z"
---

## Current Test

[testing complete]

## Tests

### 1. Desktop Workspace Shell Loads
expected: Open the tutorial on a desktop-sized viewport. The first lesson should open automatically in a two-pane workspace with lesson navigation and guide content on the left, plus the editor and a Preview placeholder on the right.
result: pass

### 2. In-Browser Editing Persists Draft State
expected: Edit the current lesson code in the browser. The workspace should mark the lesson as dirty, save the draft on this device, and keep the edited code in place while you stay on the lesson.
result: pass

### 3. Refresh Recovers Lesson and Draft
expected: Refresh the page after making an edit. The tutorial should reopen the last active lesson with the same draft restored, and solution compare mode should not stay open across the refresh.
result: pass

### 4. Solution Compare Is Reversible
expected: Show the solution for the current lesson. A read-only solution view should appear without overwriting your draft, and Hide solution should return you to the exact draft you had before.
result: pass

### 5. Restore Starter Is Guarded
expected: Trigger Restore starter. The app should ask for confirmation, Keep draft should leave your code unchanged, and confirming Restore starter should replace the current draft with the starter code.
result: pass

### 6. Dirty Lesson Switch Keeps Drafts Safe
expected: With unsaved edits in one lesson, try opening a different lesson. The app should warn before switching, let you stay on the current lesson, and if you continue, the original draft should still be there when you come back.
result: pass

### 7. Narrow-Screen Workspace Tabs Work
expected: On a narrow viewport, the workspace should switch to Lessons, Guide, and Workspace tabs. The Workspace tab should stack the editor above the Preview placeholder and keep the same lesson state.
result: pass

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

<!-- YAML format for plan-phase --gaps consumption -->

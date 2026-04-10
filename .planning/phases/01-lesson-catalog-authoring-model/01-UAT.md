---
status: complete
phase: 01-lesson-catalog-authoring-model
source:
  - 01-01-SUMMARY.md
  - 01-02-SUMMARY.md
  - 01-03-SUMMARY.md
  - 01-04-SUMMARY.md
started: 2026-04-10T12:05:15Z
updated: 2026-04-10T12:17:07Z
---

## Current Test

[testing complete]

## Tests

### 1. Seeded lesson bundle structure
expected: In `packages/admin-sdk-tutorial/src/lessons/`, the tutorial package should contain two seeded lesson bundles. Each bundle should keep its authored assets together in one folder, including a `lesson.manifest.ts`, lesson prose, starter code, solution code, and at least one support file.
result: pass

### 2. Browser catalog shell renders
expected: Opening the tutorial app should show the `Meteor Admin SDK Tutorial` heading, the Phase 1 prototype copy, one part section, and two chapter sections rendered from the authored catalog instead of a placeholder shell.
result: pass

### 3. Lesson order is deterministic
expected: The lesson list should show exactly two lesson rows in this order: `1. Dispatch your first notification` and `1. Understand hidden locations`.
result: pass

### 4. Lesson metadata is visible
expected: Each lesson row should expose its scenario kind, `Primary editable file`, and a support-file count so the authored lesson metadata is visible in the browser.
result: pass

### 5. Docs links stay on canonical guide routes
expected: The visible lesson docs links should point only to canonical `/guide/...` routes: `/guide/api-reference/notification`, `/guide/concepts/locations`, and `/guide/concepts/positions`.
result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none yet]

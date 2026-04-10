# Phase 3: Browser Run Loop - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 03-browser-run-loop
**Areas discussed:** Run trigger behavior, Preview freshness, Error and diagnostics presentation, Failure preview behavior, Restart and isolation semantics, Preview scope before fake-admin work

---

## Run trigger behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Run button only | Execute only when the learner explicitly clicks `Run` | ✓ |
| Auto-run on lesson open, then manual run | Prime the lesson once, then require explicit reruns | |
| Auto-run after edits with debounce | Behave like a live preview with manual override | |

**User's choice:** Run button only
**Notes:** Phase 3 should keep execution intentional rather than drifting into live-IDE behavior.

---

## Preview freshness

| Option | Description | Selected |
|--------|-------------|----------|
| Keep last successful result | Show the previous successful output until the learner clicks `Run` again, with a pending-changes state | ✓ |
| Clear preview to idle | Remove prior output until the next run | |
| Partially reflect edits without executing | Try to hint at changes before execution | |

**User's choice:** Keep last successful result
**Notes:** Draft state and run state should stay separate.

---

## Error and diagnostics presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated diagnostics panel | Show compile/runtime failures in a separate workspace panel while the shell stays intact | ✓ |
| Inline preview error only | Replace preview content with the error and no separate panel | |
| Both inline and panel | Show a concise inline failure plus expanded diagnostics elsewhere | |

**User's choice:** Dedicated diagnostics panel
**Notes:** The tutorial shell should remain stable while failures are visible.

---

## Failure preview behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Keep last successful preview visible | Preserve the old output while showing the new failure elsewhere | |
| Replace preview with an error state | Switch the preview area itself into a failure state until the next successful run | ✓ |
| Blank the preview on failure | Remove all preview output after a failed run | |

**User's choice:** Replace preview with an error state
**Notes:** Failed runs should not look like they succeeded.

---

## Restart and isolation semantics

| Option | Description | Selected |
|--------|-------------|----------|
| Reset runtime only | Restart the preview session without changing the learner's draft | ✓ |
| Reset runtime and code to starter | Treat restart as a full reset including edits | |
| Ask on every restart | Let the learner choose whether to keep or discard edits | |

**User's choice:** Reset runtime only
**Notes:** Restart is for execution recovery, not code loss.

---

## Preview scope before fake-admin work

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal isolated lesson app surface | Render successful lesson output without fake-admin chrome yet | ✓ |
| Success placeholder only | Show generic run success and logs, but no real rendered result | |
| Lightweight fake-admin frame now | Start shell visuals early in Phase 3 | |

**User's choice:** Minimal isolated lesson app surface
**Notes:** The real fake-admin shell remains Phase 4 scope.

---

## the agent's Discretion

- Exact control placement and copy for run and restart actions.
- Exact diagnostics layout and visual treatment.
- Concrete implementation choice for runtime isolation.

## Deferred Ideas

None.

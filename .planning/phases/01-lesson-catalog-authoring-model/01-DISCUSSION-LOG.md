# Phase 1: Lesson Catalog & Authoring Model - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 01-Lesson Catalog & Authoring Model
**Areas discussed:** Lesson hierarchy, Lesson file format, Starter and solution packaging, Relationship to existing docs, Package and filesystem shape

---

## Lesson hierarchy

| Option | Description | Selected |
|--------|-------------|----------|
| Linear lessons only | One ordered list for v1. Fastest and narrowest. | |
| Parts and lessons | A lightweight hierarchy now, without full chapter depth. | |
| Parts, chapters, and lessons | Most future-proof, closest to TutorialKit, but more authoring and navigation overhead immediately. | ✓ |

**User's choice:** Parts, chapters, and lessons
**Notes:** The lesson model should support the full hierarchy from the start.

---

## Lesson file format

| Option | Description | Selected |
|--------|-------------|----------|
| Markdown-first | Each lesson has markdown/frontmatter plus starter and solution files beside it. | |
| Typed manifest-first | Each lesson is primarily defined in TypeScript, including metadata and content references. | |
| Hybrid | Markdown for teaching content, typed manifest for metadata, scenario config, and file references. | ✓ |

**User's choice:** Hybrid
**Notes:** Prose should stay readable while runtime wiring and metadata remain typed.

---

## Starter and solution packaging

| Option | Description | Selected |
|--------|-------------|----------|
| One editable file only | Only one file exists conceptually for each lesson. | |
| Small virtual file set | One primary editable file, plus fixed support files and a solution snapshot. | ✓ |
| Full lesson snapshots | Each lesson is a fuller app snapshot even if only part is editable. | |

**User's choice:** Small virtual file set
**Notes:** v1 should keep one primary learner-editable file, but preserve fixed support files around it.

---

## Relationship to existing docs

| Option | Description | Selected |
|--------|-------------|----------|
| Separate tutorial content, link to docs | Tutorial owns its teaching flow and points to canonical docs where needed. | ✓ |
| Reuse docs content directly | Tutorial renders or imports existing docs content where possible. | |
| Mirror docs topics one-to-one | Tutorial is authored separately, but follows the same topic structure as the docs. | |

**User's choice:** Separate tutorial content, link to docs
**Notes:** This keeps tutorial writing independent while preserving canonical docs as the source of deeper reference material.

---

## Package and filesystem shape

| Option | Description | Selected |
|--------|-------------|----------|
| Content-first | A clear `lessons/` tree at the center, with app/runtime code around it. | ✓ |
| App-first | A normal `src/` app structure, with lesson content nested inside it. | |
| Split clearly | Separate top-level areas for `lessons/`, `src/`, and `public/` or assets. | |

**User's choice:** Content-first
**Notes:** The lesson tree should be the center of gravity for the new package.

---

## the agent's Discretion

- Exact manifest type names and property structure.
- Exact directory naming conventions beneath the content-first package root.

## Deferred Ideas

None.

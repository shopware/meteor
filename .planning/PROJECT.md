# Meteor Admin SDK Interactive Tutorial

## What This Is

This project adds an interactive tutorial experience for the Meteor Admin SDK inside the Meteor monorepo. The tutorial is meant for developers who want to learn the SDK by editing code in the browser and seeing the result immediately in a minimal simulated Administration instead of needing a real Shopware 6 Administration instance.

The first goal is a prototype that proves the interaction model, the browser-based execution model, and the fake admin shell for core SDK concepts such as notifications, UI extension points, and location and position IDs.

## Core Value

Let developers understand and try the Meteor Admin SDK in the browser without needing a real Shopware Administration environment.

## Requirements

### Validated

- ✓ Meteor already ships a reusable Admin SDK package in `packages/admin-sdk` — existing
- ✓ Meteor already ships hand-written Admin SDK docs in `docs/admin-sdk` — existing
- ✓ Meteor already ships Admin SDK example consumers in `examples/admin-sdk-app` and `examples/admin-sdk-plugin` — existing
- ✓ Phase 1 validated a dedicated tutorial package in `packages/admin-sdk-tutorial` with repo-owned lesson bundles, deterministic catalog loading, and a browser-visible lesson list

### Active

- [ ] Provide a lesson-driven tutorial UI where users read guidance, edit code, run it, and inspect the result in the browser.
- [ ] Keep execution entirely browser-local without TutorialKit, StackBlitz, or a remote code runner.
- [ ] Provide a fake admin shell with only the handlers and minimal UI needed to demonstrate Admin SDK concepts.
- [ ] Cover a first set of concepts that are high-value and visible: notifications, menu items, context-style actions, and location and position rendering.
- [ ] Make harder-to-understand concepts concrete by rendering lightweight visual placeholders for multiple locations and iframe-like surfaces.
- [ ] Prototype an interaction model inspired by the Solid tutorial split view and TutorialKit lesson structure while staying fully repo-owned.

### Out of Scope

- A full visual or behavioral clone of the real Shopware 6 Administration — too heavy for the teaching goal
- Dependence on StackBlitz, TutorialKit runtime, or another hosted sandbox provider — explicit project constraint
- Complete coverage of every Meteor Admin SDK API in the first iteration — prototype should focus on the highest-value teaching flows first
- Real backend persistence, authentication, or live Shopware connectivity inside the tutorial runtime — prototype should stay browser-local and deterministic

## Context

This is a brownfield initiative inside the existing Meteor monorepo. The repository already contains the Admin SDK implementation in `packages/admin-sdk`, reference apps in `examples/admin-sdk-app` and `examples/admin-sdk-plugin`, and an existing docs site in `docs/admin-sdk`.

The intended audience is developers learning the SDK, especially those who would benefit from seeing concepts before wiring a real Shopware extension environment. The user explicitly wants a prototype that proves how the experience could look and behave, not just another static documentation section.

Two external references shape the direction:
- The Solid tutorial interaction model at `https://www.solidjs.com/tutorial/introduction_basics` for the split-screen learning flow, inline editor, preview, and solution affordance
- `https://tutorialkit.dev/` for lesson/chapter structure and tutorial progression, but without taking a dependency on StackBlitz or TutorialKit itself

The fake admin shell must be pedagogical rather than realistic. It only needs enough handlers and UI to make SDK concepts understandable. For example, rendering two cards that behave like separate locations is sufficient to explain location and position mechanics.

## Constraints

- **Tech stack**: Must fit the existing `pnpm` workspace and Turborepo structure — this should be implemented as a new package inside `packages/`
- **Execution model**: User code editing and execution must happen in the browser — that is core to the tutorial value
- **Dependency**: Do not depend on TutorialKit or StackBlitz — the runtime should be owned in-repo
- **Scope**: Start with a prototype, not a full educational platform — prove the interaction and fake-admin architecture first
- **Compatibility**: The tutorial should teach the actual Admin SDK semantics from `packages/admin-sdk` — otherwise it becomes misleading
- **Documentation fit**: The tutorial should complement `docs/admin-sdk` and the existing examples rather than replace them wholesale

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build a new tutorial package inside `packages/` | Keeps the tutorial close to the SDK, examples, and monorepo tooling | Phase 1 validated `packages/admin-sdk-tutorial` as the tutorial package baseline |
| Use a fake admin shell instead of a real Shopware Administration | Teaches concepts with far lower setup cost and far less runtime complexity | — Pending |
| Keep code editing and execution fully in browser | The learning value depends on immediate hands-on feedback | — Pending |
| Use the Solid tutorial and TutorialKit as interaction references only | The desired UX is clear, but the runtime and architecture should remain self-owned | — Pending |
| Focus the first prototype on visible SDK behaviors and location concepts | These are the most teachable concepts for validating the approach early | Phase 1 validated the content-first lesson catalog around notifications and hidden-location concepts |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-10 after Phase 1 completion*

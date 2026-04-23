# Interactive Admin SDK Tutorial Prototype — Implementation Brief

## Goal

Build a first interactive prototype for learning the Meteor Admin SDK inside this monorepo.

The prototype should:

- be inspired by the Solid tutorial split layout
- not depend on TutorialKit or StackBlitz
- run entirely in the browser
- let the user edit code live
- execute that code against a minimal dummy admin runtime
- focus on understanding Admin SDK concepts, not replicating the full Shopware Administration UI

## Confirmed Direction

- **Deliverable:** clickable UI prototype
- **Monorepo placement preference:** additional package/app in the repo
- **Coding experience:** real editable code running in-browser
- **Initial lesson topics:** notifications, menu items, locations/positions
- **Layout direction:** Solid-like split layout
- **Dummy admin fidelity:** minimal wireframe / lightweight UI
- **Process:** implementation brief first, then approval before coding

## Product Intent

The user should learn Admin SDK concepts by writing code directly in the browser and immediately seeing how the dummy admin reacts.

The dummy admin should be deliberately minimal. It only needs enough UI and behavior so learners understand concepts like:

- triggering notifications
- adding navigation or menu items
- rendering content into locations / positions

For locations and position IDs, a simplified visualization is sufficient, e.g. cards with clearly labeled iframe-like surfaces.

## Monorepo Placement

The user explicitly chose:

`packages/admin-sdk-tutorial`

Even though `examples/` would also fit a prototype app, all implementation work should now assume the tutorial lives under `packages/`.

## Suggested Stack

- Vue 3
- Vite
- TypeScript
- optional reuse of `@shopware-ag/meteor-component-library` for selected UI pieces
- reuse/reference of `@shopware-ag/meteor-admin-sdk` where helpful, but mock runtime behavior locally for the prototype

## Prototype Scope

This first prototype should prove the overall learning experience, not solve the full long-term platform.

### Included

- split-screen tutorial shell
- lesson/navigation panel on the left
- in-browser code editor on the right
- live preview area on the right
- minimal dummy admin runtime
- mocked Admin SDK behavior for the first concepts
- three prototype lessons/steps

### Excluded for now

- full production authoring system
- persistent learner progress
- backend services or storage
- full Shopware Administration embedding
- full Admin SDK API coverage
- general-purpose WebContainer-like project sandbox
- production-grade assessment engine

## Proposed UX Structure

## Layout

- **Left column**
  - lesson title
  - explanation/content
  - step navigation
  - hints / expected outcome
- **Right column**
  - editor tabs or a compact single-file editor
  - live preview of the dummy admin
  - optional output/console panel

## Lessons for the Prototype

### 1. Notifications

Learner writes code that triggers a notification.

Preview behavior:

- display a toast/message area in the dummy admin
- show notification type and text clearly

### 2. Menu items

Learner writes code that adds a menu item.

Preview behavior:

- update a fake navigation/sidebar area
- make the new item visible and understandable immediately

### 3. Locations / positions

Learner writes code that targets extension surfaces.

Preview behavior:

- show simplified location containers
- use cards/panels with labeled slots
- visually communicate which content lands in which location/position

## Proposed Technical Architecture

### 1. Tutorial Shell

A dedicated app that renders:

- lesson content
- active step metadata
- editor state
- preview state

For the prototype, lesson content can be hardcoded in TypeScript/JSON rather than introducing a full content pipeline.

### 2. Editor Layer

For the prototype, keep the editing model intentionally small:

- preferably a single editable file per lesson (e.g. `main.ts` or `lesson.ts`)
- support reset to initial state
- optionally support small locked/unlocked regions later

### 3. Execution / Sandbox Layer

Run learner code entirely in the browser.

Recommended approach for the prototype:

- sandbox the preview in an iframe
- inject a controlled runtime/mock bridge
- execute only the code needed for the lesson environment

Avoid building a fully generic multi-file browser IDE at this stage.

### 4. Dummy Admin Runtime

Build a minimal fake admin shell that exposes only the UI surfaces needed by the lessons.

Suggested UI primitives:

- sidebar / navigation list
- header or toolbar area
- notification area
- content cards/panels
- labeled extension slots / pseudo-iframes

The visual language should remain lightweight and instructional, not a copy of the real Shopware UI.

### 5. Mock Admin SDK Bridge

Provide a thin compatibility layer so learner code can call familiar APIs while the prototype runtime translates those calls into dummy admin UI updates.

Core initial behaviors:

- create/show notifications
- register/add menu items
- register/render content into named locations/positions

## Architectural Principles

- optimize for teaching clarity over visual realism
- keep the runtime deterministic and easy to inspect
- prefer a constrained lesson environment over a generic platform
- keep lessons small and focused
- make the relation between learner code and UI result obvious

## Key Open Decisions / Risks

### 1. Placement: `examples/` vs `packages/`

The current repo structure suggests `examples/` is the best fit for a prototype app, even though the initial idea mentioned an additional package.

### 2. Fidelity of the mock SDK

We need to decide how closely the prototype runtime should mirror the real Admin SDK.

Recommendation:

- keep it minimal for now
- stay semantically close where easy
- avoid early overinvestment in API parity

### 3. Editor scope

Single-file editing is the fastest way to validate the tutorial concept.

Recommendation:

- start with single-file editing
- add multi-file support only if it becomes necessary for lesson clarity

### 4. Browser execution complexity

A fully general code execution environment can become expensive quickly.

Recommendation:

- use a narrowly scoped execution model for prototype lessons
- do not emulate a full project sandbox yet

## Recommended Build Plan

1. create the prototype app in the monorepo
2. implement the split tutorial shell
3. add a minimal browser editor
4. add sandboxed preview execution
5. build the dummy admin shell
6. implement mock Admin SDK actions for notifications, menu items, and locations/positions
7. create three prototype lessons
8. polish interaction and visual clarity

## Working Assumptions for Subagents

- This is a **prototype**, not a production tutorial system.
- The UI should be **minimal and instructional**.
- The result should feel close to the **Solid tutorial interaction model**.
- The learner must be able to **edit code directly in the browser**.
- Everything should happen **client-side in the browser**.
- Avoid introducing dependencies on StackBlitz/TutorialKit/WebContainer-style infrastructure.
- Prefer the existing monorepo conventions and lightweight reuse over building a large new framework.

## Confirmed Package Target

Proceed with implementation in:

`packages/admin-sdk-tutorial`

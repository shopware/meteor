# Interactive Admin SDK Tutorial Prototype — Implementation Plan

## Plan Context

- The prototype must live under `packages/`
- Recommended target package: `packages/admin-sdk-tutorial`
- The work is intentionally split into very small executable tasks
- Each task should be scoped to roughly **5 minutes or less**
- This plan is optimized for delegation to subagents

## Execution Rules

- Complete tasks in order unless explicitly marked parallelizable
- Keep each task narrowly scoped
- Prefer visible progress over early abstraction
- Do not expand scope beyond the prototype goals in `implementation-brief.md`

---

## Phase 1 — Package Setup

### 1.1 Create package folder structure
- Create `packages/admin-sdk-tutorial`
- Create initial `src/` folder
- Create placeholder folders for `components/`, `lessons/`, `runtime/`, and `types/`

### 1.2 Add package manifest
- Create `packages/admin-sdk-tutorial/package.json`
- Set package name
- Mark package as private if appropriate for prototype stage
- Add initial scripts (`dev`, `build`, `preview`, `typecheck`)

### 1.3 Add TypeScript config
- Create local `tsconfig.json`
- Align with repo conventions where possible

### 1.4 Add Vite config
- Create `vite.config.ts`
- Enable Vue support

### 1.5 Add app HTML entry
- Create `index.html`
- Add root mount element

### 1.6 Add source entrypoint
- Create `src/main.ts`
- Mount the root Vue app

### 1.7 Add root app component
- Create `src/App.vue`
- Render simple placeholder text to confirm bootstrapping

### 1.8 Register workspace dependencies
- Add initial dependencies and devDependencies
- Use workspace references where needed

### 1.9 Ensure package is included by workspace conventions
- Verify no extra workspace configuration is required
- Confirm package path matches monorepo patterns

---

## Phase 2 — Prototype Shell

### 2.1 Replace placeholder with split layout shell
- Create left and right column layout in `App.vue`
- Add semantic container sections

### 2.2 Add base shell styling
- Add initial layout CSS
- Ensure full-height app shell works

### 2.3 Create lesson sidebar component
- Add `src/components/TutorialSidebar.vue`
- Render title, description, and step list placeholders

### 2.4 Create workspace panel component
- Add `src/components/TutorialWorkspace.vue`
- Render editor and preview placeholders

### 2.5 Wire shell components into root app
- Replace inline layout with reusable components

### 2.6 Add mobile-safe fallback layout behavior
- Add basic responsive stacking behavior
- Do not over-polish yet

---

## Phase 3 — Lesson Data Model

### 3.1 Create lesson type definitions
- Add `src/types/lesson.ts`
- Define minimal lesson and step interfaces

### 3.2 Create prototype lesson data file
- Add `src/lessons/lessons.ts`
- Seed three lessons: notifications, menu items, locations/positions

### 3.3 Add active lesson state in app shell
- Store selected lesson/step in root state

### 3.4 Render lesson metadata in sidebar
- Show active title, summary, and step list

### 3.5 Add lesson switching behavior
- Enable click-to-select lesson/step

### 3.6 Add reset-on-lesson-change behavior
- Reset editor/preview state when changing lessons

---

## Phase 4 — Editor Prototype

### 4.1 Create editor component shell
- Add `src/components/CodeEditorPanel.vue`
- Render labeled editor area placeholder

### 4.2 Add editable text area as first editor
- Use a textarea-based implementation first
- Do not introduce a heavy editor dependency yet

### 4.3 Bind editor to lesson starter code
- Load starter code for active lesson

### 4.4 Add local editor state updates
- Keep current code reactive

### 4.5 Add reset button
- Reset editor content back to lesson starter code

### 4.6 Add basic file/tab affordance
- Show a single file name like `main.ts`
- Keep actual editing single-file only

---

## Phase 5 — Preview Shell

### 5.1 Create preview container component
- Add `src/components/PreviewPanel.vue`
- Render preview header and placeholder body

### 5.2 Add dummy admin shell component
- Add `src/components/DummyAdminShell.vue`
- Render simple nav, content area, and notification region

### 5.3 Add preview composition
- Mount dummy admin shell inside preview panel

### 5.4 Add output/status area
- Render a small status or output region below preview

### 5.5 Add empty-state messaging
- Show friendly message before first successful run if needed

---

## Phase 6 — Runtime State Model

### 6.1 Create runtime type definitions
- Add `src/types/runtime.ts`
- Define notification, menu item, and location state types

### 6.2 Create runtime state factory
- Add `src/runtime/createRuntimeState.ts`
- Return initial empty runtime state

### 6.3 Add runtime state to root app
- Store active preview/runtime state at app level

### 6.4 Pass runtime state into preview shell
- Bind reactive runtime state into dummy admin UI

### 6.5 Add runtime reset helper
- Reset runtime to lesson defaults before each run

---

## Phase 7 — Mock Admin SDK Bridge

### 7.1 Create bridge module skeleton
- Add `src/runtime/sdkBridge.ts`
- Export minimal bridge factory

### 7.2 Add notification API surface
- Implement method(s) for creating notifications

### 7.3 Add menu item API surface
- Implement method(s) for registering menu items

### 7.4 Add location registration API surface
- Implement method(s) for registering location content

### 7.5 Connect bridge methods to runtime state
- Ensure bridge mutates preview state deterministically

### 7.6 Add bridge reset behavior
- Ensure each execution starts cleanly

---

## Phase 8 — In-Browser Execution

### 8.1 Create execution module skeleton
- Add `src/runtime/executeLessonCode.ts`
- Define a narrow execution entrypoint

### 8.2 Define execution input contract
- Pass current code and bridge/runtime context into executor

### 8.3 Implement first naive evaluation flow
- Use a constrained prototype approach suitable for the current lesson code shape

### 8.4 Capture runtime errors
- Return execution errors instead of crashing the app

### 8.5 Trigger execution from UI
- Add a Run button or initial autorun behavior

### 8.6 Reset runtime before execution
- Ensure each run starts from fresh lesson state

### 8.7 Surface errors in output panel
- Show readable execution error messages

---

## Phase 9 — Notifications Lesson

### 9.1 Add notification lesson starter code
- Seed realistic starter code for notification concept

### 9.2 Add notification lesson text
- Explain the concept and expected result

### 9.3 Render notifications in dummy admin
- Show toast/message items in preview

### 9.4 Verify notification code path
- Ensure starter code produces visible result

### 9.5 Refine notification visuals
- Make the result easy to understand at a glance

---

## Phase 10 — Menu Items Lesson

### 10.1 Add menu item lesson starter code
- Seed realistic starter code for menu registration

### 10.2 Add menu item lesson text
- Explain what the learner should observe

### 10.3 Render menu items in dummy sidebar
- Show registered menu items in navigation area

### 10.4 Verify menu registration code path
- Ensure the preview updates correctly

### 10.5 Refine menu visuals
- Make added items visually distinct from static shell UI

---

## Phase 11 — Locations / Positions Lesson

### 11.1 Add locations lesson starter code
- Seed starter code for location/position behavior

### 11.2 Add locations lesson text
- Explain named slots and why they matter

### 11.3 Add labeled location containers to dummy admin
- Render two or more clear extension surfaces

### 11.4 Render registered location content
- Show learner-defined content inside the correct surface

### 11.5 Verify positions concept visually
- Make placement obvious without copying full Shopware UI

### 11.6 Refine location card visuals
- Improve labels and boundaries for comprehension

---

## Phase 12 — UX Polish

### 12.1 Add lesson progress affordance
- Show current lesson/step state clearly

### 12.2 Improve shell spacing and typography
- Make the tutorial easier to scan

### 12.3 Improve button labels and helper text
- Reduce ambiguity in controls

### 12.4 Improve preview empty/error states
- Make failure and reset flows understandable

### 12.5 Add minimal branding alignment
- Keep visuals lightweight and consistent with repo context

---

## Phase 13 — Verification

### 13.1 Start dev app and verify boot
- Confirm the package runs locally

### 13.2 Verify lesson switching
- Confirm editor and preview state update correctly

### 13.3 Verify notifications lesson manually
- Confirm learner edits affect preview

### 13.4 Verify menu items lesson manually
- Confirm learner edits affect preview

### 13.5 Verify locations lesson manually
- Confirm learner edits affect preview

### 13.6 Verify responsive layout manually
- Check desktop and narrow viewport behavior

### 13.7 Fix any obvious prototype regressions
- Resolve blocking issues only

---

## Optional Follow-Up Tasks

These are intentionally out of current scope, but may be scheduled later.

### O.1 Replace textarea with richer code editor
### O.2 Add locked/editable code regions
### O.3 Add inline task validation
### O.4 Move lesson content to markdown/MDX-like source
### O.5 Add browser-based visual review pass
### O.6 Expand supported Admin SDK concepts

---

## Suggested First Delegation Batch

If subagents are used, a good first sequence is:

1. Phase 1 — Package Setup
2. Phase 2 — Prototype Shell
3. Phase 3 — Lesson Data Model
4. Phase 4 — Editor Prototype
5. Phase 5 — Preview Shell

Then continue with runtime and lesson behavior.

---

## Delegation Batches

The tasks above are intentionally tiny. For actual execution, they should be grouped into small delegation batches that still preserve fast feedback and low merge risk.

Each batch below is designed to be:

- coherent enough for a subagent to complete independently
- small enough to review quickly
- low-risk to integrate before the next batch starts

## Batch A — Scaffold the package

### Goal
Create a bootable package under `packages/admin-sdk-tutorial` that renders a placeholder Vue app.

### Includes
- 1.1 Create package folder structure
- 1.2 Add package manifest
- 1.3 Add TypeScript config
- 1.4 Add Vite config
- 1.5 Add app HTML entry
- 1.6 Add source entrypoint
- 1.7 Add root app component
- 1.8 Register workspace dependencies
- 1.9 Ensure package is included by workspace conventions

### Suggested agent type
- `general` or direct implementation by parent session

### Expected output
- package exists
- app boots locally
- placeholder UI renders

### Validation
- install/build tooling resolves
- dev server starts
- root component mounts successfully

## Batch B — Build the split tutorial shell

### Goal
Establish the Solid-inspired split-screen experience with a stable left/right layout.

### Includes
- 2.1 Replace placeholder with split layout shell
- 2.2 Add base shell styling
- 2.3 Create lesson sidebar component
- 2.4 Create workspace panel component
- 2.5 Wire shell components into root app
- 2.6 Add mobile-safe fallback layout behavior

### Suggested agent type
- `general`

### Expected output
- tutorial shell exists
- left panel shows lesson area placeholder
- right panel shows workspace area placeholder
- narrow viewport stacks acceptably

### Validation
- desktop layout reads clearly
- responsive fallback does not break app shell

## Batch C — Add lesson data and navigation

### Goal
Make the shell data-driven with three prototype lessons and clickable switching.

### Includes
- 3.1 Create lesson type definitions
- 3.2 Create prototype lesson data file
- 3.3 Add active lesson state in app shell
- 3.4 Render lesson metadata in sidebar
- 3.5 Add lesson switching behavior
- 3.6 Add reset-on-lesson-change behavior

### Suggested agent type
- `general`

### Expected output
- three lessons exist in structured data
- lesson list renders in sidebar
- active lesson can be changed
- shell state resets when lesson changes

### Validation
- lesson titles and descriptions render correctly
- switching updates the active view without stale state

## Batch D — Add the first editor experience

### Goal
Give the learner a simple but working in-browser editing area.

### Includes
- 4.1 Create editor component shell
- 4.2 Add editable text area as first editor
- 4.3 Bind editor to lesson starter code
- 4.4 Add local editor state updates
- 4.5 Add reset button
- 4.6 Add basic file/tab affordance

### Suggested agent type
- `general`

### Expected output
- active lesson starter code loads in editor
- learner can edit code
- reset restores starter content
- UI looks like a lightweight single-file editor

### Validation
- edits are reactive
- lesson change reloads correct starter code
- reset behaves deterministically

## Batch E — Add preview shell and dummy admin skeleton

### Goal
Create the visual target area where Admin SDK behavior will appear.

### Includes
- 5.1 Create preview container component
- 5.2 Add dummy admin shell component
- 5.3 Add preview composition
- 5.4 Add output/status area
- 5.5 Add empty-state messaging

### Suggested agent type
- `general`

### Expected output
- preview area is visible
- dummy admin shell renders with nav/content/notification regions
- output panel exists for status/errors

### Validation
- shell is visually understandable without any execution yet
- preview and output areas remain stable during lesson switching

## Batch F — Add runtime state plumbing

### Goal
Introduce deterministic preview state that the mock SDK bridge can mutate.

### Includes
- 6.1 Create runtime type definitions
- 6.2 Create runtime state factory
- 6.3 Add runtime state to root app
- 6.4 Pass runtime state into preview shell
- 6.5 Add runtime reset helper

### Suggested agent type
- `general`

### Expected output
- runtime state model exists
- preview consumes runtime state reactively
- runtime can be reset cleanly

### Validation
- reset returns preview to baseline state
- no lesson data is hardcoded into preview rendering paths

## Batch G — Implement the mock Admin SDK bridge

### Goal
Create a narrow bridge API that converts learner actions into dummy admin state changes.

### Includes
- 7.1 Create bridge module skeleton
- 7.2 Add notification API surface
- 7.3 Add menu item API surface
- 7.4 Add location registration API surface
- 7.5 Connect bridge methods to runtime state
- 7.6 Add bridge reset behavior

### Suggested agent type
- `general`

### Expected output
- bridge exposes minimal APIs for all three concepts
- bridge updates runtime state deterministically

### Validation
- isolated smoke calls update runtime state as expected
- reset clears all prior bridge effects

## Batch H — Add code execution flow

### Goal
Execute learner code in-browser and connect it to the mock bridge.

### Includes
- 8.1 Create execution module skeleton
- 8.2 Define execution input contract
- 8.3 Implement first naive evaluation flow
- 8.4 Capture runtime errors
- 8.5 Trigger execution from UI
- 8.6 Reset runtime before execution
- 8.7 Surface errors in output panel

### Suggested agent type
- `general`

### Expected output
- learner code can run from the UI
- bridge methods affect preview
- execution errors are visible but non-fatal

### Validation
- success path updates preview
- error path updates output panel and preserves app stability

## Batch I — Finish the notifications lesson

### Goal
Deliver the first complete end-to-end teaching slice.

### Includes
- 9.1 Add notification lesson starter code
- 9.2 Add notification lesson text
- 9.3 Render notifications in dummy admin
- 9.4 Verify notification code path
- 9.5 Refine notification visuals

### Suggested agent type
- `general`

### Expected output
- notification lesson is understandable and runnable
- learner edits visibly change notification behavior

### Validation
- starter code produces a visible notification
- modified code changes message/type/behavior predictably

## Batch J — Finish the menu items lesson

### Goal
Deliver the second complete teaching slice.

### Includes
- 10.1 Add menu item lesson starter code
- 10.2 Add menu item lesson text
- 10.3 Render menu items in dummy sidebar
- 10.4 Verify menu registration code path
- 10.5 Refine menu visuals

### Suggested agent type
- `general`

### Expected output
- menu lesson is understandable and runnable
- learner edits visibly change the sidebar result

### Validation
- starter code adds menu content to preview
- modified code changes label/order/appearance predictably

## Batch K — Finish the locations / positions lesson

### Goal
Deliver the third complete teaching slice focused on comprehension of extension placement.

### Includes
- 11.1 Add locations lesson starter code
- 11.2 Add locations lesson text
- 11.3 Add labeled location containers to dummy admin
- 11.4 Render registered location content
- 11.5 Verify positions concept visually
- 11.6 Refine location card visuals

### Suggested agent type
- `general`

### Expected output
- location lesson is understandable and runnable
- preview clearly explains placement/targeting

### Validation
- starter code renders content in named surfaces
- content appears in the correct visual slot after edits

## Batch L — Polish and verify

### Goal
Improve readability and remove obvious prototype blockers.

### Includes
- 12.1 Add lesson progress affordance
- 12.2 Improve shell spacing and typography
- 12.3 Improve button labels and helper text
- 12.4 Improve preview empty/error states
- 12.5 Add minimal branding alignment
- 13.1 Start dev app and verify boot
- 13.2 Verify lesson switching
- 13.3 Verify notifications lesson manually
- 13.4 Verify menu items lesson manually
- 13.5 Verify locations lesson manually
- 13.6 Verify responsive layout manually
- 13.7 Fix any obvious prototype regressions

### Suggested agent type
- `general` for implementation and verification
- `browser-operator` later if a browser review pass is requested

### Expected output
- prototype is coherent and demoable
- major teaching flows work without obvious breakage

### Validation
- all three lessons work end-to-end
- layout is understandable on desktop and narrow screens

---

## Recommended Execution Order

Run batches in this order:

1. Batch A — Scaffold the package
2. Batch B — Build the split tutorial shell
3. Batch C — Add lesson data and navigation
4. Batch D — Add the first editor experience
5. Batch E — Add preview shell and dummy admin skeleton
6. Batch F — Add runtime state plumbing
7. Batch G — Implement the mock Admin SDK bridge
8. Batch H — Add code execution flow
9. Batch I — Finish the notifications lesson
10. Batch J — Finish the menu items lesson
11. Batch K — Finish the locations / positions lesson
12. Batch L — Polish and verify

## Parallelization Notes

Most batches should remain sequential because they build on shared app structure.

Limited safe parallelism:

- Batch C can begin once Batch B has stable component boundaries
- Batch D and Batch E can partially proceed in parallel after Batch B if interfaces are agreed up front
- Lesson copy work inside Batches I/J/K can be parallelized after runtime and execution foundations are complete

Avoid parallelizing:

- runtime-state and bridge changes across multiple agents at the same time
- overlapping edits to `App.vue` and shared shell composition without explicit coordination

## Handoff Guidance for Subagents

Each delegated batch should include:

- the brief in `.orchestrator/implementation-brief.md`
- this plan file
- the exact batch name and included tasks
- a reminder to stay within prototype scope
- a request to summarize changed files, assumptions, and follow-up risks

# Admin SDK Tutorial Prototype — Architecture Summary

## What we built

We built a prototype package at `packages/admin-sdk-tutorial` that demonstrates an interactive, browser-based learning flow for the Meteor Admin SDK.

The prototype includes:

- a split tutorial layout with lesson content on the left
- an in-browser code editor on the right
- a dummy admin preview shell
- a small mocked Admin SDK bridge
- browser-side code execution for learner input
- three end-to-end lessons:
  - notifications
  - menu items
  - locations / positions

## Main architecture pieces

### 1. Tutorial shell

The app shell lives in `App.vue` and coordinates:

- active lesson selection
- current editor code
- reset/run state
- runtime state for the preview
- execution feedback for the output panel

### 2. Lesson model

Lesson content is currently hardcoded in `src/lessons/lessons.ts` and typed in `src/types/lesson.ts`.

Each lesson defines:

- title and summary
- explanatory description
- learning objective
- starter code
- preview/output labels

### 3. Editor layer

The editor is intentionally lightweight:

- `CodeEditorPanel.vue`
- single-file editing (`main.ts` affordance)
- textarea-based input
- reset and run controls

This keeps the prototype simple while proving the interaction model.

### 4. Dummy admin runtime

The preview is rendered through:

- `PreviewPanel.vue`
- `DummyAdminShell.vue`

The dummy admin visualizes:

- notifications
- navigation entries
- extension surfaces / positions

It is not intended to mirror the real Shopware Administration UI exactly. It is designed to teach concepts with minimal visual noise.

### 5. Runtime state model

Preview state is represented as structured runtime data in `src/types/runtime.ts` and initialized through `src/runtime/createRuntimeState.ts`.

This separates:

- lesson content
- runtime/UI state
- execution behavior

### 6. Mock Admin SDK bridge

`src/runtime/sdkBridge.ts` provides a narrow bridge API for the prototype:

- `sdk.notification.dispatch(...)`
- `sdk.menu.add(...)`
- `sdk.location.render(...)`

Instead of talking to a real admin host, these methods mutate the dummy runtime state.

### 7. Code execution flow

`src/runtime/executeLessonCode.ts` executes learner code in the browser using a constrained runtime approach.

The flow is:

1. reset runtime state for the active lesson
2. execute learner code with access to the mock `sdk`
3. update preview from bridge mutations
4. show success/error feedback in the output panel

## Why this structure works

This prototype architecture is useful because it keeps responsibilities separate:

- lessons define teaching content
- the editor manages learner input
- execution runs user code
- the bridge translates API calls into state changes
- the preview only renders runtime state

That makes it easier to evolve the prototype without tightly coupling everything together.

---

# What a second pass could look like

## UX and visual polish

- make the dummy admin feel more product-like while staying minimal
- improve typography, spacing, and hierarchy
- reduce duplicated information between toast, empty state, and output areas
- improve mobile ergonomics further

## Editor improvements

- replace textarea with a richer code editor
- support locked/editable regions
- add inline hints or lesson tasks
- add formatting or syntax highlighting

## Better execution model

- move from naive `Function(...)` execution to a safer constrained execution layer
- support more structured lesson scaffolds
- capture richer runtime diagnostics

## Stronger lesson system

- add validation rules per lesson
- define expected outcomes instead of only freeform execution
- move lesson content into markdown/MDX or another authoring format

## More realistic SDK teaching

- expand the bridge with more Admin SDK APIs
- add more realistic host events and state transitions
- simulate communication patterns more explicitly

## Better preview fidelity

- represent locations and positions with more accurate conceptual models
- add clearer UI states for registered menu items and notifications
- introduce optional “host frame vs extension frame” visualization if needed

## Productization path

- decide whether this should remain a package app or move into a dedicated docs/tutorial surface
- define how the tutorial would integrate with Admin SDK documentation
- add analytics/progress only if the concept is validated first

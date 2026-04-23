# Admin SDK Tutorial Prototype — Real SDK + Dummy Host Integration Plan

## Goal

Replace the current fake bridge approach with an architecture where:

- learner code runs inside a lesson iframe
- learner code imports and uses the **real** `@shopware-ag/meteor-admin-sdk` package
- the dummy admin shell acts as a **host application**
- the host catches and handles the SDK's real `postMessage` traffic
- the preview stays visually simplified, but the runtime flow is close to the real Shopware Admin SDK model

This means the browser tutorial should no longer teach fake APIs like:

- `sdk.menu.add(...)`
- `sdk.location.render(...)`

Instead, it should execute real Admin SDK code and respond to real message types.

---

## Clarified direction

Confirmed requirements for this plan:

- real SDK code should execute **inside the lesson iframe**
- the dummy admin host should be **close to the real postMessage flow**
- first end-to-end concepts should be:
  - notifications
  - menu items
  - locations / positions
- learner code should use **real imports** from the Admin SDK package
- locations should use **real host concepts with simplified visuals**
- this plan should be based on actual SDK internals/docs, not just API renaming

---

## What the real SDK does

## 1. Connection model

The SDK initializes its messaging channel on load and sends a `__registerWindow__` message to the parent.

The host is expected to register the iframe window and origin in the source registry.

Important implication:

- we should not simulate an invented runtime protocol
- we should let the real SDK boot and talk to a real parent host window

## 2. Transport model

The real SDK uses:

- `window.postMessage`
- JSON string payloads
- `_type`, `_data`, `_callbackId` request envelopes
- `_type`, `_response`, `_callbackId` response envelopes

It also supports serialized function callbacks via internal `__function__` transport.

Important implication:

- host-side message handling should preferably use the SDK's own channel helpers instead of custom ad hoc parsing

## 3. Real concepts we need to support

### Notifications

Real concept:

- `notification.dispatch(...)`

### Menu items

Real concept:

- `ui.menu.addMenuItem(...)`

### Locations / positions

Real concept is more architectural:

- host UI is extended at a `positionId`
- content/view routing is based on `locationId`
- the extension decides what to render using `location.is(...)`
- host may react to `locationUpdateHeight` / `locationUpdateUrl`

Important implication:

- locations should not be modeled as a single fake `render(...)` call
- the tutorial needs a host shell that owns surfaces and iframes/iframe-like views per location

---

## Proposed target architecture

## A. Parent app = tutorial shell + dummy admin host

The parent app should own:

- the lesson UI
- the code editor
- the preview frame chrome
- the dummy admin host state
- the host-side Admin SDK handlers

The parent should also host one or more iframes that represent extension runtime contexts.

## B. Lesson iframe = real extension runtime

The learner code should run inside an iframe that:

- imports the real `@shopware-ag/meteor-admin-sdk`
- executes real SDK calls
- talks to the parent using the SDK's real channel implementation

This iframe should receive a URL containing the correct `location-id` query parameter so real location APIs work.

## C. Dummy admin host = real handler layer + simplified UI

The dummy host should register handlers for the real message types and update simplified host UI state.

Recommended implementation:

- use the SDK's channel handling utilities from the package
- do not hand-roll a fake message system unless absolutely necessary

---

## Implementation phases

## Phase 1 — Build a real iframe runtime container

### Goal
Create a lesson runtime iframe that can execute real Admin SDK code.

### Tasks
- create a dedicated iframe runtime entry in `packages/admin-sdk-tutorial`
- load the runtime in an iframe from the parent preview
- make the iframe accept lesson code input
- make the iframe execute lesson code with real imports from `@shopware-ag/meteor-admin-sdk`
- include the right `location-id` in the iframe URL

### Expected result
- learner code runs in a real iframe context
- real Admin SDK package loads there
- the parent sees real SDK postMessages

### Tiny executable tasks

#### 1.1 Create iframe runtime directory
- add `src/iframe-runtime/` structure
- create placeholder entry files

#### 1.2 Add iframe runtime app entry
- create a minimal iframe runtime bootstrap file
- ensure it can mount independently from the parent app

#### 1.3 Add iframe HTML route/entry strategy
- decide whether the iframe uses a separate html entry or routed app entry
- wire Vite accordingly

#### 1.4 Render a minimal iframe shell
- show a simple mounted runtime placeholder in the iframe

#### 1.5 Mount iframe inside preview panel
- render a real iframe in the preview area
- confirm parent and iframe both load successfully

#### 1.6 Pass starter code into iframe
- define a parent-to-iframe code handoff mechanism
- keep it simple for the first pass

#### 1.7 Add location-id query param to iframe URL
- include a configurable `location-id` in iframe src

#### 1.8 Verify iframe receives URL params correctly
- confirm runtime can read the expected `location-id`

#### 1.9 Add real SDK import to iframe bootstrap
- import the real admin-sdk package in the iframe runtime
- confirm it loads without crashing

#### 1.10 Verify parent sees first SDK postMessage
- confirm the real SDK posts to the parent window

---

## Phase 2 — Build host-side source registration and channel handling

### Goal
Make the dummy host behave like a real parent host for the SDK channel.

### Tasks
- inspect/use the SDK channel helpers from the real package
- support `__registerWindow__` handling and source registration
- ensure iframe window + origin are stored correctly for replies
- validate origin/source safely in the tutorial host
- keep the host-side messaging logic isolated in a dedicated runtime module

### Expected result
- iframe and parent are connected through the real SDK handshake
- host can answer real SDK requests

### Tiny executable tasks

#### 2.1 Create host runtime directory
- add `src/host/` structure for parent-side SDK runtime logic

#### 2.2 Add host bootstrap module
- centralize host runtime startup in one module

#### 2.3 Inspect usable SDK channel imports
- confirm exact import path(s) to use from the real package for host-side helpers

#### 2.4 Register minimal message listener in parent
- add a non-invasive message observer for debugging/verification

#### 2.5 Implement `__registerWindow__` handling
- catch the initial SDK registration message

#### 2.6 Store iframe window reference safely
- track iframe window/source in host runtime state

#### 2.7 Store origin/referrer metadata safely
- keep enough origin information for replies and validation

#### 2.8 Add source validation guardrails
- reject clearly invalid/unexpected sources

#### 2.9 Move message logic out of components
- keep handler setup in host runtime modules, not Vue component bodies

#### 2.10 Verify request-response flow with one trivial handler
- confirm the parent can answer a real SDK-originated request

---

## Phase 3 — Implement real notification handling

### Goal
Support real `notification.dispatch(...)` from iframe code.

### Tasks
- replace lesson code with real notification imports and calls
- implement host handler for notification dispatch message type
- map the real payload shape into dummy host notification UI
- support at least title/message/variant
- optionally support callback actions only if the handler path is stable enough

### Expected result
- learner writes real notification SDK code
- dummy host shows a notification based on real SDK messaging

### Tiny executable tasks

#### 3.1 Replace notifications starter code with real imports
- update lesson code to import the real notification API

#### 3.2 Replace fake notification payload fields
- switch from fake fields like `tone` to real SDK fields like `variant`

#### 3.3 Add notification execution path in iframe
- ensure lesson code runs successfully from the iframe runtime

#### 3.4 Register host notification handler
- implement handling for the real notification message type

#### 3.5 Map notification payload into host state
- update dummy host state from real payload values

#### 3.6 Render real notification result in preview
- show the resulting notification in the dummy host UI

#### 3.7 Verify end-to-end notification flow
- run real lesson code and confirm host updates from postMessage

#### 3.8 Verify error handling for notification lesson
- confirm invalid code still fails gracefully

---

## Phase 4 — Implement real menu item handling

### Goal
Support real `ui.menu.addMenuItem(...)` from iframe code.

### Tasks
- replace lesson code with real menu API imports/calls
- implement host handler for the real menu item add message type
- store host-side menu items in dummy admin state
- render those items in the sidebar
- on click, open or route to the related `locationId`

### Expected result
- learner writes real menu SDK code
- dummy host sidebar updates from real SDK messaging

### Tiny executable tasks

#### 4.1 Replace menu lesson starter code with real imports
- update lesson code to import real menu APIs

#### 4.2 Use real `ui.menu.addMenuItem(...)` lesson code
- remove the fake menu call from the learner-facing lesson

#### 4.3 Add menu message handler in host runtime
- implement handling for the real menu item add message type

#### 4.4 Persist dynamic menu items in host state
- store host-side menu items from real SDK requests

#### 4.5 Render dynamic menu items in sidebar
- reflect real handler output in dummy admin navigation

#### 4.6 Add click handling for menu items
- let sidebar clicks switch/open the related location view

#### 4.7 Wire menu item locationId into iframe selection
- update active iframe/location based on menu interaction

#### 4.8 Verify end-to-end menu flow
- confirm real SDK lesson code updates host navigation correctly

---

## Phase 5 — Implement real location/position flow

### Goal
Teach real location and position concepts, even with simplified visuals.

### Tasks
- rewrite the lesson around real concepts:
  - `positionId`
  - `locationId`
  - `location.is(...)`
- add host-owned extension surfaces/cards labeled by position
- create location-specific iframe views using query params like `?location-id=...`
- support host handling for `locationUpdateHeight`
- optionally support `locationUpdateUrl` if useful for the tutorial flow

### Expected result
- learner code uses real location concepts
- dummy host visualizes where extension views belong
- the extension iframe can determine its current location using the real SDK API

### Tiny executable tasks

#### 5.1 Rewrite lesson copy around real location concepts
- update copy to teach `positionId`, `locationId`, and `location.is(...)`

#### 5.2 Rewrite locations starter code with real imports
- remove fake render-style lesson code

#### 5.3 Add host-owned position surfaces
- render labeled host surfaces/cards for simplified positions

#### 5.4 Add location-specific iframe URL generation
- build iframe URLs with the right `location-id`

#### 5.5 Add support for switching visible location view
- allow the parent host to show the correct runtime view for a location

#### 5.6 Implement `locationUpdateHeight` handler
- resize iframe or tracked host view height from real SDK messages

#### 5.7 Decide whether to support `locationUpdateUrl` now
- explicitly choose keep/skip for this first pass

#### 5.8 If included, implement `locationUpdateUrl` handler
- store/update route state safely in the dummy host

#### 5.9 Verify `location.is(...)` behavior in iframe
- confirm the lesson runtime sees the expected location from URL params

#### 5.10 Verify end-to-end locations flow
- confirm real lesson code updates the correct host surface

---

## Phase 6 — Replace mock bridge lesson execution path

### Goal
Remove the current fake bridge from the core lesson path.

### Tasks
- stop using the mock bridge for the three primary lessons
- route Run/Reset through the iframe runtime instead
- keep the old mock code only temporarily if needed during migration
- remove deprecated fake lesson APIs after the real path is stable

### Expected result
- the prototype is primarily powered by the real SDK package
- the dummy admin shell acts as a real host adapter, not a fake API simulator

### Tiny executable tasks

#### 6.1 Identify current fake bridge dependencies
- list which components/modules still depend on the mock bridge

#### 6.2 Route Run through iframe execution
- make Run use the iframe runtime instead of the mock bridge path

#### 6.3 Route Reset through iframe runtime
- make Reset restore lesson state via the iframe path

#### 6.4 Keep temporary compatibility layer only where needed
- isolate any remaining bridge code behind a temporary adapter

#### 6.5 Remove fake notifications path
- stop using the old mock notification behavior for the main lesson flow

#### 6.6 Remove fake menu path
- stop using the old mock menu behavior for the main lesson flow

#### 6.7 Remove fake locations path
- stop using the old mock location behavior for the main lesson flow

#### 6.8 Delete deprecated bridge code once unused
- remove dead mock runtime pieces after migration is stable

---

## Phase 7 — Validate parity and teaching clarity

### Goal
Ensure the new architecture is both correct and understandable.

### Tasks
- verify notification lesson end-to-end in browser
- verify menu lesson end-to-end in browser
- verify location lesson end-to-end in browser
- confirm postMessage flow is working as expected
- check console/network/runtime logs for handler issues
- simplify copy where real SDK complexity becomes too noisy

### Expected result
- prototype still feels approachable
- but now teaches real SDK behavior and terminology

### Tiny executable tasks

#### 7.1 Browser-verify notifications lesson
- test the real notification lesson end-to-end

#### 7.2 Browser-verify menu lesson
- test the real menu lesson end-to-end

#### 7.3 Browser-verify locations lesson
- test the real locations lesson end-to-end

#### 7.4 Check message traffic sanity
- confirm request/response flow behaves as expected in browser/devtools

#### 7.5 Check console for handler/runtime issues
- identify any host or iframe runtime warnings/errors

#### 7.6 Check iframe sizing behavior
- verify height updates behave reasonably in the dummy host

#### 7.7 Tighten teaching copy where needed
- simplify any lesson text that became too implementation-heavy

#### 7.8 Final browser sanity pass
- confirm the prototype still feels coherent and teachable

---

## Required host-side capabilities

The dummy host should be prepared to handle at least:

- `__registerWindow__`
- notification dispatch message(s)
- menu item add message(s)
- location-related update messages such as height updates

Potentially useful additional support later:

- callback transport for action buttons
- URL update handling
- more UI extension APIs

---

## Recommended implementation modules

Suggested new areas inside `packages/admin-sdk-tutorial`:

- `src/host/`
  - source registry / host bootstrap
  - channel handler registration
  - host state adapters
- `src/iframe-runtime/`
  - iframe app entry
  - lesson runtime bootstrap
  - real SDK execution wrapper
- `src/lessons/`
  - updated lesson code using real SDK imports
- `src/preview/`
  - dummy host surfaces / location frame rendering

---

## Constraints and gotchas

- the real SDK depends on parent/iframe messaging assumptions, so the iframe runtime must be a genuine iframe
- function callbacks require correct SDK serializer/deserializer support; avoid custom raw message handling if possible
- `location.is(...)` depends on URL query parameters, so iframe URLs must be managed deliberately
- the tutorial host should still validate message source/origin even in local prototype mode
- a hidden bootstrap location such as `sw-main-hidden` may be useful for registration-style lesson flows

---

## Migration strategy

Recommended order:

1. notifications
2. menu items
3. locations / positions

Reason:

- notifications are the smallest end-to-end real handler slice
- menu adds real host navigation behavior with manageable complexity
- locations require the deepest conceptual and architectural change

---

## Suggested execution batches

These tiny tasks can be grouped into practical implementation batches.

### Batch A — Real iframe runtime bootstrap
- 1.1 through 1.10

### Batch B — Host registration and channel setup
- 2.1 through 2.10

### Batch C — Real notifications vertical slice
- 3.1 through 3.8

### Batch D — Real menu vertical slice
- 4.1 through 4.8

### Batch E — Real locations vertical slice
- 5.1 through 5.10

### Batch F — Remove fake bridge path
- 6.1 through 6.8

### Batch G — End-to-end validation and polish
- 7.1 through 7.8

---

## Source-of-truth references

### Core internals
- `packages/admin-sdk/src/channel.ts`
- `packages/admin-sdk/src/message-types.ts`
- `packages/admin-sdk/src/_internals/serializer/function-serializer.ts`

### Feature APIs
- `packages/admin-sdk/src/notification/index.ts`
- `packages/admin-sdk/src/ui/menu/index.ts`
- `packages/admin-sdk/src/location/index.ts`
- `packages/admin-sdk/src/ui/component-section/index.ts`
- `packages/admin-sdk/src/ui/tabs/index.ts`

### Docs
- `docs/admin-sdk/internals/how-it-works.md`
- `docs/admin-sdk/api-reference/notification.md`
- `docs/admin-sdk/api-reference/ui/menu.md`
- `docs/admin-sdk/api-reference/location.md`
- `docs/admin-sdk/api-reference/ui/component-section.md`
- `docs/admin-sdk/api-reference/ui/tabs.md`
- `docs/admin-sdk/concepts/locations.md`
- `docs/admin-sdk/concepts/component-sections.md`
- `docs/admin-sdk/concepts/positions.md`

---

## Recommendation

The correct next direction is:

- **do not just rename the fake bridge APIs**
- **do use the real Admin SDK package inside a lesson iframe**
- **do implement real host-side handlers in the dummy admin shell**
- **keep the visuals simplified, but make the runtime architecture real**

---

## Current implementation status

### Finished batches

#### Batch A — Real iframe runtime bootstrap
Status: **finished**

Completed:
- real iframe runtime entry exists
- iframe loads inside the preview
- real `@shopware-ag/meteor-admin-sdk` is imported in the iframe runtime
- lesson code is sent from parent to iframe
- parent observes real SDK traffic
- `__registerWindow__` is acknowledged so bootstrap does not time out

#### Batch B — Host registration and channel setup
Status: **finished**

Completed:
- parent-side host runtime module exists
- host-side message observation was moved out of the component body
- source registration count is surfaced in the UI
- real channel bootstrap is stable in browser

#### Batch C — Real notifications vertical slice
Status: **finished**

Completed:
- notifications lesson now uses the real API shape
- real notification traffic flows from iframe to host
- dummy host updates notification UI from real handler results
- success/error states work
- last successful notification state is preserved on error

#### Batch D — Real menu vertical slice
Status: **finished**

Completed:
- menu lesson now uses the real API shape: `ui.menu.addMenuItem(...)`
- real `menuItemAdd` traffic is sent from iframe to host
- menu success/error states work
- no obvious console issues

Completed:
- edited menu payloads now update the dummy host sidebar correctly
- dynamic menu item ordering reacts to changed position values
- menu success/error states are preserved through the real iframe/host path

Minor remaining note:
- the iframe runtime display can still show concatenated old + new code text during repeated runs, but host behavior is now correct

#### Batch E — Real locations vertical slice
Status: **finished**

Completed:
- locations lesson now uses real concepts:
  - `location.MAIN_HIDDEN`
  - `ui.componentSection.add(...)`
  - `location.is(...)`
  - `location.updateHeight(...)`
- real `uiComponentSectionRenderer` traffic flows from iframe to host
- dummy host renders location iframes inside the chosen host slot
- host slot changes correctly when `positionId` changes
- height updates are handled via real `locationUpdateHeight` traffic
- success/error states work through the real iframe/host path

#### Batch F — Remove fake bridge path
Status: **finished**

Completed:
- old fake bridge execution path was removed from the active lesson flow
- old fake runtime executor was removed
- all three lessons now work through the real iframe + host message flow
- verification confirmed no visible dependency on the old mock bridge remains

---

## What is currently broken

### Main broken area

There is currently **no blocking migration issue** in Batches A-F.

The remaining work is now primarily **polish and cleanup**, not a core runtime blocker.

### Remaining rough edges

- the iframe runtime display can still show concatenated old + new code text during repeated runs
- some error output can still feel slightly repetitive depending on the lesson
- code and runtime synchronization should still be simplified and cleaned up before final polish/commit

### Likely cleanup area

The remaining issue appears to be mostly in the **iframe runtime display/synchronization layer**, not in the real host handler flow.

---

## Follow-up task breakdown for cleanup and validation

### Task group 1 — Clean up iframe runtime display behavior

#### 1.1 Reproduce concatenated iframe code display deterministically
- confirm the exact circumstances where old + new code are both shown

#### 1.2 Compare editor value vs iframe displayed value
- confirm whether the iframe is receiving the same code shown in the editor

#### 1.3 Compare iframe displayed value vs executed value
- confirm whether the code displayed in the iframe is the code actually being executed

#### 1.4 Simplify runtime code display source
- make the iframe display only the current run snapshot or current editor state, not both ambiguously

### Task group 2 — Polish error/output messaging

#### 2.1 Reduce repeated failure wording
- simplify output cards so one failure message is enough

#### 2.2 Align failure copy across all three lessons
- ensure notifications, menu, and locations all use equally clear output wording

#### 2.3 Verify preserved-success-state behavior still reads clearly
- make sure preserved host state on error feels intentional, not confusing

### Task group 3 — Final validation / polish

#### 3.1 Re-run notifications lesson end-to-end
#### 3.2 Re-run menu lesson end-to-end
#### 3.3 Re-run locations lesson end-to-end
#### 3.4 Verify desktop layout still feels coherent
#### 3.5 Verify mobile layout still feels coherent

### Task group 4 — Prepare final commit/summary

#### 4.1 Summarize runtime architecture as implemented
#### 4.2 Note remaining known quirks explicitly
#### 4.3 Prepare clean commit once Batch G is complete

---

## Resume point

When implementation resumes, the next focus should be:

1. finish Batch G validation/polish
2. clean up remaining minor iframe-display quirks if worthwhile
3. prepare a clean summary + commit

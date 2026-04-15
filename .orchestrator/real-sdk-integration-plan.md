# Admin SDK Tutorial Prototype — Real SDK Integration Plan

## Current state

The prototype currently uses a **mock bridge** with simplified calls such as:

- `sdk.notification.dispatch(...)`
- `sdk.menu.add(...)`
- `sdk.location.render(...)`

This is useful for teaching, but the last two are **not real Admin SDK APIs**, and the notification payload shape is also not fully correct.

## What is real in the Admin SDK

### Notifications

Use the real API:

- `notification.dispatch({...})`

Important detail:

- use `variant`, not `tone`

Alternative:

- `toast.dispatch({...})` if the tutorial should teach the toast API instead

## Menu / navigation items

Do **not** use:

- `sdk.menu.add(...)`

Use instead:

- `ui.menu.addMenuItem({...})`

Likely teaching shape:

- `label`
- `locationId`
- `parent`
- `position`

## Locations / positions

Do **not** use:

- `sdk.location.render(...)`

Real pattern:

1. register or extend a UI surface using a UI API with a `positionId`
2. point that surface to a `locationId`
3. render content when the extension is loaded at that location using:
   - `location.is('my-location-id')`

Depending on the concept being taught, the closest real APIs are:

- `ui.componentSection.add(...)`
- `ui.tabs(...).addTabItem(...)`
- `ui.menu.addMenuItem(...)`
- `ui.mainModule.addMainModule(...)`
- `ui.settings.addSettingsItem(...)`

## Recommended implementation approach

### Phase 1 — Replace lesson code with real API shapes

#### Notifications lesson
- change starter code from mock notification payload to real `notification.dispatch({...})`
- replace `tone` with `variant`
- update the mock bridge so it accepts the real field names

#### Menu lesson
- change starter code from `sdk.menu.add(...)` to `ui.menu.addMenuItem({...})`
- teach `locationId` and `position` explicitly
- update the mock bridge to expose a real-looking `ui.menu.addMenuItem(...)` interface

#### Locations lesson
- replace `sdk.location.render(...)` with a more realistic two-part teaching model:
  - registration into a `positionId`
  - rendering based on `locationId`
- the prototype can still simplify the runtime, but the tutorial code should reflect real concepts

### Phase 2 — Reshape the mock bridge around real SDK namespaces

Instead of this simplified mock:

- `sdk.notification.dispatch`
- `sdk.menu.add`
- `sdk.location.render`

move toward a bridge shaped like the real SDK:

- `notification.dispatch`
- `ui.menu.addMenuItem`
- `ui.componentSection.add`
- `location.is`

This keeps the tutorial implementation browser-local while making the learner-facing code much more accurate.

### Phase 3 — Update lesson copy and preview semantics

- explain that `positionId` defines where host UI is extended
- explain that `locationId` identifies which extension view is rendered
- align preview labels with the real SDK terms

### Phase 4 — Add “prototype simplification” notes where needed

Where the tutorial still simplifies real runtime behavior, add a short note such as:

> “This prototype visualizes the real SDK concept in a simplified host shell.”

That way, the code stays realistic even if the rendering model is simplified.

## Suggested migration order

1. notifications
2. menu items
3. locations / positions

Reason:

- notifications are the easiest to align with the real API
- menu items are moderately complex but still straightforward
- locations/positions require the biggest conceptual rewrite

## Key repo references

- `packages/admin-sdk/src/notification/index.ts`
- `docs/admin-sdk/api-reference/notification.md`
- `packages/admin-sdk/src/toast/index.ts`
- `docs/admin-sdk/api-reference/toast.md`
- `packages/admin-sdk/src/ui/menu/index.ts`
- `docs/admin-sdk/api-reference/ui/menu.md`
- `packages/admin-sdk/src/location/index.ts`
- `docs/admin-sdk/api-reference/location.md`
- `packages/admin-sdk/src/ui/component-section/index.ts`
- `docs/admin-sdk/api-reference/ui/component-section.md`
- `packages/admin-sdk/src/ui/tabs/index.ts`
- `docs/admin-sdk/api-reference/ui/tabs.md`
- `docs/admin-sdk/concepts/locations.md`
- `docs/admin-sdk/concepts/component-sections.md`
- `docs/admin-sdk/concepts/positions.md`

## Recommendation

The right next step is **not** to remove the mock runtime.

The right next step is to:

1. keep the browser-local teaching runtime
2. reshape the learner-facing code so it matches the **real SDK API surface and terminology**
3. update the preview model to visualize those real concepts faithfully enough

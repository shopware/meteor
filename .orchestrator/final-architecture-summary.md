# Admin SDK Tutorial Prototype — Final Architecture Summary

## What the prototype now does

The tutorial prototype now runs the **real Meteor Admin SDK** inside lesson iframes and uses a **dummy admin host shell** in the parent app to handle the resulting postMessage traffic.

This means the learner-facing code is no longer powered by a fake SDK bridge for the main lessons.

## Runtime architecture

### 1. Parent app = tutorial shell + dummy host

The main Vue app is responsible for:

- lesson selection
- editor state
- preview shell UI
- output/status UI
- host-side Admin SDK handler registration
- simplified dummy admin state rendering

### 2. Lesson runtime = real iframe context

Each lesson run is executed in an iframe runtime that:

- imports the real `@shopware-ag/meteor-admin-sdk`
- receives lesson code from the parent
- executes that code in an iframe context
- communicates with the parent through real SDK `postMessage` traffic

### 3. Host-side handler layer

The parent host listens for and handles real SDK messages, including:

- `__registerWindow__`
- `notificationDispatch`
- `menuItemAdd`
- `uiComponentSectionRenderer`
- `locationUpdateHeight`

These handlers translate SDK messages into simplified dummy-admin UI state.

## Lesson architecture

### Notifications

- learner code uses the real notification API shape
- iframe sends real notification traffic
- host renders the notification in the dummy admin shell

### Menu items

- learner code uses `ui.menu.addMenuItem(...)`
- iframe sends real menu registration traffic
- host updates dummy sidebar navigation

### Locations / positions

- learner code uses real concepts like:
  - `location.MAIN_HIDDEN`
  - `ui.componentSection.add(...)`
  - `location.is(...)`
  - `location.updateHeight(...)`
- host renders simplified extension surfaces
- matching location iframes are mounted into the chosen host slot

## UI architecture

The visible tutorial experience has four main parts:

- tutorial sidebar
- real code editor
- dummy admin preview shell
- output/status panel

The preview uses a landscape-oriented host frame so the dummy admin feels closer to a real monitor-based admin environment.

## Current strengths

- real SDK package is used for the main lessons
- real iframe/host message flow is in place
- simplified host shell is enough to teach the concepts clearly
- success/error states are visible to the learner
- desktop and mobile layouts both work

## Remaining minor quirks

- the iframe runtime display can still show slightly imperfect code text across repeated runs
- some preserved error-state visuals could still be polished further

## Bottom line

The prototype now teaches the Admin SDK with a **real runtime architecture** and a **simplified host UI**, rather than only simulating the API surface.

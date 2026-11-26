---
title: Stepper
description: A list of steps that shows how far a user has come in a multi-step process.
---

::component-example{name="stepper-basic-example"}
::

## Usage

**Stepper** shows the steps of a process in order, such as a setup wizard, and marks which steps are completed, which one is current, and which are still to come. It only displays progress: the steps cannot be clicked, so your page keeps the current step and moves it with its own controls.

```ts
import { MtStepper, type StepperStep } from "@shopware-ag/meteor-component-library";
```

Pass the steps as `steps`, in the order users go through them. Every step has a `label`. Set `current-step` to the zero-based index of the step the user is on.

## Examples

### Horizontal

Set `orientation` to `horizontal` to lay the steps out in a row, with every label centered below its marker.

::component-example{name="stepper-horizontal-example" fullWidth}
::

### Moving between steps

Keep the current step in your own state and change it from your own controls, for example Back and Next buttons.

::component-example{name="stepper-navigation-example"}
::

### Completed current step

Set `completed` on the current step to show it as completed while the user is still on it, for example once everything in the step is done and before they move on.

::component-example{name="stepper-completed-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep labels short, ideally one or two words, so they fit on one line.
- Show every step of the process from the start, so users can see how much is ahead of them.
- Use the vertical orientation when labels are long or space is narrow, and the horizontal orientation for a few steps with short labels.
- Place the controls that move between steps close to the content of the current step.

#dont

- Do not use **Stepper** for progress that is measured as a value, such as an upload.
- Do not use **Stepper** to switch between independent sections that users can open in any order.
- Do not add or remove steps while the user is in the middle of the process.
- Do not rely on **Stepper** to show that something went wrong. It has no error state, so show errors in the content of the step.

::

## Behavior

- Every step before the current step shows as completed and every step after it as upcoming. `current-step` defaults to `0`, the first step.
- An index outside of the steps marks no step as current. A negative index leaves every step upcoming, and an index of `steps.length` or more completes every step, which fits a process that is finished.
- `completed` on a step overrides its position. A step with `completed: true` shows as completed even when it is the current step or comes after it, and a step with `completed: false` does not show as completed even when it comes before the current step.
- **Stepper** fills the available width. In the vertical orientation, long labels wrap onto further lines and the connector to the next step grows with them.
- In the horizontal orientation, the steps share the available width equally, so the markers are evenly spaced whatever the length of the labels. The connectors stretch with the width, and a label that does not fit into its step wraps. Set the CSS width of **Stepper**, for example to `fit-content`, to keep it compact.
- A word that is longer than the space of its label breaks onto the next line, with a hyphen where the browser can hyphenate the language of the page.
- The label of the current step has a medium weight and uses the primary text color. The labels of all other steps use the secondary text color. Every label reserves the space of the medium weight, so the steps do not shift when the current step changes.
- **Stepper** renders nothing while `steps` is empty.

## Accessibility

- The steps are an ordered list, so screen readers announce the number of steps and the position of each one. The list is named "Progress" by default. Use `aria-label` to change that name.
- The current step carries `aria-current="step"`.
- The label of a completed step is prefixed with a visually hidden "Completed:". The markers are hidden from assistive technology.
- The steps cannot be focused or activated. Keyboard users move through the process with the controls of your page.
- A change of the current step is not announced. When the user moves to another step, move the focus to the content of that step, for example its heading.
- The current step differs from the other steps by the color of its marker and by the medium weight of its label, so it does not rely on color alone.

## Related components

- [**Progress Bar**](/components/progress-bar): when progress is a measurable value instead of a set of named steps.
- [**Tabs**](/components/tabs): when users switch freely between peer sections instead of following a fixed order.
- [**Breadcrumb**](/components/breadcrumb): when users need to see where a page sits in a hierarchy.

---
title: Confirmation
description: A request to approve a tool call before it runs, and the answer once given.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="confirmation-basic-example"}
::

## Usage

**Confirmation** asks the user to approve what an AI is about to do, such as changing the stock of a product, and shows the answer afterwards. Place it below the [**Tool**](/components/tool) call it belongs to.

Bind the `approval` and `state` of the AI SDK tool part. The parts show depending on the state, so the same markup covers the request and the answer. Answer the approval with the AI SDK's `addToolApprovalResponse({ id: approval.id, approved })`.

```ts
import {
  MtConfirmation,
  MtConfirmationAccepted,
  MtConfirmationAction,
  MtConfirmationActions,
  MtConfirmationRejected,
  MtConfirmationRequest,
  MtConfirmationTitle,
} from "@shopware-ag/meteor-component-library";
```

## Anatomy

**Confirmation** is built from seven companion exports that work together:

- `mt-confirmation` is the card. It takes `approval` and `state`.
- `mt-confirmation-title` names what is asked, such as "Change the stock?".
- `mt-confirmation-request` describes what will happen.
- `mt-confirmation-accepted` and `mt-confirmation-rejected` describe the answer.
- `mt-confirmation-actions` holds the buttons, `mt-confirmation-action`.

## API reference

### Confirmation

:component-api{name="MtConfirmation"}

### Action

:component-api{name="MtConfirmationAction"}

The title, request, accepted, rejected and actions parts only take their default slot.

## Best practices

::do-dont{vertical}
#do

- Say exactly what will change in the request, such as the product and the new stock.
- Use `variant="primary"` for the approving action and keep the declining action secondary.

#dont

- Do not ask for approval of actions that only read data.
- Do not combine several changes in one confirmation; ask for each tool call.

::

## Behavior

| `state`                                                   | Shows                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| `input-streaming`, `input-available`                      | Nothing                                                      |
| `approval-requested`                                      | Title, request and actions                                   |
| `approval-responded`, `output-available`, `output-denied` | Title and the accepted or rejected part, by `approval.approved` |

- Without an `approval`, it shows nothing.
- With the AI SDK, set `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses` in `useChat()`, so the answer continues once every approval is given.

## Accessibility

- The actions are buttons with their label as accessible name.
- The request and the answer are text, so they don't depend on color.

## Related components

- [**Tool**](/components/tool): for the tool call that the approval belongs to.
- [**Modal**](/components/modal): when an action outside a conversation needs a confirmation.

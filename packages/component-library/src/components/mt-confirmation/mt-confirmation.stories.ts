import type { Meta, StoryObj } from "@storybook/vue3";
import MtConfirmation from "./mt-confirmation.vue";
import MtConfirmationAccepted from "./mt-confirmation-accepted.vue";
import MtConfirmationAction from "./mt-confirmation-action.vue";
import MtConfirmationActions from "./mt-confirmation-actions.vue";
import MtConfirmationRejected from "./mt-confirmation-rejected.vue";
import MtConfirmationRequest from "./mt-confirmation-request.vue";
import MtConfirmationTitle from "./mt-confirmation-title.vue";

export type MtConfirmationMeta = Meta<typeof MtConfirmation>;

const meta: MtConfirmationMeta = {
  title: "Components/Confirmation",
  component: MtConfirmation,
  args: {
    state: "approval-requested",
    approval: { id: "approval-1" },
  },
  render: (args) => ({
    components: {
      MtConfirmation,
      MtConfirmationTitle,
      MtConfirmationRequest,
      MtConfirmationAccepted,
      MtConfirmationRejected,
      MtConfirmationActions,
      MtConfirmationAction,
    },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 32rem">
        <mt-confirmation v-bind="args">
          <mt-confirmation-title>Change the stock?</mt-confirmation-title>
          <mt-confirmation-request>Set the stock of SW-1012 to 40.</mt-confirmation-request>
          <mt-confirmation-accepted>You approved the stock change.</mt-confirmation-accepted>
          <mt-confirmation-rejected>You declined the stock change.</mt-confirmation-rejected>
          <mt-confirmation-actions>
            <mt-confirmation-action>Decline</mt-confirmation-action>
            <mt-confirmation-action variant="primary">Approve</mt-confirmation-action>
          </mt-confirmation-actions>
        </mt-confirmation>
      </div>
    `,
  }),
};

export default meta;
export type MtConfirmationStory = StoryObj<MtConfirmationMeta>;

export const Default: MtConfirmationStory = {};

export const Approved: MtConfirmationStory = {
  args: { state: "output-available", approval: { id: "approval-1", approved: true } },
};

export const Declined: MtConfirmationStory = {
  args: { state: "output-denied", approval: { id: "approval-1", approved: false } },
};

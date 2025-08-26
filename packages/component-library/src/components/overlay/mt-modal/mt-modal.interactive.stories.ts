import MtText from "@/components/content/mt-text/mt-text.vue";
import meta from "./mt-modal.stories";
import MtModal from "./mt-modal.vue";
import MtModalRoot from "./sub-components/mt-modal-root.vue";
import MtModalTrigger from "./sub-components/mt-modal-trigger.vue";
import MtButton from "@/components/form/mt-button/mt-button.vue";
import { ref } from "vue";
import { defineStory } from "@/_internal/story-helper";
import { expect, within, userEvent } from "@storybook/test";
import MtNumberField from "@/components/form/mt-number-field/mt-number-field.vue";
import { waitUntil } from "../../../_internal/test-helper";

export default {
  ...meta,
  title: "Interaction Tests/Overlay/mt-modal",
};

export const VisualTestContent = {
  name: "Render the modal with content",
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtModalTrigger, MtButton, MtText },
    setup() {
      return {
        args,
      };
    },
    template:
      "<mt-modal-root isOpen><mt-modal v-bind='args'><template #default><mt-text>Lorem ipsum dolor sit amet</mt-text></template><template #footer><div style='width: 100%; display: flex; justify-content: flex-end;'><mt-button variant='primary'>Continue</mt-button></div></template></mt-modal></mt-modal-root>",
  }),
};

export const VisualTestInsetContent = {
  name: "Render the modal with inset content",
  args: {
    inset: true,
  },
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtModalTrigger, MtButton, MtText },
    setup() {
      return {
        args,
      };
    },
    template:
      "<mt-modal-root isOpen><mt-modal v-bind='args'><template #default><mt-text>Lorem ipsum dolor sit amet</mt-text></template><template #footer><div style='width: 100%; display: flex; justify-content: flex-end;'><mt-button variant='primary'>Continue</mt-button></div></template></mt-modal></mt-modal-root>",
  }),
};

export const VisualTestOverflowingContent = {
  name: "Render with overflowing content",
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtButton, MtText },
    setup() {
      return {
        args,
      };
    },
    template: `
<mt-modal-root isOpen>
    <mt-modal v-bind='args'>
        <template #default>
            <mt-text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </mt-text>
            <mt-text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </mt-text>
            <mt-text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </mt-text>
            <mt-text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </mt-text>
            <mt-text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </mt-text>
        </template>

        <template #footer>
            <div style='width: 100%; display: flex; justify-content: flex-end;'>
                <mt-button variant='primary'>Continue</mt-button>
            </div>
        </template>
    </mt-modal>
</mt-modal-root>`,
  }),
};

export const VisualTestTeleportFeature = defineStory({
  name: "Render the modal with the teleport feature",
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtButton, MtText },
    setup() {
      const isOpen = ref(false);
      return {
        args,
        isOpen,
      };
    },
    template: `
<div style="width: 400px; height: 200px; background-color: lightblue; transform: translate3d(1px, 1px, 1px); padding: 20px;">
  <p>
    The modal should also working inside a container with a transform

    <br />
    <br />

    <mt-button @click="isOpen = !isOpen" variant="primary">Toggle modal</mt-button>
  </p>

  <mt-modal-root :isOpen="isOpen" @change="($event) => isOpen = $event">
      <mt-modal v-bind='args'>
          <template #default>
              <mt-text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </mt-text>
              <mt-text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </mt-text>
              <mt-text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </mt-text>
              <mt-text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </mt-text>
              <mt-text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </mt-text>
          </template>

          <template #footer>
              <div style='width: 100%; display: flex; justify-content: flex-end;'>
                  <mt-button variant='primary'>Continue</mt-button>
              </div>
          </template>
      </mt-modal>
  </mt-modal-root>
</div>
`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const triggerButton = canvas.getByRole("button", { name: "Toggle modal" });
    await triggerButton.click();

    // Get body as a within element because the modal is rendered in a portal
    const body = within(document.querySelector("body") as HTMLElement);

    // Get the modal
    const modal = body.getByRole("dialog");

    // Check if the modal is visible
    await expect(modal).toBeTruthy();
  },
});

export const TestOpeningAnimation = {
  name: "Animates when modal opens",
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtModalTrigger, MtButton, MtText },
    setup() {
      return {
        args,
      };
    },
    template:
      "<mt-modal-root><mt-modal-trigger as='button' style='color: var(--color-text-primary-default)'>Open modal</mt-modal-trigger><mt-modal v-bind='args'><template #default><mt-text>Modal content</mt-text></template><template #footer><div style='width: 100%; display: flex; justify-content: flex-end;'><mt-button variant='primary'>Continue</mt-button></div></template></mt-modal></mt-modal-root>",
  }),
};

export const VisualTestSmallModal = {
  name: "Render the modal at a small width",
  args: {
    width: "s",
  },
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtButton, MtText },
    setup() {
      return {
        args,
      };
    },
    template:
      "<mt-modal-root isOpen><mt-modal v-bind='args'><template #default><mt-text>Lorem ipsum dolor sit amet</mt-text></template><template #footer><div style='width: 100%; display: flex; justify-content: flex-end;'><mt-button variant='primary'>Continue</mt-button></div></template></mt-modal></mt-modal-root>",
  }),
};

export const VisualTestMediumModal = {
  name: "Render the modal at a medium width",
  args: {
    width: "m",
  },
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtButton, MtText },
    setup() {
      return {
        args,
      };
    },
    template:
      "<mt-modal-root isOpen><mt-modal v-bind='args'><template #default><mt-text>Lorem ipsum dolor sit amet</mt-text></template><template #footer><div style='width: 100%; display: flex; justify-content: flex-end;'><mt-button variant='primary'>Continue</mt-button></div></template></mt-modal></mt-modal-root>",
  }),
};

export const VisualTestLargeModal = {
  name: "Render the modal at a large width",
  args: {
    width: "l",
  },
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtButton, MtText },
    setup() {
      return {
        args,
      };
    },
    template:
      "<mt-modal-root isOpen><mt-modal v-bind='args'><template #default><mt-text>Lorem ipsum dolor sit amet</mt-text></template><template #footer><div style='width: 100%; display: flex; justify-content: flex-end;'><mt-button variant='primary'>Continue</mt-button></div></template></mt-modal></mt-modal-root>",
  }),
};

export const VisualTestExtraLargeModal = {
  name: "Render the modal at an extra large width",
  args: {
    width: "xl",
  },
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtButton, MtText },
    setup() {
      return {
        args,
      };
    },
    template:
      "<mt-modal-root isOpen><mt-modal v-bind='args'><template #default><mt-text>Lorem ipsum dolor sit amet</mt-text></template><template #footer><div style='width: 100%; display: flex; justify-content: flex-end;'><mt-button variant='primary'>Continue</mt-button></div></template></mt-modal></mt-modal-root>",
  }),
};

export const VisualTestFullWidthModal = {
  name: "Render the modal at full width",
  args: {
    width: "full",
  },
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtButton, MtText },
    setup() {
      return {
        args,
      };
    },
    template:
      "<mt-modal-root isOpen><mt-modal v-bind='args'><template #default><mt-text>Lorem ipsum dolor sit amet</mt-text></template><template #footer><div style='width: 100%; display: flex; justify-content: flex-end;'><mt-button variant='primary'>Continue</mt-button></div></template></mt-modal></mt-modal-root>",
  }),
};

export const VisualTestTooltipInModal = defineStory({
  name: "Renders a tooltip in the modal",
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtNumberField },
    setup() {
      return {
        args,
      };
    },
    template:
      "<mt-modal-root isOpen><mt-modal v-bind='args'><template #default><mt-number-field label='Number' help-text='Foo'/></template></mt-modal></mt-modal-root>",
  }),
  play: async () => {
    // Get body as a within element because the modal is rendered in a portal
    const body = within(document.querySelector("body") as HTMLElement);

    // Get the modal
    const modal = body.getByRole("dialog");
    const modalContainer = within(modal);

    const popoverToggle = modalContainer.getByTestId("mt-help-text__icon");
    await userEvent.hover(popoverToggle);

    await waitUntil(() => body.getByText("Foo"));
    // Add additional delay after the element is found
    await new Promise((resolve) => setTimeout(resolve, 200));
  },
});

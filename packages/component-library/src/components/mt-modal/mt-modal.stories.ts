import MtModal from "./mt-modal.vue";
import MtModalRoot from "./sub-components/mt-modal-root.vue";
import MtButtonClose from "./sub-components/mt-modal-close.vue";
import MtModalTrigger from "./sub-components/mt-modal-trigger.vue";
import MtButton from "../mt-button/mt-button.vue";

export default {
  title: "Components/Modal",
  component: MtModal,
  args: {
    title: "Modal Title",
    default: "Modal content",
    closable: true,
    hideHeader: false,
    width: "m",
    inset: false,
  },
  argTypes: {
    width: {
      control: { type: "select" },
      options: ["s", "m", "l", "xl", "full"],
    },
    subtitle: {
      control: { type: "text" },
    },
    default: {
      control: { type: "text" },
    },
    closable: {
      control: { type: "boolean" },
      description:
        "Set on `mt-modal-root`. Shows the close button and allows closing the modal with Escape or a click on the backdrop.",
    },
  },
  render: (args: Record<string, unknown>) => ({
    components: { MtModal, MtModalRoot, MtButtonClose, MtModalTrigger, MtButton },
    setup() {
      return { args, MtButton };
    },
    template: `
<mt-modal-root :closable="args.closable">
  <mt-modal
    :title="args.title"
    :subtitle="args.subtitle"
    :width="args.width"
    :inset="args.inset"
    :hide-header="args.hideHeader"
  >
    <template #default>{{ args.default }}</template>

    <template #footer>
      <mt-button-close :as="MtButton" variant="secondary">
        Close
      </mt-button-close>
    </template>
  </mt-modal>

  <mt-modal-trigger :as="MtButton">Open modal</mt-modal-trigger>
</mt-modal-root>`,
  }),
};

export const Default = {};

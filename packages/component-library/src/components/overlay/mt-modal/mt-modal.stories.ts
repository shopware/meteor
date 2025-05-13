import MtModal from "./mt-modal.vue";
import MtModalRoot from "./sub-components/mt-modal-root.vue";
import MtModalTrigger from "./sub-components/mt-modal-trigger.vue";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtNumberField from "../../form/mt-number-field/mt-number-field.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";

export default {
  title: "Components/Overlay/mt-modal",
  component: MtModal,
  args: {
    isOpen: true,
    title: "Modal Title",
    default: "Modal content",
  },
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtModalTrigger, MtButton, MtText, MtNumberField },
    setup() {
      return {
        args,
      };
    },
    template: `
<mt-modal-root isOpen>
  <mt-modal v-bind='args'>
    <template #default>
      <mt-text>Modal content</mt-text>
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

export const Default = {};

import MtModal from "./mt-modal.vue";
import MtModalRoot from "./sub-components/mt-modal-root.vue";
import MtModalTrigger from "./sub-components/mt-modal-trigger.vue";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtNumberField from "../../form/mt-number-field/mt-number-field.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";

export default {
  title: "Components/Overlay/mt-modal",
  component: MtModal,
  args: {
    isOpen: true,
    title: "Modal Title",
    default: "Modal content",
    closable: true,
    hideHeader: false,
  },
  render: (args: unknown) => ({
    components: { MtModal, MtModalRoot, MtModalTrigger, MtButton, MtText, MtNumberField, MtIcon },
    setup() {
      return {
        args,
      };
    },
    template: `
<mt-modal-root :isOpen="args.isOpen" :closable="args.closable">
  <mt-modal v-bind='args'>
    <template #default>
      <mt-text>Modal content</mt-text>
    </template>

    <template #footer>
      <div style='width: 100%; display: flex; justify-content: flex-end; gap: 8px;'>
        <mt-button variant='primary' @click="args.isOpen = false">Continue</mt-button>
      </div>
    </template>
  </mt-modal>
</mt-modal-root>`,
  }),
};

export const Default = {};

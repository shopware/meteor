import MtModal from "./mt-modal.vue";
import MtModalRoot from "./sub-components/mt-modal-root.vue";
import MtButtonClose from "./sub-components/mt-modal-close.vue";
import MtModalTrigger from "./sub-components/mt-modal-trigger.vue";
import MtButton from "../../form/mt-button/mt-button.vue";

export default {
  title: "Components/mt-modal",
  component: MtModal,
  args: {
    title: "Modal Title",
    default: "Modal content",
    closable: true,
    hideHeader: false,
  },
  render: () => ({
    components: { MtModal, MtModalRoot, MtButtonClose, MtModalTrigger, MtButton },
    setup() {
      return { MtButton };
    },
    template: `
<mt-modal-root>
  <mt-modal title="Modal Title">
    <template #default>Modal content</template>

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

import type { Meta, StoryObj } from "@storybook/vue3";
import { computed, ref } from "vue";
import MtDrawerRoot from "./mt-drawer-root.vue";
import MtDrawerTrigger from "./mt-drawer-trigger.vue";
import MtDrawerContent from "./mt-drawer-content.vue";
import MtDrawerClose from "./mt-drawer-close.vue";
import MtButton from "../mt-button/mt-button.vue";
import MtText from "../mt-text/mt-text.vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";
import MtSelect from "../mt-select/mt-select.vue";
import MtModal from "../mt-modal/mt-modal.vue";
import MtModalRoot from "../mt-modal/sub-components/mt-modal-root.vue";

export type MtDrawerMeta = Meta<typeof MtDrawerContent>;
export type MtDrawerStory = StoryObj<MtDrawerMeta>;

const components = {
  MtDrawerRoot,
  MtDrawerTrigger,
  MtDrawerContent,
  MtDrawerClose,
  MtButton,
  MtText,
  MtTextField,
  MtSelect,
  MtModal,
  MtModalRoot,
};

const meta: MtDrawerMeta = {
  title: "Components/Drawer",
  component: MtDrawerContent,
  args: {
    title: "Order details",
    subtitle: "Order #10042",
    side: "end",
    variant: "default",
    size: "24rem",
  },
  argTypes: {
    side: {
      control: { type: "select" },
      options: ["start", "end", "top", "bottom"],
    },
    variant: {
      control: { type: "select" },
      options: ["default", "floating"],
    },
  },
  render: (args) => ({
    components,
    setup: () => ({ args, MtButton }),
    template: `
      <mt-drawer-root>
        <mt-drawer-trigger :as="MtButton" variant="secondary">Open drawer</mt-drawer-trigger>

        <mt-drawer-content v-bind="args">
          <mt-text size="xs">Details about the order, a form or any other content.</mt-text>

          <template #footer>
            <mt-drawer-close :as="MtButton" variant="secondary">Close</mt-drawer-close>
          </template>
        </mt-drawer-content>
      </mt-drawer-root>
    `,
  }),
};

export default meta;

export const Default: MtDrawerStory = {};

export const Floating: MtDrawerStory = {
  args: {
    variant: "floating",
  },
};

export const Guarded: MtDrawerStory = {
  name: "Confirm before discarding changes",
  render: (args) => ({
    components,
    setup() {
      const open = ref(false);
      const confirmOpen = ref(false);
      const customer = ref("");
      const shippingMethod = ref("standard");
      const isDirty = computed(() => customer.value !== "");

      function discard() {
        confirmOpen.value = false;
        open.value = false;
        customer.value = "";
      }

      return {
        args,
        MtButton,
        open,
        confirmOpen,
        customer,
        shippingMethod,
        isDirty,
        discard,
        shippingMethods: [
          { label: "Standard", value: "standard" },
          { label: "Express", value: "express" },
        ],
      };
    },
    template: `
      <mt-drawer-root v-model:open="open" :dismissible="!isDirty" @dismiss-prevented="confirmOpen = true">
        <mt-drawer-trigger :as="MtButton" variant="secondary">Edit order</mt-drawer-trigger>

        <mt-drawer-content v-bind="args">
          <div style="display: grid; gap: var(--scale-size-16);">
            <mt-text-field v-model="customer" label="Customer" />
            <mt-select v-model="shippingMethod" label="Shipping method" :options="shippingMethods" />
          </div>

          <template #footer>
            <mt-button variant="primary" @click="discard">Save</mt-button>
          </template>
        </mt-drawer-content>
      </mt-drawer-root>

      <mt-modal-root :is-open="confirmOpen" @change="confirmOpen = $event">
        <mt-modal title="Discard changes?" width="s">
          <mt-text size="xs">The changes to this order are not saved yet.</mt-text>

          <template #footer>
            <div style="display: flex; justify-content: flex-end; gap: var(--scale-size-8);">
              <mt-button variant="secondary" @click="confirmOpen = false">Keep editing</mt-button>
              <mt-button variant="critical" @click="discard">Discard changes</mt-button>
            </div>
          </template>
        </mt-modal>
      </mt-modal-root>
    `,
  }),
};

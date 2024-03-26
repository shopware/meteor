import SwToast from "./sw-toast.vue";
import SwButton from "@/components/form/sw-button/sw-button.vue";
import SwSelect from "@/components/form/sw-select/sw-select.vue";
import SwTextField from "@/components/form/sw-text-field/sw-text-field.vue";
import SwCheckbox from "@/components/form/sw-checkbox/sw-checkbox.vue";
import type { Toast } from "./sw-toast.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { createId } from "@/utils/uuid";

export type SwToastMeta = SlottedMeta<typeof SwToast, ''>

export default {
  title: "Components/Feedback Indicator/sw-toast",
  component: SwToast,
  render: (args) => ({
    components: { SwToast, SwButton, SwSelect, SwTextField, SwCheckbox },
    template: `
          <h2>Spawn some toasts 🍞</h2>

          <div style="width: 420px;">
            <sw-text-field label="ToastMessage" v-model="msg" />
            <div style="display: flex; gap: 12px;">
              <sw-checkbox label="Display toast icon?" v-model="displayIcon" />
              <sw-checkbox label="Toast manually dismissable?" v-model="dismissable" />
              <sw-checkbox label="Add action?" v-model="action" />
            </div>
          </div>

          <div style="width: 420px; display: flex; justify-content: space-around;">
            <sw-button @click="onAddToast('critical')" variant="critical">Add critical toast</sw-button>
            <sw-button @click="onAddToast('positive')" variant="primary">Add positive toast</sw-button>
            <sw-button @click="onAddToast('informal')" variant="secondary">Add informal toast</sw-button>
          </div>

          <SwToast
            :toasts="toasts"
            @remove-toast="removeToast"
          />
        `,
    setup: () => {
      return {
        args,
      };
    },
    data(): { toasts: Toast[], msg: string, displayIcon: boolean, dismissable: boolean, action: boolean } {
     return {
      toasts: [],
      msg: 'Max three words',
      displayIcon: false,
      dismissable: false,
      action: false,
     };
    },
    methods: {
      onAddToast(type: string) {
        this.toasts = [
          {
            id: createId(), // auto generated at the sdk

            // Provided by the user
            msg: this.msg,
            type,
            dismissable: this.dismissable,
            icon: this.displayIcon ? 'solid-exclamation-circle' : undefined,
            action: this.action ? { label: 'action', callback: () => console.log('action') } : undefined,
          },
          ...this.toasts,
        ];
      },
      removeToast(id: number) {
        this.toasts = this.toasts.filter((toast: Toast) => toast.id !== id);
      }
    }
  }),
} as SwToastMeta;

export type SwToastStory = StoryObj<SwToastMeta>;

export const Default: SwToastStory = {
  name: "sw-toast",
};

import MtToast from "./mt-toast.vue";
import MtButton from "@/components/form/mt-button/mt-button.vue";
import MtSelect from "@/components/form/mt-select/mt-select.vue";
import MtTextField from "@/components/form/mt-text-field/mt-text-field.vue";
import MtCheckbox from "@/components/form/mt-checkbox/mt-checkbox.vue";
import type { Toast } from "./mt-toast.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { createId } from "@/utils/id";

export type MtToastMeta = SlottedMeta<typeof MtToast, "">;

export default {
  title: "Components/Feedback Indicator/mt-toast",
  component: MtToast,
  render: (args) => ({
    components: { MtToast, MtButton, MtSelect, MtTextField, MtCheckbox },
    template: `
          <h2>Spawn some toasts 🍞</h2>

          <div style="width: 420px;">
            <mt-text-field label="ToastMessage" v-model="msg" />
            <div style="display: flex; gap: 12px;">
              <mt-checkbox label="Display toast icon?" v-model:checked="displayIcon" />
              <mt-checkbox label="Toast manually dismissible?" v-model:checked="dismissible" />
              <mt-checkbox label="Add action?" v-model:checked="action" />
            </div>
          </div>

          <div style="width: 420px; display: flex; justify-content: space-around;">
            <mt-button @click="onAddToast('critical')" variant="critical">Add critical toast</mt-button>
            <mt-button @click="onAddToast('positive')" variant="primary">Add positive toast</mt-button>
            <mt-button @click="onAddToast('informal')" variant="secondary">Add informal toast</mt-button>
          </div>

          <MtToast
            :toasts="toasts"
            @remove-toast="removeToast"
          />
        `,
    setup: () => {
      return {
        args,
      };
    },
    data(): {
      toasts: Toast[];
      msg: string;
      displayIcon: boolean;
      dismissible: boolean;
      action: boolean;
    } {
      return {
        toasts: [],
        msg: "Max three words",
        displayIcon: false,
        dismissible: false,
        action: false,
      };
    },
    methods: {
      onAddToast(type: string) {
        let icon = "regular-bug";
        if (type === "positive") {
          icon = "regular-checkmark";
        }

        if (type === "informal") {
          icon = "regular-lightbulb";
        }

        this.toasts = [
          {
            id: createId(), // auto generated at the sdk

            // Provided by the user
            msg: this.msg,
            type,
            dismissible: this.dismissible,
            icon: this.displayIcon ? icon : undefined,
            action: this.action
              ? { label: "action", callback: () => console.log("action") }
              : undefined,
          },
          ...this.toasts,
        ];
      },
      removeToast(id: number) {
        this.toasts = this.toasts.filter((toast: Toast) => toast.id !== id);
      },
    },
  }),
} as MtToastMeta;

export type MtToastStory = StoryObj<MtToastMeta>;

export const Default: MtToastStory = {
  name: "mt-toast",
};

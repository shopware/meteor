import SwToast from "./sw-toast.vue";
import SwButton from "@/components/form/sw-button/sw-button.vue";
import SwSelect from "@/components/form/sw-select/sw-select.vue";
import SwTextField from "@/components/form/sw-text-field/sw-text-field.vue";
import SwCheckbox from "@/components/form/sw-checkbox/sw-checkbox.vue";
import type { Toast } from "./sw-toast.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwToastMeta = SlottedMeta<typeof SwToast, ''>

export default {
  title: "Components/Feedback Indicator/sw-toast",
  component: SwToast,
  render: (args) => ({
    components: { SwToast, SwButton, SwSelect, SwTextField, SwCheckbox },
    template: `
          <h2>Spawn some toasts 🍞</h2>

          <div style="width: 400px;">
            <sw-select label="Toast position" :options="positions" v-model="position" />
            <sw-text-field label="ToastMessage" v-model="msg" />
            <sw-checkbox label="Display toast icon?" v-model="displayIcon" />
          </div>

          <div style="width: 400px; display: flex; justify-content: space-around;">
            <sw-button @click="onAddToast('critical')" variant="critical">Add error toast</sw-button>
            <sw-button @click="onAddToast('positive')" variant="primary">Add success toast</sw-button>
            <sw-button @click="onAddToast('default')" variant="secondary">Add info toast</sw-button>
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
    data(): { toasts: Toast[], position: string, positions: { label: string, value: string }[], msg: string, displayIcon: boolean } {
     return {
      toasts: [],
      position: 'center',
      positions: [
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Right',
          value: 'right',
        }
      ],
      msg: 'Max three words',
      displayIcon: false,
     };
    },
    methods: {
      onAddToast(type: string) {
        let msg = '';
        for (let i = 0; i < 12; i++) {
          msg = msg + this.toasts.length;
        }
      
        this.toasts = [
          {
            id: this.toasts.length + 1,
            msg: this.msg,
            type,
            autoClose: type !== 'error',
            pos: this.position,
            icon: this.displayIcon ? 'solid-exclamation-circle' : undefined
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

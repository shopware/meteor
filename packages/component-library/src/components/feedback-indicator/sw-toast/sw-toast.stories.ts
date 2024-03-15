import SwToast from "./sw-toast.vue";
import SwButton from "../../form/sw-button/sw-button.vue";
import SwToastContainer from "@/components/_internal/sw-toast-container.vue";
import SwSelect from "@/components/form/sw-select/sw-select.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import type { Toast } from "./sw-toast.vue";
import { createId } from "@/utils/uuid";

export type SwToastMeta = SlottedMeta<typeof SwToast, "default">;

export default {
  title: "Components/Feedback Indicator/sw-toast",
  component: SwToast,
  render: (args) => ({
    components: { SwToast, SwButton, SwToastContainer, SwSelect },
    template: `
          <div style="width: 100vw; height: 100vh; margin: -1rem; border: 1px solid #f00;">
            <div class="controls" style="display: flex; align-items: flex-start; justify-content: space-evenly; margin: 24px; flex-direction: column;">
              <div style="width: 300pxpx;">
                <sw-select :options="toastVariantOptions" v-model="toastVariant" label="Toast variant" />
              </div>
              <div style="margin-top: -16px; display: flex; gap: 24px;">
                <sw-button @click="onSpawnToast('center')">Spwan center toast</sw-button>
                <sw-button @click="onSpawnToast('right')">Spwan right toast</sw-button>
              </div>
            </div>
          </div>

          <div class="toasts">
            <SwToastContainer :toasts="toasts" @remove-toast="onRemoveToast"/>
          </div>
        `,
    setup: () => {
      return {
        args,
      };
    },
    data(): { toasts: Toast[], toastVariant: string, toastVariantOptions: Array<{ label: string, value: string}> } {
      return {
        toasts: [],
        toastVariant: 'error',
        toastVariantOptions: [
          {
            label: 'Success',
            value: 'success',
          },
          {
            label: 'Error',
            value: 'error',
          },
          {
            label: 'Info',
            value: 'info',
          },
        ]
      }
    },
    methods: {
      onSpawnToast(pos: string) {
        let autoClose = true;
        if (this.toastVariant === 'error') {
          autoClose = false;
        }

        // oldest in front
        /*this.toasts.push({
          id: createId(),
          msg: "Three important words",
          pos,
          type: this.toastVariant,
          autoClose
        })*/

        // newest in front
        this.toasts = [
          {
            id: createId(),
            msg: "Three important words" + this.toasts.length,
            pos,
            type: this.toastVariant,
            autoClose
          },
          ...this.toasts
        ]
      },
      onRemoveToast(id: string) {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }
    }
  }),
} as SwToastMeta;

export type SwToastStory = StoryObj<SwToastMeta>;

export const Default: SwToastStory = {
  name: "sw-toast",
};

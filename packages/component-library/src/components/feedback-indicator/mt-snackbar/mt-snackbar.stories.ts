import type { Meta, StoryObj } from "@storybook/vue3";
import MtSnackbar from "./mt-snackbar.vue";
import MtButton from "@/components/form/mt-button/mt-button.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import MtCheckbox from "@/components/form/mt-checkbox/mt-checkbox.vue";
import MtTextField from "@/components/form/mt-text-field/mt-text-field.vue";
import { useSnackbar, type Snackbar } from "./composables/use-snackbar";
import { computed, ref } from "vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtSnackbarMeta = SlottedMeta<typeof MtSnackbar, "">;

const meta: Meta<typeof MtSnackbar> = {
  title: "Components/mt-snackbar",
  component: MtSnackbar,
};

export default meta;
export type MtSnackbarStory = StoryObj<MtSnackbarMeta>;

export const Default: MtSnackbarStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<script setup lang="ts">
import { MtSnackbar, useSnackbar } from "@shopware-ag/meteor-component-library";

const { addSnackbar } = useSnackbar();

function showSnackbar() {
  addSnackbar({
    message: "Changes saved",
  });
}
</script>

<template>
  <button type="button" @click="showSnackbar">Show snackbar</button>
  <mt-snackbar />
</template>`,
      },
    },
  },
  render: () => ({
    components: { MtSnackbar, MtButton, MtCheckbox, MtTextField, MtIcon },
    setup() {
      const { addSnackbar, clearSnackbars } = useSnackbar();
      const msg = ref("This is a snackbar");
      const action = ref(false);

      const linkValue = computed(() => {
        return action.value
          ? {
              text: "Action",
              url: "/",
            }
          : undefined;
      });

      const addDefaultSnackbar = () => {
        addSnackbar({
          message: msg.value,
          link: linkValue.value,
        });
      };

      const addSuccessSnackbar = () => {
        addSnackbar({
          message: msg.value,
          variant: "success",
          link: linkValue.value,
        });
      };

      const addErrorSnackbar = () => {
        addSnackbar({
          message: msg.value,
          variant: "error",
          link: linkValue.value,
        });
      };

      const addProgressSnackbar = () => {
        const newProgressSnackbar = addSnackbar({
          message: msg.value,
          variant: "progress",
          link: linkValue.value,
          progressPercentage: 0,
          successMessage: "File uploaded successfully",
          errorMessage: "Upload failed. Please try again",
        });

        simulateProgress(newProgressSnackbar);
      };

      // function to simulate progress
      const simulateProgress = (snackbar: Snackbar) => {
        let currentProgress = 0;

        const interval = setInterval(() => {
          currentProgress += Math.random() * 15;

          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            snackbar.uploadState = "success";
            snackbar.progressPercentage = 100;
          }

          if (snackbar) {
            snackbar.progressPercentage = Math.round(currentProgress);
          }
        }, 200);
      };

      return {
        addDefaultSnackbar,
        addSuccessSnackbar,
        addErrorSnackbar,
        addProgressSnackbar,
        clearSnackbars,
        msg,
        action,
      };
    },
    template: `
        <h3>Spawn Snackbars</h3>


        <div style="max-width: var(--scale-size-256); margin-bottom: var(--scale-size-22);">
          <mt-text-field label="Message" v-model="msg" size="small"/>
        </div>

        <mt-checkbox label="Add action" v-model:checked="action" />

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <mt-button @click="addDefaultSnackbar" variant="secondary" size="small">
          Default
          </mt-button>
          
          <mt-button @click="addSuccessSnackbar" variant="secondary" size="small">
            <template #iconFront>
              <mt-icon name="check-circle" size="14px" mode="solid"/>
            </template>
              Success
          </mt-button>
          
          <mt-button @click="addErrorSnackbar" variant="secondary" size="small">
            <template #iconFront>
              <mt-icon name="exclamation-circle" size="14px" mode="solid"/>
            </template>
              Error
          </mt-button>
          
          <mt-button @click="addProgressSnackbar" variant="secondary" size="small">
            <template #iconFront>
              <mt-icon name="spinner-star" size="14px" mode="solid"/>
            </template>
              Progress
          </mt-button>

          <mt-button @click="clearSnackbars" variant="critical" size="small">
            <template #iconFront>
              <mt-icon name="trash" size="14px" mode="solid"/>
            </template>
              Clear all
          </mt-button>
        </div>

        <MtSnackbar />
    `,
  }),
};

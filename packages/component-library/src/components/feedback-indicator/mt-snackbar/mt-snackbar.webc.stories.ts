import type { StoryObj } from "@storybook/vue3";
import MtSnackbarWebComponent from "./mt-snackbar.webc";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MtButton from "@/components/form/mt-button/mt-button.webc";
import { ref } from "vue";

const meta = {
  title: "Components/Feedback Indicator/mt-snackbar (Web Component)",
  component: MtSnackbarWebComponent,
  render: (args: any) => ({
    setup() {
      const snackbarElement = ref<MtSnackbarWebComponent | null>(null);

      const addDefaultSnackbar = () => {
        if (snackbarElement.value) {
          snackbarElement.value.addSnackbar("This is a default snackbar");
        }
      };

      const addSuccessSnackbar = () => {
        if (snackbarElement.value) {
          snackbarElement.value.addSnackbar("This is a success snackbar", "success");
        }
      };

      const addErrorSnackbar = () => {
        if (snackbarElement.value) {
          snackbarElement.value.addSnackbar("This is an error snackbar", "error");
        }
      };

      const addProgressSnackbar = () => {
        if (snackbarElement.value) {
          snackbarElement.value.addSnackbar("This is a progress snackbar", "progress");
        }
      };

      const clearSnackbars = () => {
        if (snackbarElement.value) {
          snackbarElement.value.clearSnackbars();
        }
      };

      return {
        args,
        snackbarElement,
        addDefaultSnackbar,
        addSuccessSnackbar,
        addErrorSnackbar,
        addProgressSnackbar,
        clearSnackbars,
      };
    },
    template: `
      <div>
        <h2 style="font-size: 1.5em; color: var(--color-text-primary-default); font-weight: var(--font-weight-semibold); margin-block-end: var(--scale-size-20);">Spawn some snackbars</h2>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
          <mt-button variant="secondary" @click="addDefaultSnackbar">
            Default Snackbar
          </mt-button>
          <mt-button variant="primary" @click="addSuccessSnackbar">
            Success Snackbar
          </mt-button>
          <mt-button variant="critical" @click="addErrorSnackbar">
            Error Snackbar
          </mt-button>
          <mt-button variant="secondary" @click="addProgressSnackbar">
            Progress Snackbar
          </mt-button>
        </div>
        <mt-button @click="clearSnackbars">
          Clear all
        </mt-button>
        <mt-snackbar ref="snackbarElement"></mt-snackbar>
      </div>
    `,
  }),
};

export default meta;
export type MtSnackbarWebComponentStory = StoryObj<typeof meta>;

export const Default: MtSnackbarWebComponentStory = {
  name: "mt-snackbar (Web Component)",
};

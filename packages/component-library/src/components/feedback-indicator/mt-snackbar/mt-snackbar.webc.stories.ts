import type { StoryObj } from "@storybook/vue3";
import MtSnackbarWebComponent from "./mt-snackbar.webc";
import { ref, onMounted } from "vue";

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

      const clearSnackbars = () => {
        if (snackbarElement.value) {
          snackbarElement.value.clearSnackbars();
        }
      };

      onMounted(() => {
        // Add a default snackbar on mount to demonstrate
        setTimeout(() => {
          if (snackbarElement.value) {
            snackbarElement.value.addSnackbar("Welcome! Click the buttons to add more snackbars.");
          }
        }, 500);
      });

      return {
        args,
        snackbarElement,
        addDefaultSnackbar,
        addSuccessSnackbar,
        addErrorSnackbar,
        clearSnackbars,
      };
    },
    template: `
      <div>
        <h2>Spawn some snackbars</h2>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
          <button @click="addDefaultSnackbar" style="padding: 8px 16px; background: #e0e0e0; border: none; border-radius: 4px; cursor: pointer;">
            Default Snackbar
          </button>
          <button @click="addSuccessSnackbar" style="padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Success Snackbar
          </button>
          <button @click="addErrorSnackbar" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Error Snackbar
          </button>
        </div>
        <button @click="clearSnackbars" style="padding: 8px 16px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Clear all
        </button>
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

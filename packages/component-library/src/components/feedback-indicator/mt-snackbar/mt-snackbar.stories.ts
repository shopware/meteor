import type { Meta, StoryObj } from "@storybook/vue3";
import MtSnackbar from "./mt-snackbar.vue";
import MtButton from "@/components/form/mt-button/mt-button.vue";
import { useSnackbar } from "./composables/use-snackbar";

const meta: Meta<typeof MtSnackbar> = {
  title: "Components/Feedback Indicator/mt-snackbar",
  component: MtSnackbar,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { MtSnackbar, MtButton },
    setup() {
      const { addSnackbar } = useSnackbar();

      const addDefaultSnackbar = () => {
        addSnackbar({
          message: "This is a default snackbar.",
        });
      };

      const addSuccessSnackbar = () => {
        addSnackbar({
          message: "Success! Your action was completed successfully.",
          type: "success",
          icon: "solid-check-circle",
        });
      };

      const addErrorSnackbar = () => {
        addSnackbar({
          message: "Error! Something went wrong. Please try again.",
          type: "error",
          icon: "solid-exclamation-triangle",
        });
      };

      return {
        addDefaultSnackbar,
        addSuccessSnackbar,
        addErrorSnackbar,
      };
    },
    template: `
        <h2>Spawn some toasts 🍞</h2>
        <div style="display: flex; gap: 10px;">
          <mt-button @click="addDefaultSnackbar" variant="secondary">
            Default Snackbar
          </mt-button>
          <mt-button @click="addSuccessSnackbar" variant="primary">
            Success Snackbar
          </mt-button>
          <mt-button @click="addErrorSnackbar" variant="critical">
            Error Snackbar
          </mt-button>
        </div>
        <MtSnackbar />
    `,
  }),
};

import type { Meta, StoryObj } from "@storybook/vue3";
import MtSnackbar from "./mt-snackbar.vue";
import { useSnackbar } from "./composables/use-snackbar";

const meta: Meta<typeof MtSnackbar> = {
  title: "Components/Feedback Indicator/mt-snackbar",
  component: MtSnackbar,
  parameters: {
    docs: {
      description: {
        component:
          "A snackbar component for displaying notifications at the bottom right of the screen.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { MtSnackbar },
    setup() {
      const { addSnackbar } = useSnackbar();

      const addDefaultSnackbar = () => {
        addSnackbar({
          message: "This is a default snackbar notification.",
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
      <div>
        <div style="padding: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
          <button @click="addDefaultSnackbar" style="padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Default Snackbar
          </button>
          <button @click="addSuccessSnackbar" style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Success Snackbar
          </button>
          <button @click="addErrorSnackbar" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Error Snackbar
          </button>
        </div>
        <MtSnackbar />
      </div>
    `,
  }),
};

import type { StoryObj } from "@storybook/vue3";
import MtSnackbarWebComponent from "./mt-snackbar.webc";

const meta = {
  title: "Components/Feedback Indicator/mt-snackbar (Web Component)",
  component: MtSnackbarWebComponent,
  render: (args: any) => ({
    setup() {
      return {
        args,
      };
    },
    template: "<mt-snackbar></mt-snackbar>",
  }),
};

export default meta;
export type MtSnackbarWebComponentStory = StoryObj<typeof meta>;

export const Default: MtSnackbarWebComponentStory = {
  name: "mt-snackbar (Web Component)",
};

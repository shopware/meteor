import type { Meta, StoryObj } from "@storybook/vue3";
import MtSnackbar from "./mt-snackbar.vue";
import MtButton from "@/components/form/mt-button/mt-button.vue";
import MtCheckbox from "@/components/form/mt-checkbox/mt-checkbox.vue";
import MtTextField from "@/components/form/mt-text-field/mt-text-field.vue";
import { useSnackbar, type Snackbar } from "./composables/use-snackbar";
import { computed, ref } from "vue";

const meta: Meta<typeof MtSnackbar> = {
  title: "Components/Feedback Indicator/mt-snackbar",
  component: MtSnackbar,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { MtSnackbar, MtButton, MtCheckbox, MtTextField },
    setup() {
      const { addSnackbar } = useSnackbar();
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
          type: "success",
          link: linkValue.value,
        });
      };

      const addErrorSnackbar = () => {
        addSnackbar({
          message: msg.value,
          type: "error",
          link: linkValue.value,
        });
      };

      const addUploadSnackbar = () => {
        const newUploadSnackbar = addSnackbar({
          message: msg.value,
          type: "upload",
          link: linkValue.value,
          progressPercentage: 0,
          successMessage: "File uploaded successfully",
          errorMessage: "Upload failed. Please try again",
        });

        simulateUploadProgress(newUploadSnackbar);
      };

      // function to simulate upload progress
      const simulateUploadProgress = (snackbar: Snackbar) => {
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
        addUploadSnackbar,
        msg,
        action,
      };
    },
    template: `
        <h2>Spawn some snackbars 🍞</h2>
        <div style="width: 420px;">
          <mt-text-field label="ToastMessage" v-model="msg" />
          <div style="display: flex; gap: 12px;">
            <mt-checkbox label="Add action" v-model:checked="action" />
          </div>

        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <mt-button @click="addDefaultSnackbar" variant="secondary">
          Default Snackbar
          </mt-button>
          <mt-button @click="addSuccessSnackbar" variant="primary">
          Success Snackbar
          </mt-button>
          <mt-button @click="addErrorSnackbar" variant="critical">
          Error Snackbar
          </mt-button>
          <mt-button @click="addUploadSnackbar" variant="secondary">
          Upload Snackbar
          </mt-button>
        </div>
        <MtSnackbar />
    `,
  }),
};

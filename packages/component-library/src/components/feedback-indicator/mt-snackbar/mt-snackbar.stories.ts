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
  title: "Components/Feedback Indicator/mt-snackbar",
  component: MtSnackbar,
};

export default meta;
export type MtSnackbarStory = StoryObj<MtSnackbarMeta>;

export const Default: MtSnackbarStory = {
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
        <h2>Spawn some snackbars</h2>
        <div style="width: 420px;">
          <mt-text-field label="ToastMessage" v-model="msg" />
        </div>

        <div style="display: flex; flex-direction: row; gap: 12px; align-items: center;">
          <mt-checkbox label="Add action" v-model:checked="action" />
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
          <mt-button @click="addDefaultSnackbar" variant="secondary">
          Default Snackbar
          </mt-button>
          <mt-button @click="addSuccessSnackbar" variant="primary">
          Success Snackbar
          </mt-button>
          <mt-button @click="addErrorSnackbar" variant="critical">
          Error Snackbar
          </mt-button>
          <mt-button @click="addProgressSnackbar" variant="secondary">
          Progress Snackbar
          </mt-button>
        </div>
        
        <mt-button @click="clearSnackbars">
          <template #iconFront>
            <mt-icon name="regular-trash" size="14px"/>
          </template>
            Clear all
        </mt-button>
        <MtSnackbar />
    `,
  }),
};

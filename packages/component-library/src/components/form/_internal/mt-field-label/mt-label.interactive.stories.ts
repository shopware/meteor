import MtFieldLabelDefaultStory, {
  type MtFieldLabelMeta,
  type MtFieldLabelStory,
} from "./mt-label.stories";

export default {
  ...MtFieldLabelDefaultStory,
  title: "Interaction Tests/Form/mt-field-label",
} satisfies MtFieldLabelMeta;

export const Default: MtFieldLabelStory = {};

export const Required: MtFieldLabelStory = {
  args: {
    required: true,
  },
};

import meta, { type MtStackMeta, type MtStackStory } from "./mt-stack.stories";
import { SwitchList, CheckboxList, JustifyEnd, Horizontal } from "./mt-stack.stories";

export default {
  ...meta,
  title: "Components/Stack/Interaction tests",
  tags: ["!autodocs"],
} as MtStackMeta;

export const VisualTestDefault: MtStackStory = {
  name: "Render vertical stack of fields",
};

export const VisualTestSwitchList: MtStackStory = {
  ...SwitchList,
  name: "Render stack of switches",
};

export const VisualTestCheckboxList: MtStackStory = {
  ...CheckboxList,
  name: "Render stack of checkboxes",
};

export const VisualTestHorizontal: MtStackStory = {
  ...Horizontal,
  name: "Render horizontal stack",
};

export const VisualTestJustifyEnd: MtStackStory = {
  ...JustifyEnd,
  name: "Render horizontal stack with right-aligned actions",
};

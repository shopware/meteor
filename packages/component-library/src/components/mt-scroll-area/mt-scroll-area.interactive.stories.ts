import meta, {
  Horizontal,
  type MtScrollAreaMeta,
  type MtScrollAreaStory,
} from "./mt-scroll-area.stories";

export default {
  ...meta,
  title: "Components/Scroll Area/Interaction tests",
  tags: ["!autodocs"],
} as MtScrollAreaMeta;

export const VisualTestVertical: MtScrollAreaStory = {
  name: "Render a vertical scroll area",
};

export const VisualTestHorizontal: MtScrollAreaStory = {
  ...Horizontal,
  name: "Render a horizontal scroll area",
  args: {
    orientation: "horizontal",
  },
};

export const VisualTestWithoutFade: MtScrollAreaStory = {
  name: "Render without fade",
  args: {
    fade: false,
  },
};

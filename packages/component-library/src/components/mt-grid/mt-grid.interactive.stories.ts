import meta, { type MtGridMeta, type MtGridStory } from "./mt-grid.stories";
import {
  ThreeColumns,
  FullWidthItem,
  CustomTemplate,
  CustomGap,
  StartAligned,
} from "./mt-grid.stories";

export default {
  ...meta,
  title: "Components/Grid/Interaction tests",
  tags: ["!autodocs"],
} as MtGridMeta;

export const VisualTestDefault: MtGridStory = {
  name: "Render two-column grid",
};

export const VisualTestThreeColumns: MtGridStory = {
  ...ThreeColumns,
  name: "Render three-column grid",
};

export const VisualTestFullWidthItem: MtGridStory = {
  ...FullWidthItem,
  name: "Render grid with full-width items",
};

export const VisualTestCustomTemplate: MtGridStory = {
  ...CustomTemplate,
  name: "Render grid with custom column template",
};

export const VisualTestCustomGap: MtGridStory = {
  ...CustomGap,
  name: "Render grid with custom gap",
};

export const VisualTestStartAligned: MtGridStory = {
  ...StartAligned,
  name: "Render grid with start-aligned items",
};

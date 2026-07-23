import { within } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtDividerMeta, type MtDividerStory } from "./mt-divider.stories";
import MtDivider from "./mt-divider.vue";
import MtText from "../mt-text/mt-text.vue";
import MtCard from "../mt-card/mt-card.vue";
import MtButton from "../mt-button/mt-button.vue";

export default {
  ...meta,
  title: "Components/Divider/Interaction tests",
  tags: ["!autodocs"],
} as MtDividerMeta;

export const VisualTestDefault: MtDividerStory = {
  name: "Render horizontal solid divider",
};

export const VisualTestDashed: MtDividerStory = {
  name: "Render dashed divider",
  args: {
    variant: "dashed",
  },
};

export const VisualTestBrandColor: MtDividerStory = {
  name: "Render divider with brand color",
  args: {
    color: "color-border-brand-default",
  },
};

export const VisualTestWithContent: MtDividerStory = {
  name: "Render divider with centered content",
  render: () => ({
    components: { MtDivider, MtText },
    template: `
<mt-divider>
  <mt-text size="xs" color="color-text-secondary-default">or</mt-text>
</mt-divider>`,
  }),
};

export const VisualTestVertical: MtDividerStory = {
  name: "Render vertical divider",
  render: () => ({
    components: { MtDivider },
    template: `
<div style="display: flex; height: 48px; gap: var(--scale-size-16); align-items: center;">
  <span>Left</span>
  <mt-divider orientation="vertical" />
  <span>Right</span>
</div>`,
  }),
};

export const VisualTestFullBleed: MtDividerStory = {
  name: "Render full-bleed divider in a card",
  render: () => ({
    components: { MtDivider, MtCard, MtText },
    template: `
<mt-card title="Full bleed">
  <div style="display: grid; gap: var(--scale-size-24)">
    <mt-text>The divider below stretches across the card padding.</mt-text>
    <mt-divider full-bleed />
    <mt-text>The divider above ignores the card padding.</mt-text>
  </div>
</mt-card>`,
  }),
};

export const VisualTestFullBleedVertical: MtDividerStory = {
  name: "Render vertical full-bleed divider in a card",
  render: () => ({
    components: { MtDivider, MtCard, MtText },
    template: `
<mt-card title="Full bleed">
  <div style="display: flex; gap: var(--scale-size-24)">
    <mt-text style="flex: 1">The divider next to this text stretches through the block padding of the card.</mt-text>
    <mt-divider orientation="vertical" full-bleed />
    <mt-text style="flex: 1">Right column</mt-text>
  </div>
</mt-card>`,
  }),
};

export const TestExposesSeparatorSemantics: MtDividerStory = {
  name: "Exposes separator semantics",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
  },
};

export const TestIsHiddenWhenDecorative: MtDividerStory = {
  name: "Is hidden from assistive technology when decorative",
  args: {
    decorative: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("separator")).toBeNull();
  },
};

export const TestKeepsSlotContentAccessible: MtDividerStory = {
  name: "Keeps slot content accessible",
  render: () => ({
    components: { MtDivider, MtButton },
    template: `
<mt-divider>
  <mt-button variant="secondary" size="small">Show older entries</mt-button>
</mt-divider>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("separator")).toBeNull();
    expect(canvas.getByRole("button", { name: "Show older entries" })).toBeVisible();
  },
};

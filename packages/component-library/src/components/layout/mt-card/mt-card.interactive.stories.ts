import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";
import MtCard from "./mt-card.vue";
import MtInset from "../mt-inset/mt-inset.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";

import { MinimalStory, ExtendedStory, type MtCardMeta, type MtCardStory } from "./mt-card.stories";

export default {
  title: "Interaction Tests/Layout/mt-card",
} as MtCardMeta;

export const VisualTestMinimalPage: MtCardStory = {
  ...MinimalStory,
  name: "Render a minimal card",
  args: {
    ...MinimalStory.args,
  },
};

export const VisualTestMinimalPageWithLinkedInheritance: MtCardStory = {
  ...MinimalStory,
  name: "Render an extended card with linked inheritance",
  args: {
    ...MinimalStory.args,
    inheritance: true,
  },
  async play({ canvasElement, args }) {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Disable inheritance" }));

    expect(args.updateInheritance).toHaveBeenNthCalledWith(1, false);
  },
};

export const VisualTestMinimalPageWithUnlinkedInheritance: MtCardStory = {
  ...MinimalStory,
  name: "Render an extended card with unlinked inheritance",
  args: {
    ...MinimalStory.args,
    inheritance: false,
  },
  async play({ canvasElement, args }) {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Enable inheritance" }));

    expect(args.updateInheritance).toHaveBeenNthCalledWith(1, true);
  },
};

export const VisualTestExtendedPage: MtCardStory = {
  ...ExtendedStory,
  name: "Render an extended card",
  args: {
    ...ExtendedStory.args,
  },
};

export const VisualTestExtendedPageWithoutToolbar: MtCardStory = {
  ...ExtendedStory,
  name: "Render an extended card without toolbar",
  args: {
    ...ExtendedStory.args,
    toolbar: null,
  },
};

export const VisualTestExtendedPageWithoutHeaderRight: MtCardStory = {
  ...ExtendedStory,
  name: "Render an extended card without headerRight",
  args: {
    ...ExtendedStory.args,
    headerRight: null,
  },
};

export const VisualTestExtendedPageWithoutTabs: MtCardStory = {
  ...ExtendedStory,
  name: "Render an extended card without Tabs",
  args: {
    ...ExtendedStory.args,
    tabs: null,
  },
};

export const VisualTestExtendedPageWithoutAvatar: MtCardStory = {
  ...ExtendedStory,
  name: "Render an extended card without Avatar",
  args: {
    ...ExtendedStory.args,
    avatar: null,
  },
};

export const VisualTestExtendedPageWithoutFooter: MtCardStory = {
  ...ExtendedStory,
  name: "Render an extended card without Footer",
  args: {
    ...ExtendedStory.args,
    footer: null,
  },
};

export const VisualTestExtendedPageWithoutContextActions: MtCardStory = {
  ...ExtendedStory,
  name: "Render an extended card without Context Actions",
  args: {
    ...ExtendedStory.args,
    "context-actions": null,
  },
};

export const VisualTestExtendedPageWithOpenedContextActions: MtCardStory = {
  ...ExtendedStory,
  name: "Render an extended card with opened Context Actions",
  args: {
    ...ExtendedStory.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByLabelText("Context menu");

    await userEvent.click(button);

    // Look inside the popover
    const popover = within(
      document.getElementsByClassName("mt-popover__content")[0] as HTMLElement,
    );

    const menuItem = popover.getAllByRole("menuitem");

    await expect(menuItem[0]).toHaveTextContent("Menu Item A");

    await expect(menuItem[1]).toHaveTextContent("Menu Item B");

    await expect(menuItem[2]).toHaveTextContent("Menu Item C");
  },
};

export const VisualTestMinimalPageWithCustomFooter: MtCardStory = {
  ...MinimalStory,
  name: "Render a minimal card with custom footer",
  args: {
    ...MinimalStory.args,
    footer: "<p>Custom footer</p>",
  },
  render: (args) => ({
    components: { MtCard, MtText, MtInset },
    setup() {
      return { args };
    },
    template: `
    <mt-card v-bind="args">
      <div v-html="args.default"></div>
      <template #footer>
        <mt-inset style="background: var(--color-elevation-surface-sunken); padding: var(--mt-card-footer-padding)">
          <mt-text as="h3" size="m" weight="bold">Headline</mt-text>

          <mt-text>
            vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan.
            is at vero eros et accumsan et iusto odio dignissim qui blandit praesent
            luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
          </mt-text>
        </mt-inset>
      </template>
    </mt-card>`,
  }),
};

import { expect, userEvent, within } from "@storybook/test";

import meta, {
  Closable,
  LongText,
  Strong,
  StrongVariants,
  Variants,
  WithLink,
  WithoutIcon,
  type MtAnnouncementMeta,
  type MtAnnouncementStory,
} from "./mt-announcement.stories";

export default {
  ...meta,
  title: "Components/Announcement/Interaction tests",
  tags: ["!autodocs"],
} as MtAnnouncementMeta;

export const VisualTestDefault: MtAnnouncementStory = {
  name: "Render the message with its icon",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(/Planned maintenance/)).toBeVisible();
    expect(canvas.getByTestId("mt-icon__solid-tools")).toBeVisible();
  },
};

export const VisualTestStrong: MtAnnouncementStory = {
  ...Strong,
  name: "Render the strong appearance",
};

export const VisualTestVariants: MtAnnouncementStory = {
  ...Variants,
  name: "Render every variant in the subtle appearance",
};

export const VisualTestStrongVariants: MtAnnouncementStory = {
  ...StrongVariants,
  name: "Render every variant in the strong appearance",
};

export const VisualTestWithoutIcon: MtAnnouncementStory = {
  ...WithoutIcon,
  name: "Render the message without an icon",
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector(".mt-announcement__icon")).not.toBeInTheDocument();
  },
};

export const VisualTestLongText: MtAnnouncementStory = {
  ...LongText,
  name: "Wrap a long message onto more lines",
  play: async ({ canvasElement }) => {
    const message = canvasElement.querySelector<HTMLElement>(".mt-announcement__message");
    if (!message) throw new Error("Message not found");

    const lineHeight = parseFloat(getComputedStyle(message).lineHeight);
    expect(message.offsetHeight).toBeGreaterThan(lineHeight);
  },
};

export const VisualTestClose: MtAnnouncementStory = {
  ...Closable,
  name: "Emit close when the close button is clicked",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(args.close).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole("button", { name: "Close announcement" }));

    expect(args.close).toHaveBeenCalledOnce();
  },
};

export const VisualTestCloseWithKeyboard: MtAnnouncementStory = {
  ...Closable,
  name: "Focus the close button and close with Enter",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    expect(canvas.getByRole("button", { name: "Close announcement" })).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(args.close).toHaveBeenCalledOnce();
  },
};

export const VisualTestFocusLink: MtAnnouncementStory = {
  ...WithLink,
  name: "Reach the link and then the close button with Tab",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    expect(canvas.getByRole("link", { name: "See what's new in reporting" })).toHaveFocus();

    await userEvent.tab();
    expect(canvas.getByRole("button", { name: "Close announcement" })).toHaveFocus();

    // Back to the link, so the snapshot shows its focus ring.
    await userEvent.tab({ shift: true });
  },
};

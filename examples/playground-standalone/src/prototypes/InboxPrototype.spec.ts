import { beforeAll, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { ref } from "vue";
import InboxPrototype from "./InboxPrototype.vue";
import type { Notification } from "../data/notifications";

// jsdom has no media queries.
beforeAll(() => {
  window.matchMedia ??= (query: string) =>
    ({ matches: false, media: query }) as MediaQueryList;
});

function setup() {
  const notifications = ref<Notification[]>([
    {
      id: "1",
      type: "failed",
      subject: "Sync orders",
      minutesAgo: 5,
      read: false,
    },
    {
      id: "2",
      type: "memberJoined",
      subject: "Felix Koch",
      minutesAgo: 60,
      read: false,
    },
    {
      id: "3",
      type: "integrationAdded",
      subject: "Relay Chat",
      minutesAgo: 120,
      read: true,
    },
  ]);

  render({
    components: { InboxPrototype },
    setup: () => ({ notifications }),
    template: `<InboxPrototype v-model="notifications" />`,
  });

  return { user: userEvent.setup(), notifications };
}

describe("InboxPrototype", () => {
  it("tells how many notifications are unread", () => {
    setup();

    expect(
      screen.getByRole("button", { name: "Notifications, 2 unread" }),
    ).toBeVisible();
  });

  it("lists the notifications with their subject", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /Notifications/ }));

    const inbox = screen.getByRole("dialog", { name: "Inbox" });
    expect(within(inbox).getAllByRole("listitem")).toHaveLength(3);
    expect(within(inbox).getByText("Sync orders")).toBeVisible();
  });

  it("marks all notifications as read", async () => {
    const { user, notifications } = setup();
    await user.click(screen.getByRole("button", { name: /Notifications/ }));

    await user.click(screen.getByRole("button", { name: "Mark all as read" }));

    expect(notifications.value.every((item) => item.read)).toBe(true);
    expect(
      screen.getByRole("button", { name: "Notifications, 0 unread" }),
    ).toBeVisible();
  });
});

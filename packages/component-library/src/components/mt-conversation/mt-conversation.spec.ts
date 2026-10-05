import { fireEvent, render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import MtConversation from "./mt-conversation.vue";

/** jsdom has no layout, so the scroll geometry of the log is faked; it starts at the end. */
async function fakeScrollGeometry(
  element: HTMLElement,
  { scrollHeight = 1000, clientHeight = 200 } = {},
) {
  let scrollTop = scrollHeight - clientHeight;
  Object.defineProperties(element, {
    scrollHeight: { configurable: true, get: () => scrollHeight },
    clientHeight: { configurable: true, get: () => clientHeight },
    scrollTop: {
      configurable: true,
      get: () => scrollTop,
      set: (value: number) =>
        (scrollTop = Math.max(0, Math.min(value, scrollHeight - clientHeight))),
    },
  });
  await fireEvent.scroll(element);

  return {
    scrollTo: async (value: number) => {
      scrollTop = value;
      await fireEvent.scroll(element);
    },
  };
}

const jumpButton = () => screen.queryByRole("button", { name: "Scroll to the latest message" });

describe("mt-conversation", () => {
  beforeEach(() => {
    // jsdom does not implement scrolling
    Element.prototype.scrollTo = function (this: Element, options?: ScrollToOptions | number) {
      if (typeof options === "object") this.scrollTop = options.top ?? this.scrollTop;
    } as Element["scrollTo"];
  });

  it("shows the messages in a named log", () => {
    render(MtConversation, { slots: { default: "<p>Hello</p>", empty: "No messages yet" } });

    expect(screen.getByRole("log", { name: "Conversation" })).toHaveTextContent("Hello");
    expect(screen.queryByText("No messages yet")).not.toBeInTheDocument();
  });

  it("shows the empty slot while there are no messages", () => {
    render(MtConversation, { slots: { empty: "No messages yet" } });

    expect(screen.getByRole("log")).toHaveTextContent("No messages yet");
  });

  it("shows the status in a live region after the messages", () => {
    render(MtConversation, {
      slots: { default: "<p>Hello</p>", status: "Generating response…" },
    });

    expect(screen.getByRole("log")).toContainElement(screen.getByRole("status"));
    expect(screen.getByRole("status")).toHaveTextContent("Generating response…");
  });

  it("keeps the status line while its slot renders nothing", () => {
    render({
      components: { MtConversation },
      template: `
        <mt-conversation>
          <p>Hello</p>
          <template #status><span v-if="false">Generating response…</span></template>
        </mt-conversation>
      `,
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("shows the footer below the log", () => {
    render(MtConversation, {
      slots: { footer: "<textarea aria-label='Prompt'></textarea>" },
    });

    expect(screen.getByRole("log")).not.toContainElement(screen.getByRole("textbox"));
  });

  it("stops following when scrolling up and follows again at the end", async () => {
    render(MtConversation, { slots: { default: "<p>Hello</p>" } });
    const geometry = await fakeScrollGeometry(screen.getByRole("log"));

    expect(jumpButton()).not.toBeInTheDocument();

    await geometry.scrollTo(300);
    expect(jumpButton()).toBeInTheDocument();

    await geometry.scrollTo(790);
    expect(jumpButton()).not.toBeInTheDocument();
  });

  it("stops following right away when the wheel scrolls up", async () => {
    render(MtConversation, { slots: { default: "<p>Hello</p>" } });
    const log = screen.getByRole("log");
    await fakeScrollGeometry(log);

    await fireEvent.wheel(log, { deltaY: -40 });

    expect(jumpButton()).toBeInTheDocument();
  });

  it.each([
    ["PageUp", false],
    ["ArrowUp", false],
    ["Home", false],
    [" ", true],
  ])("stops following right away when %j scrolls up with the keyboard", async (key, shiftKey) => {
    render(MtConversation, { slots: { default: "<p>Hello</p>" } });
    const log = screen.getByRole("log");
    await fakeScrollGeometry(log);

    await fireEvent.keyDown(log, { key, shiftKey });

    expect(jumpButton()).toBeInTheDocument();
  });

  it("keeps following on keys that do not scroll up", async () => {
    render(MtConversation, { slots: { default: "<p>Hello</p>" } });
    const log = screen.getByRole("log");
    await fakeScrollGeometry(log);

    await fireEvent.keyDown(log, { key: "PageDown" });
    await fireEvent.keyDown(log, { key: " " });

    expect(jumpButton()).not.toBeInTheDocument();
  });

  it("stops following right away when a finger scrolls up", async () => {
    render(MtConversation, { slots: { default: "<p>Hello</p>" } });
    const log = screen.getByRole("log");
    await fakeScrollGeometry(log);

    await fireEvent.touchStart(log, { touches: [{ clientY: 100 }] });
    await fireEvent.touchMove(log, { touches: [{ clientY: 140 }] });

    expect(jumpButton()).toBeInTheDocument();
  });

  it("stops following right away when the scrollbar is pressed", async () => {
    render(MtConversation, { slots: { default: "<p>Hello</p>" } });
    const log = screen.getByRole("log");
    await fakeScrollGeometry(log);

    await fireEvent.pointerDown(log);

    expect(jumpButton()).toBeInTheDocument();
  });

  it("keeps following when the content is pressed", async () => {
    render(MtConversation, { slots: { default: "<p>Hello</p>" } });
    await fakeScrollGeometry(screen.getByRole("log"));

    await fireEvent.pointerDown(screen.getByText("Hello"));

    expect(jumpButton()).not.toBeInTheDocument();
  });

  it("scrolls back to the latest message and moves the focus to the log", async () => {
    render(MtConversation, { slots: { default: "<p>Hello</p>" } });
    const log = screen.getByRole("log");
    const geometry = await fakeScrollGeometry(log);
    await geometry.scrollTo(300);

    await userEvent.click(jumpButton()!);

    expect(log.scrollTop).toBe(800);
    expect(log).toHaveFocus();
    expect(jumpButton()).not.toBeInTheDocument();
  });

  it("marks the edges with more content to scroll to", async () => {
    render(MtConversation, { slots: { default: "<p>Hello</p>" } });
    const log = screen.getByRole("log");
    const geometry = await fakeScrollGeometry(log);

    expect(log).toHaveAttribute("data-overflow-start");
    expect(log).not.toHaveAttribute("data-overflow-end");

    await geometry.scrollTo(300);
    expect(log).toHaveAttribute("data-overflow-start");
    expect(log).toHaveAttribute("data-overflow-end");

    await geometry.scrollTo(0);
    expect(log).not.toHaveAttribute("data-overflow-start");
    expect(log).toHaveAttribute("data-overflow-end");
  });

  it("scrolls to the latest message through its exposed method", async () => {
    render({
      components: { MtConversation },
      template: `
        <mt-conversation ref="conversation"><p>Hello</p></mt-conversation>
        <button @click="$refs.conversation.scrollToBottom()">Latest</button>
      `,
    });
    const log = screen.getByRole("log");
    const geometry = await fakeScrollGeometry(log);
    await geometry.scrollTo(0);

    await userEvent.click(screen.getByRole("button", { name: "Latest" }));

    expect(log.scrollTop).toBe(800);
  });
});

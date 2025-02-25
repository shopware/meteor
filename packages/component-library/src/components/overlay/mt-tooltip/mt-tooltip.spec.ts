import { fireEvent, render, screen } from "@testing-library/vue";
import MtTooltip from "./mt-tooltip.vue";
import { userEvent } from "@testing-library/user-event";
import { flushPromises } from "@vue/test-utils";
import MtButton from "@/components/form/mt-button/mt-button.vue";

describe("mt-tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("does not show the tooltip by default", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    // ACT & ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open tooltip" })).toHaveAccessibleDescription(
      "Tooltip",
    );
  });

  it("shows the tooltip when focusing the element", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();

    // ASSERT
    expect(screen.getByRole("tooltip", { name: "Tooltip" })).toBeVisible();
  });

  it("announces the content of the tooltip trough the trigger", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();

    // ASSERT
    expect(screen.getByRole("button", { name: "Open tooltip" })).toHaveAccessibleDescription(
      "Tooltip",
    );
  });

  it(
    "hides the tooltip when focusing out of the element",
    async () => {
      // ARRANGE
      render(MtTooltip, {
        props: {
          content: "Tooltip",
        },
        slots: {
          default: "<button v-bind='params'>Open tooltip</button>",
        },
      });

      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      // ACT
      await user.tab();
      await user.tab();

      // ASSERT
      expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
    },
    {
      // TODO: JSDOM does not include targetElement, the browser does though
      skip: true,
    },
  );

  it("does read out the tooltip content when focusing the trigger", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    // wait until everything has rendered
    await flushPromises();

    // ACT & ASSERT
    expect(screen.getByRole("button", { name: "Open tooltip" })).toHaveAccessibleDescription(
      "Tooltip",
    );
    expect(screen.getByRole("button", { name: "Open tooltip" })).toHaveAttribute(
      "aria-describedby",
    );
  });

  it("does not show the tooltip before the delay has passed when hovering over the trigger", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 200,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(100);

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("closes the tooltip when pressing the escape key", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.tab();

    // ACT
    await user.keyboard("{Escape}");

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("closes the tooltip when pressing the space key", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.tab();

    // ACT
    await user.keyboard(" ");

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("closes the tooltip when pressing the enter key", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.tab();

    // ACT
    await user.keyboard("{Enter}");

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("does not immediately close the tooltip when unhovering the trigger element", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 0,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    await user.unhover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(100);

    // ASSERT
    expect(screen.getByRole("tooltip", { name: "Tooltip" })).toBeVisible();
  });

  it("shows the tooltip when hovering over the trigger element", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 0,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));

    // ASSERT
    expect(screen.getByRole("tooltip", { name: "Tooltip" })).toBeVisible();
  });

  it("hides the tooltip when hovering out of the trigger element", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    await user.unhover(screen.getByRole("button", { name: "Open tooltip" }));

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("does not hide the tooltip when hovering out of the trigger but the trigger is still focused via the keyboard", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: { content: "Tooltip" },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    await user.unhover(screen.getByRole("button", { name: "Open tooltip" }));

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it(
    "does not hide the tooltip when clicking on the tooltip",
    async () => {
      // ARRANGE
      render(MtTooltip, {
        props: { content: "Tooltip" },
        slots: {
          default: "<button v-bind='params'>Open tooltip</button>",
        },
      });

      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      // ACT
      await user.tab();
      await user.click(screen.getByRole("tooltip"));

      // ASSERT
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    },
    {
      // TODO: JSDOM does not include targetElement, the browser does though
      skip: true,
    },
  );

  it("always shows the tooltip when quickly unhovering and then hovering again", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 200,
        hideDelayDurationInMs: 100,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));

    vi.advanceTimersByTime(200);
    await flushPromises();

    // ACT
    await user.unhover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(50);

    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(50);

    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tooltip", { name: "Tooltip" })).toBeInTheDocument();
  });

  it("never shows the tooltip when quickly hovering and then unhovering again", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 300,
        hideDelayDurationInMs: 100,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(100);

    await user.unhover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(200);

    await flushPromises();

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("keeps showing the tooltip when hovering over the tooltip and the trigger is not focused", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        delayDurationInMs: 300,
        hideDelayDurationInMs: 100,
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(300);
    await flushPromises();

    // ACT
    await user.hover(screen.getByRole("tooltip"));

    vi.advanceTimersByTime(100);
    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("hides the tooltip when hovering out of the tooltip and the trigger is not focused", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        delayDurationInMs: 300,
        hideDelayDurationInMs: 100,
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(300);
    await flushPromises();

    await user.hover(screen.getByRole("tooltip"));
    vi.advanceTimersByTime(100);
    await flushPromises();

    // ACT
    await user.unhover(screen.getByRole("tooltip"));

    vi.advanceTimersByTime(100);
    await flushPromises();

    // ASSERT
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows the tooltip when focusing the trigger element and the cursor leaves the tooltip", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        delayDurationInMs: 300,
        hideDelayDurationInMs: 100,
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.tab();
    await user.hover(screen.getByRole("tooltip"));

    // ACT
    await user.unhover(screen.getByRole("tooltip"));

    vi.advanceTimersByTime(100);
    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("always shows the tooltip when moving from the tooltip to the trigger", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        delayDurationInMs: 300,
        hideDelayDurationInMs: 100,
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(300);

    await flushPromises();

    // ACT
    await user.hover(screen.getByRole("tooltip"));
    await flushPromises();

    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(100);

    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("always shows the tooltip when quickly unhovering the tooltip and the hovering it again before it closes", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        delayDurationInMs: 300,
        hideDelayDurationInMs: 100,
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(300);

    await flushPromises();

    await user.hover(screen.getByRole("tooltip"));
    await flushPromises();

    // ACT
    await user.unhover(screen.getByRole("tooltip"));
    vi.advanceTimersByTime(50);
    await flushPromises();

    await user.hover(screen.getByRole("tooltip"));
    vi.advanceTimersByTime(50);
    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("does not show the tooltip when clicking on the trigger", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.click(screen.getByRole("button", { name: "Open tooltip" }));

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("closes the tooltip when clicking on the trigger", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.tab();

    // ACT
    await user.click(screen.getByRole("button", { name: "Open tooltip" }));

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("does not show the tooltip when closing it by clicking on the trigger and then moving the mouse away", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 100,
        hideDelayDurationInMs: 50,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(100);

    await flushPromises();

    await user.click(screen.getByRole("button", { name: "Open tooltip" }));

    // we need fireEvent here, in the browser the mouseOver gets triggered again
    // we can't do that with userEvent
    await fireEvent.mouseOver(screen.getByRole("button", { name: "Open tooltip" }));
    await user.unhover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(100);

    await flushPromises();

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("does not show the tooltip when clicking on the trigger before the tooltip is visible", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 100,
        hideDelayDurationInMs: 50,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(50);

    await user.click(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(50);
    await flushPromises();

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("does not show the tooltip when focusing the trigger and then closing it by clicking on the trigger", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 100,
        hideDelayDurationInMs: 50,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();

    // We need to use fireEvent, user.hover does not trigger the mouseover event
    await fireEvent.mouseOver(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(50);

    await user.click(screen.getByRole("button", { name: "Open tooltip" }));

    vi.advanceTimersByTime(50);
    await flushPromises();
    // wait for mouseover timeout

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("does not hide the tooltip before the delay when unhovering the tooltip when hovered the trigger before", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 100,
        hideDelayDurationInMs: 50,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(100);

    await flushPromises();

    await user.hover(screen.getByRole("tooltip"));
    vi.advanceTimersByTime(25);

    await user.unhover(screen.getByRole("tooltip"));
    vi.advanceTimersByTime(25);

    await flushPromises();

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).toBeInTheDocument();
  });

  it("does not hide the tooltip before the delay when unhovering the trigger when hovered the tooltip before", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 100,
        hideDelayDurationInMs: 50,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(100);

    await flushPromises();

    await user.hover(screen.getByRole("tooltip"));
    vi.advanceTimersByTime(25);

    await user.unhover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(25);

    await flushPromises();

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).toBeInTheDocument();
  });

  it.each([" ", "{Enter}", "{Escape}"])(
    'closes the tooltip when pressing "%s" and the trigger is hovered and focused',
    async (key) => {
      // ARRANGE
      render(MtTooltip, {
        props: {
          content: "Tooltip",
        },
        slots: {
          default: "<button v-bind='params'>Open tooltip</button>",
        },
      });

      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      await user.tab();
      await user.hover(screen.getByRole("button", { name: "Open tooltip" }));

      // ACT
      await user.keyboard(key);

      // ASSERT
      expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
    },
  );

  it("keeps the tooltip closed when focusing the trigger, hovering over it and quickly pressing the escape key", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 100,
        hideDelayDurationInMs: 50,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.tab();
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));

    vi.advanceTimersByTime(50);

    // ACT
    await user.keyboard("{Escape}");

    vi.advanceTimersByTime(50);
    await flushPromises();

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("shows the tooltip when focusing the trigger, closing it by pressing the escape key and then hovering the trigger", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 100,
        hideDelayDurationInMs: 50,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.tab();
    await user.keyboard("{Escape}");

    // ACT
    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));

    vi.advanceTimersByTime(100);
    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tooltip", { name: "Tooltip" })).toBeInTheDocument();
  });

  it("closes the tooltip when focusing the trigger, closing it by pressing the escape key, hovering and then unhovering the trigger", async () => {
    // ARRANGE
    render(MtTooltip, {
      props: {
        content: "Tooltip",
        delayDurationInMs: 100,
        hideDelayDurationInMs: 50,
      },
      slots: {
        default: "<button v-bind='params'>Open tooltip</button>",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    await user.tab();
    await user.keyboard("{Escape}");

    await user.hover(screen.getByRole("button", { name: "Open tooltip" }));
    vi.advanceTimersByTime(100);
    await flushPromises();

    // ACT
    await user.unhover(screen.getByRole("button", { name: "Open tooltip" }));

    vi.advanceTimersByTime(50);
    await flushPromises();

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "Tooltip" })).not.toBeInTheDocument();
  });

  it("opens the tooltip when tabbing on a disabled button", async () => {
    // ARRANGE
    render({
      template: `
<mt-tooltip content="Tooltip">
  <template #default="params">
    <mt-button v-bind="params" disabled>Focus to open tooltip</mt-button>
  </template>
</mt-tooltip>
`,
      components: {
        MtTooltip,
        MtButton,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();

    // ASSERT
    expect(screen.getByRole("tooltip", { name: "Tooltip" })).toBeVisible();
  });

  it("does not perform an action when clicking on the disabled button", async () => {
    // ARRANGE
    const handler = vi.fn();

    render({
      template: `
<mt-tooltip content="Tooltip">
  <template #default="params">
    <mt-button v-bind="params" @click="handler" disabled>Click to open tooltip</mt-button>
  </template>
</mt-tooltip>`,
      components: {
        MtTooltip,
        MtButton,
      },
      setup: () => ({ handler }),
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.click(screen.getByRole("button"));

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });

  it.each([" ", "{Enter}"])(
    'does not perform an action when pressing "%s" on the disabled button',
    async (key) => {
      // ARRANGE
      const handler = vi.fn();

      render({
        template: `
<mt-tooltip content="Tooltip">
  <template #default="params">
    <mt-button v-bind="params" @click="handler" disabled>Click to open tooltip</mt-button>
  </template>
</mt-tooltip>`,
        components: {
          MtTooltip,
          MtButton,
        },
        setup: () => ({ handler }),
      });

      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      // ACT
      await user.keyboard(key);

      // ASSERT
      expect(handler).not.toHaveBeenCalled();
    },
  );

  it("shows the tooltip when hovering over the disabled button", async () => {
    // ARRANGE
    render({
      template: `
<mt-tooltip content="Tooltip" delayDurationInMs="100" hideDelayDurationInMs="50">
  <template #default="params">
    <mt-button v-bind="params" disabled>Hover to open tooltip</mt-button>
  </template>
</mt-tooltip>`,
      components: {
        MtTooltip,
        MtButton,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button"));

    vi.advanceTimersByTime(100);
    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tooltip", { name: "Tooltip" })).toBeVisible();
  });

  it("does show a tooltip when focusing a disabled link button", async () => {
    // ARRANGE
    render({
      template: `
<mt-tooltip content="Tooltip">
  <template #default="params">
    <mt-button v-bind="params" disabled link="https://www.shopware.com">Focus to open tooltip</mt-button>
  </template>
</mt-tooltip>
`,
      components: {
        MtTooltip,
        MtButton,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();

    // ARRANGE
    expect(screen.getByRole("tooltip", { name: "Tooltip" })).toBeVisible();
  });

  it("shows a tooltip when focusing a loading link button", async () => {
    // ARRANGE
    render({
      template: `
<mt-tooltip content="Tooltip">
  <template #default="params">
    <mt-button v-bind="params" isLoading link="https://www.shopware.com">Focus to open tooltip</mt-button>
  </template>
</mt-tooltip>
`,
      components: {
        MtTooltip,
        MtButton,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();

    // ARRANGE
    expect(screen.getByRole("tooltip", { name: "Tooltip" })).toBeVisible();
  });

  it("shows the tooltip when hovering over the disabled link button", async () => {
    // ARRANGE
    render({
      template: `
<mt-tooltip content="Tooltip" delayDurationInMs="100" hideDelayDurationInMs="50">
  <template #default="params">
    <mt-button v-bind="params" link="https://www.shopware.com" disabled>Hover to open tooltip</mt-button>
  </template>
</mt-tooltip>`,
      components: {
        MtTooltip,
        MtButton,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("link"));

    vi.advanceTimersByTime(100);
    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tooltip", { name: "Tooltip" })).toBeVisible();
  });
});

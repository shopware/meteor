import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import MtReasoning from "./mt-reasoning.vue";
import MtReasoningContent from "./mt-reasoning-content.vue";
import MtReasoningTrigger from "./mt-reasoning-trigger.vue";

function renderReasoning(props: Record<string, unknown> = {}) {
  return render(
    {
      components: { MtReasoning, MtReasoningTrigger, MtReasoningContent },
      props: ["streaming", "duration", "defaultOpen"],
      template: `
      <mt-reasoning :streaming="streaming" :duration="duration" :default-open="defaultOpen">
        <mt-reasoning-trigger />
        <mt-reasoning-content content="The merchant asks for **low stock**." />
      </mt-reasoning>
    `,
    },
    { props: { streaming: false, duration: undefined, defaultOpen: undefined, ...props } },
  );
}

function trigger() {
  return screen.getByRole("button");
}

describe("mt-reasoning", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is closed after the reasoning, without a known duration", () => {
    renderReasoning();

    expect(trigger()).toHaveTextContent("Thought for a few seconds");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("shows a given duration", () => {
    renderReasoning({ duration: 2 });

    expect(trigger()).toHaveTextContent("Thought for 2 seconds");
  });

  it("stays closed while the model reasons, until the user opens it", async () => {
    vi.useRealTimers();
    const { rerender } = renderReasoning({ streaming: true });

    expect(trigger()).toHaveTextContent("Thinking…");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger());
    expect(trigger()).toHaveAttribute("aria-expanded", "true");

    await rerender({ streaming: false });
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("measures how long the model reasoned", async () => {
    const { rerender } = renderReasoning({ streaming: true });

    vi.advanceTimersByTime(3_200);
    await rerender({ streaming: false });

    expect(trigger()).toHaveTextContent("Thought for 4 seconds");
  });

  it("pulses its dot while the model reasons", async () => {
    const { container, rerender } = renderReasoning({ streaming: true });
    const dot = () => container.querySelector(".mt-status-dot");

    expect(dot()).toHaveClass("mt-status-dot--variant-info", "mt-status-dot--pulse");

    await rerender({ streaming: false });

    expect(dot()).toHaveClass("mt-status-dot--variant-positive");
    expect(dot()).not.toHaveClass("mt-status-dot--pulse");
  });

  it("opens while streaming and closes a second later with defaultOpen", async () => {
    const { rerender } = renderReasoning({ streaming: true, defaultOpen: true });

    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("low stock")).toBeVisible();

    await rerender({ streaming: false });
    expect(trigger()).toHaveAttribute("aria-expanded", "true");

    vi.advanceTimersByTime(1_000);
    await nextTick();

    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("uses one second for a single second", async () => {
    const { rerender } = renderReasoning({ streaming: true });

    vi.advanceTimersByTime(400);
    await rerender({ streaming: false });

    expect(trigger()).toHaveTextContent("Thought for 1 second");
  });
});

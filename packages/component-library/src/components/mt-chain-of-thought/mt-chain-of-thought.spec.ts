import { render, screen, within } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import MtChainOfThought from "./mt-chain-of-thought.vue";
import MtChainOfThoughtContent from "./mt-chain-of-thought-content.vue";
import MtChainOfThoughtHeader from "./mt-chain-of-thought-header.vue";
import MtChainOfThoughtStep from "./mt-chain-of-thought-step.vue";

function renderSteps(defaultOpen = true) {
  return render({
    components: {
      MtChainOfThought,
      MtChainOfThoughtHeader,
      MtChainOfThoughtContent,
      MtChainOfThoughtStep,
    },
    setup: () => ({ defaultOpen }),
    template: `
      <mt-chain-of-thought :default-open="defaultOpen">
        <mt-chain-of-thought-header>Worked for 12 seconds</mt-chain-of-thought-header>
        <mt-chain-of-thought-content>
          <mt-chain-of-thought-step label="Thought for 2 seconds" description="Find lamps." />
          <mt-chain-of-thought-step label="Searching products…" status="active">
            <span>12 results</span>
          </mt-chain-of-thought-step>
          <mt-chain-of-thought-step label="Write the answer" status="pending" />
          <mt-chain-of-thought-step label="Read the page" status="error" />
        </mt-chain-of-thought-content>
      </mt-chain-of-thought>
    `,
  });
}

describe("mt-chain-of-thought", () => {
  it("is closed by default and opens with its header", async () => {
    renderSteps(false);

    const header = screen.getByRole("button", { name: "Worked for 12 seconds" });
    expect(header).toHaveAttribute("aria-expanded", "false");
    // Only the chevron: the header has no icon of its own.
    expect(header.querySelectorAll(".mt-icon")).toHaveLength(1);

    await userEvent.click(header);

    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Find lamps.")).toBeVisible();
  });

  it("lists the steps with their status for assistive technology", () => {
    renderSteps();

    const steps = within(screen.getByRole("list", { name: "Chain of thought" })).getAllByRole(
      "listitem",
    );

    expect(steps).toHaveLength(4);
    expect(steps[0]).toHaveTextContent("Thought for 2 seconds (completed)");
    expect(steps[1]).toHaveTextContent("Searching products… (in progress)");
    expect(steps[2]).toHaveTextContent("Write the answer (pending)");
    expect(steps[3]).toHaveTextContent("Read the page (failed)");
  });

  it("shows the description and details of a step", () => {
    renderSteps();

    expect(screen.getByText("Find lamps.")).toBeVisible();
    expect(screen.getByText("12 results")).toBeVisible();
  });

  it("marks the running step as the current one", () => {
    renderSteps();

    expect(screen.getByRole("listitem", { current: "step" })).toHaveTextContent(
      "Searching products…",
    );
  });

  it.each([
    ["complete", "positive"],
    ["active", "info"],
    ["pending", "neutral"],
    ["error", "critical"],
  ] as const)("shows a %s step with a %s dot", (status, variant) => {
    const { container } = render(MtChainOfThoughtStep, { props: { label: "Step", status } });

    const dot = container.querySelector(".mt-status-dot");
    expect(dot).toHaveClass(`mt-status-dot--variant-${variant}`);
    expect(dot?.classList.contains("mt-status-dot--pulse")).toBe(status === "active");
  });
});

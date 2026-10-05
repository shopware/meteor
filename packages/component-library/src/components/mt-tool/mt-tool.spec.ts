import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { MtToolState } from "@/types/ai";
import MtTool from "./mt-tool.vue";
import MtToolContent from "./mt-tool-content.vue";
import MtToolHeader from "./mt-tool-header.vue";
import MtToolInput from "./mt-tool-input.vue";
import MtToolOutput from "./mt-tool-output.vue";

function renderTool(props: Record<string, unknown>, output = "") {
  return render({
    components: { MtTool, MtToolHeader, MtToolContent, MtToolInput, MtToolOutput },
    setup: () => ({ props }),
    template: `
      <mt-tool>
        <mt-tool-header :type="props.type" :state="props.state" :tool-name="props.toolName" :title="props.title" />
        <mt-tool-content>
          <mt-tool-input :input="props.input" />
          <mt-tool-output :output="props.output" :error-text="props.errorText">${output}</mt-tool-output>
        </mt-tool-content>
      </mt-tool>
    `,
  });
}

describe("mt-tool", () => {
  it.each([
    [{ type: "tool-searchProducts" }, "searchProducts"],
    [{ type: "dynamic-tool", toolName: "lookupOrder" }, "lookupOrder"],
    [{ type: "tool-searchProducts", title: "Search products" }, "Search products"],
  ])("names the tool %o as %s", (props, name) => {
    renderTool({ state: "input-available", ...props });

    expect(screen.getByRole("button")).toHaveTextContent(name);
  });

  it.each([
    ["input-streaming", "Pending", "neutral"],
    ["input-available", "Running", "info"],
    ["approval-requested", "Awaiting approval", "attention"],
    ["approval-responded", "Responded", "info"],
    ["output-available", "Completed", "positive"],
    ["output-error", "Error", "critical"],
    ["output-denied", "Denied", "attention"],
  ] as [MtToolState, string, string][])(
    "shows %s as a %s badge and dot",
    (state, label, variant) => {
      const { container } = renderTool({ type: "tool-searchProducts", state });

      const badge = container.querySelector(".mt-badge");
      expect(badge).toHaveTextContent(label);
      expect(badge).toHaveClass(`mt-badge--variant-${variant}`);

      // One dot in the header, in the badge's color, pulsing only while the tool runs.
      const dots = container.querySelectorAll(".mt-status-dot");
      expect(dots).toHaveLength(1);
      expect(dots[0]).toHaveClass(`mt-status-dot--variant-${variant}`);
      expect(dots[0].classList.contains("mt-status-dot--pulse")).toBe(state === "input-available");
    },
  );

  it("opens to show the input and the result", async () => {
    renderTool({
      type: "tool-searchProducts",
      state: "output-available",
      input: { query: "lamp" },
      output: { count: 3 },
    });

    const header = screen.getByRole("button", { name: /searchProducts/ });
    expect(header).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(header);

    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Parameters")).toBeVisible();
    expect(screen.getByText(/"query": "lamp"/)).toBeVisible();
    expect(screen.getByText("Result")).toBeVisible();
    expect(screen.getByText(/"count": 3/)).toBeVisible();
  });

  it("shows the error instead of a result", () => {
    render(MtToolOutput, { props: { errorText: "There is no product SW-9." } });

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("There is no product SW-9.")).toBeInTheDocument();
    expect(screen.queryByText("Result")).toBeNull();
  });

  it("shows a text result as it is", () => {
    render(MtToolOutput, { props: { output: "3 products" } });

    expect(screen.getByText("3 products")).toBeInTheDocument();
  });

  it("renders a result through its slot", () => {
    render(MtToolOutput, {
      props: { output: { count: 3 } },
      slots: { default: "<p>Three products</p>" },
    });

    expect(screen.getByText("Three products")).toBeInTheDocument();
    expect(screen.queryByText(/"count"/)).toBeNull();
  });

  it("shows nothing without an input or a result", () => {
    const input = render(MtToolInput);
    const output = render(MtToolOutput);

    expect(input.container).toBeEmptyDOMElement();
    expect(output.container).toBeEmptyDOMElement();
  });
});

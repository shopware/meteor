import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { createTooltipHandler, hiddenTooltip } from "./mt-chart-tooltip";

const chart = { canvas: { offsetLeft: 10, offsetTop: 20 } } as any;

describe("mt-chart tooltip", () => {
  it("maps the tooltip model to visible state", () => {
    const state = ref(hiddenTooltip());
    const handler = createTooltipHandler(state);

    handler({
      chart,
      tooltip: {
        opacity: 1,
        caretX: 100,
        caretY: 50,
        title: ["Jan"],
        dataPoints: [{ dataset: { borderColor: "#0870ff" }, formattedValue: "42" }],
      } as any,
    });

    expect(state.value).toEqual({
      visible: true,
      x: 110,
      y: 70,
      title: "Jan",
      rows: [{ color: "#0870ff", value: "42" }],
    });
  });

  it("hides on zero opacity and keeps the last position", () => {
    const state = ref({ ...hiddenTooltip(), visible: true, x: 5, y: 6 });
    const handler = createTooltipHandler(state);

    handler({ chart, tooltip: { opacity: 0 } as any });

    expect(state.value.visible).toBe(false);
    expect(state.value.x).toBe(5);
  });
});

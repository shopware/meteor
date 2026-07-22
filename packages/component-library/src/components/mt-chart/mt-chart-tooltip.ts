import type { Chart, TooltipModel } from "chart.js";
import type { Ref } from "vue";

export interface ChartTooltipState {
  visible: boolean;
  x: number;
  y: number;
  title: string;
  rows: { color: string; value: string }[];
}

export const hiddenTooltip = (): ChartTooltipState => ({
  visible: false,
  x: 0,
  y: 0,
  title: "",
  rows: [],
});

/**
 * Chart.js external tooltip handler that maps the tooltip model onto plain
 * state; mt-chart renders it as a normal Vue element with scoped styles.
 */
export function createTooltipHandler(state: Ref<ChartTooltipState>) {
  return ({ chart, tooltip }: { chart: Chart; tooltip: TooltipModel<"line"> }): void => {
    if (tooltip.opacity === 0) {
      state.value = { ...state.value, visible: false };
      return;
    }

    state.value = {
      visible: true,
      x: chart.canvas.offsetLeft + tooltip.caretX,
      y: chart.canvas.offsetTop + tooltip.caretY,
      title: tooltip.title?.[0] ?? "",
      rows: tooltip.dataPoints.map((point) => ({
        color: String(point.dataset.borderColor ?? ""),
        value: point.formattedValue,
      })),
    };
  };
}

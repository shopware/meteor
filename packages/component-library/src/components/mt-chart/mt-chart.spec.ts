import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/vue";
import flushPromises from "flush-promises";
import MtChart from "./mt-chart.vue";

// Chart.js needs a real canvas context (absent in jsdom), so mock it and
// capture what the component feeds it. Hoisted because mt-chart imports
// chart.js statically.
const { instances, MockChart } = vi.hoisted(() => {
  const instances: any[] = [];

  class MockChart {
    static register = vi.fn();
    config: any;
    data: any;
    options: any;
    update = vi.fn();
    destroy = vi.fn();

    constructor(_canvas: HTMLCanvasElement, config: any) {
      this.config = config;
      this.data = config.data;
      this.options = config.options;
      instances.push(this);
    }
  }

  return { instances, MockChart };
});

vi.mock("chart.js", () => ({ Chart: MockChart, registerables: [] }));

async function renderChart(props: Record<string, unknown>) {
  const utils = render(MtChart, {
    props: { series: [{ name: "A", data: [1, 2, 3] }], ...props },
  });
  await flushPromises();
  const root = utils.container.querySelector('[data-testid="mt-chart"]') as HTMLElement;
  return { ...utils, root };
}

describe("mt-chart", () => {
  beforeEach(() => {
    instances.length = 0;
  });

  afterEach(() => {
    // unmount to disconnect the theme MutationObserver between tests
    cleanup();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders the container and canvas and instantiates a chart", async () => {
    const { root, container } = await renderChart({ type: "area" });

    expect(root.classList).toContain("mt-chart-area");
    expect(container.querySelector("canvas")).not.toBeNull();
    expect(instances).toHaveLength(1);
  });

  it("renders an area type as a filled line chart", async () => {
    await renderChart({ type: "area" });

    expect(instances[0].config.type).toBe("line");
    expect(instances[0].config.data.datasets[0].fill).toBe(true);
  });

  it("maps the type prop to the Chart.js type and the css class", async () => {
    const { root } = await renderChart({ type: "bar" });

    expect(instances[0].config.type).toBe("bar");
    expect(root.classList).toContain("mt-chart-bar");
  });

  it("applies width and height", async () => {
    const { root } = await renderChart({ width: "300px", height: 200 });

    expect(root.getAttribute("style")).toContain("width: 300px");
    expect(root.getAttribute("style")).toContain("height: 200px");
  });

  it("updates the chart data when the series changes", async () => {
    const { rerender } = await renderChart({ type: "area" });
    const chart = instances[0];

    await rerender({ type: "area", series: [{ name: "A", data: [9, 8, 7] }] });
    await flushPromises();

    expect(chart.update).toHaveBeenCalled();
    expect(chart.data.datasets[0].data).toEqual([9, 8, 7]);
  });

  it("re-initializes when options change", async () => {
    const { rerender } = await renderChart({ type: "area" });

    await rerender({
      type: "area",
      series: [{ name: "A", data: [1, 2, 3] }],
      options: { colors: ["#ff7008"] },
    });
    await flushPromises();

    expect(instances).toHaveLength(2);
    expect(instances[1].config.data.datasets[0].borderColor).toBe("#ff7008");
  });

  it("re-initializes when the theme changes", async () => {
    await renderChart({ type: "area" });

    document.documentElement.setAttribute("data-theme", "dark");
    await flushPromises();
    await flushPromises();

    expect(instances.length).toBeGreaterThan(1);
  });

  it("disables the tooltip when options.tooltip.enabled is false", async () => {
    await renderChart({ type: "area", options: { tooltip: { enabled: false } } });

    const tooltip = instances[0].config.options.plugins.tooltip;
    expect(tooltip.enabled).toBe(false);
    expect(tooltip.external).toBeUndefined();
  });

  it("destroys the chart on unmount", async () => {
    const { unmount } = await renderChart({ type: "area" });
    const chart = instances[0];

    unmount();

    expect(chart.destroy).toHaveBeenCalled();
  });
});

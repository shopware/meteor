import { describe, it, expect } from "vitest";
import { toChartConfig } from "./mt-chart-adapter";
import { getDefaultOptions } from "./mt-chart-default-options";
import { deepMergeObjects } from "@/utils/object";
import type { ChartOptions } from "./mt-chart-types";

const series = [{ name: "Sample", data: [30, 55, 65] }];

function areaConfig(options: ChartOptions = {}) {
  const merged = deepMergeObjects<ChartOptions>(getDefaultOptions("area"), options);
  return toChartConfig("area", series, merged);
}

describe("mt-chart adapter", () => {
  it("maps an area chart to a filled line", () => {
    const config = areaConfig();
    expect(config.type).toBe("line");
    const dataset = config.data.datasets[0] as { fill?: boolean; borderColor?: string };
    expect(dataset.fill).toBe(true);
    expect(dataset.borderColor).toBe("#0870ff");
  });

  it("uses xaxis.categories as labels", () => {
    const config = areaConfig({ xaxis: { categories: ["Jan", "Feb", "Mar"] } });
    expect(config.data.labels).toEqual(["Jan", "Feb", "Mar"]);
  });

  it("falls back to index labels without categories", () => {
    const config = areaConfig();
    expect(config.data.labels).toEqual(["1", "2", "3"]);
  });

  it("draws a smooth curve with the Apex algorithm and a straight curve with none", () => {
    const smooth = areaConfig({ stroke: { curve: "smooth" } }).data.datasets[0] as {
      mtApexSmooth?: boolean;
      tension: number;
    };
    // the plugin draws the curve; tension only routes Chart.js to the bezier path
    expect(smooth.mtApexSmooth).toBe(true);
    expect(smooth.tension).toBeGreaterThan(0);
    expect((areaConfig({ stroke: { curve: "straight" } }).data.datasets[0] as { tension: number }).tension).toBe(0);
  });

  it("computes an Apex-style nice y scale from the data", () => {
    const config = toChartConfig("area", [{ name: "A", data: [30, 55, 65, 60, 45, 40, 55, 80] }], {});
    const y = (config.options?.scales as any).y;
    expect(y.min).toBe(30);
    expect(y.max).toBe(80);
    expect(y.ticks.stepSize).toBe(10);
  });

  it("includes zero in the bar chart y scale", () => {
    const config = toChartConfig("bar", [{ name: "A", data: [21, 43, 67] }], {});
    expect((config.options?.scales as any).y.min).toBe(0);
  });

  it("translates stepline and monotoneCubic curves", () => {
    expect((areaConfig({ stroke: { curve: "stepline" } }).data.datasets[0] as { stepped: string }).stepped).toBe(
      "after",
    );
    expect(
      (areaConfig({ stroke: { curve: "monotoneCubic" } }).data.datasets[0] as { cubicInterpolationMode: string })
        .cubicInterpolationMode,
    ).toBe("monotone");
  });

  it("honors a custom color and stroke width", () => {
    const dataset = areaConfig({ colors: ["#ff7008"], stroke: { width: 4 } })
      .data.datasets[0] as { borderColor: string; borderWidth: number };
    expect(dataset.borderColor).toBe("#ff7008");
    expect(dataset.borderWidth).toBe(4);
  });

  it("uses a gradient background function when fill is a gradient", () => {
    const dataset = areaConfig().data.datasets[0] as { backgroundColor: unknown };
    expect(typeof dataset.backgroundColor).toBe("function");
  });

  it("disables animation when chart.animations.enabled is false", () => {
    expect(areaConfig().options?.animation).toBe(false);
  });

  it("hides the legend for a single series and shows it for multiple", () => {
    expect(areaConfig().options?.plugins?.legend?.display).toBe(false);
    const multi = toChartConfig("area", [series[0], { name: "B", data: [1, 2, 3] }], {});
    expect(multi.options?.plugins?.legend?.display).toBe(true);
  });

  it("maps type=bar to a bar chart", () => {
    expect(toChartConfig("bar", series, {}).type).toBe("bar");
  });

  it("maps donut to doughnut and takes the Apex numeric series shape", () => {
    const config = toChartConfig("donut", [44, 55, 13], {
      labels: ["A", "B", "C"],
      colors: ["#111111", "#222222", "#333333"],
    });

    expect(config.type).toBe("doughnut");
    expect(config.data.labels).toEqual(["A", "B", "C"]);
    expect(config.data.datasets[0].data).toEqual([44, 55, 13]);
    expect(config.data.datasets[0].backgroundColor).toEqual(["#111111", "#222222", "#333333"]);
    // circular charts have no x/y scales and show the legend by default
    expect(config.options?.scales).toBeUndefined();
    expect(config.options?.plugins?.legend?.display).toBe(true);
  });

  it("maps radar, polarArea, scatter and bubble to native Chart.js types", () => {
    expect(toChartConfig("radar", series, {}).type).toBe("radar");
    expect(toChartConfig("polarArea", [1, 2, 3], {}).type).toBe("polarArea");
    expect(toChartConfig("scatter", series, {}).type).toBe("scatter");
    expect(toChartConfig("bubble", series, {}).type).toBe("bubble");
  });

  it("translates scatter/bubble data pairs to point objects", () => {
    const config = toChartConfig("bubble", [{ name: "A", data: [[1, 2, 3]] as any }], {});
    expect(config.data.datasets[0].data).toEqual([{ x: 1, y: 2, r: 3 }]);
  });

  it("honors a series-level color", () => {
    const config = toChartConfig("area", [{ name: "A", data: [1], color: "#ff0000" }], {});
    expect((config.data.datasets[0] as { borderColor: string }).borderColor).toBe("#ff0000");
  });

  it("applies stacking and yaxis min/max to the scales", () => {
    const config = areaConfig({ chart: { stacked: true }, yaxis: { min: 0, max: 100 } });
    const scales = config.options?.scales as {
      x?: { stacked?: boolean };
      y?: { stacked?: boolean; min?: number; max?: number };
    };
    expect(scales.x?.stacked).toBe(true);
    expect(scales.y?.stacked).toBe(true);
    expect(scales.y?.min).toBe(0);
    expect(scales.y?.max).toBe(100);
  });

  it("resolves css-variable colors through the resolver", () => {
    const config = toChartConfig(
      "area",
      series,
      { grid: { borderColor: "var(--color-border-primary-default)" } },
      (value) => (value?.includes("var(") ? "#abcdef" : value),
    );
    const scales = config.options?.scales as any;
    expect(scales.y.grid.color).toBe("#abcdef");
  });
});

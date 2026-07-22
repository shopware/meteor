import type {
  ChartConfiguration,
  ChartDataset,
  ChartType,
  Plugin,
  ScriptableContext,
} from "chart.js";
import type { ChartFillGradient, ChartOptions, ChartSeries } from "./mt-chart-types";

/** resolves `var(--token)` strings to concrete colors (canvas cannot read CSS vars) */
export type ColorResolver = (value?: string) => string | undefined;

const DEFAULT_COLOR = "#0870ff";

// Apex type names -> Chart.js; unknown types fall back to a filled line (area)
const TYPE_MAP: Record<string, ChartType> = {
  line: "line",
  bar: "bar",
  pie: "pie",
  donut: "doughnut",
  radar: "radar",
  polarArea: "polarArea",
  scatter: "scatter",
  bubble: "bubble",
};

const CIRCULAR_TYPES = new Set<ChartType>(["pie", "doughnut", "polarArea"]);

function toChartType(type: string): { chartType: ChartType; area: boolean } {
  const chartType = TYPE_MAP[type];
  if (chartType) return { chartType, area: false };
  return { chartType: "line", area: true };
}

function withAlpha(color: string, alpha: number): string {
  const hex = color.replace("#", "");
  const full = hex.length === 3 ? hex.replace(/./g, "$&$&") : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return color;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** mixes a hex color toward white; used for Apex's gradient shading */
function lighten(color: string, amount: number): string {
  const hex = color.replace("#", "");
  const full = hex.length === 3 ? hex.replace(/./g, "$&$&") : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return color;
  const channel = (offset: number) => {
    const value = parseInt(full.slice(offset, offset + 2), 16);
    return Math.round(value + (255 - value) * amount)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(2)}${channel(4)}`;
}

function gradientFill(color: string, gradient: ChartFillGradient | undefined) {
  // measured from Apex's rendered output: it lightens the end color by 50%
  // and applies ~0.7 path fill-opacity on top of opacityFrom
  const from = (gradient?.opacityFrom ?? 0.7) * 0.7;
  const to = gradient?.opacityTo ?? 0;

  return (ctx: ScriptableContext<"line">) => {
    const { chartArea, ctx: canvasCtx } = ctx.chart;
    if (!chartArea) return withAlpha(color, from);

    const linear = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    linear.addColorStop(0, withAlpha(color, from));
    linear.addColorStop(1, withAlpha(lighten(color, 0.5), to));
    return linear;
  };
}

type SmoothablePoint = {
  x: number;
  y: number;
  cp1x?: number;
  cp1y?: number;
  cp2x?: number;
  cp2y?: number;
};

function applyApexSmooth(meta: { data: unknown; dataset?: unknown }): void {
  if (!meta.dataset) return;
  const points = meta.data as SmoothablePoint[];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const prev = points[i - 1];
    const next = points[i + 1];
    point.cp1x = prev ? point.x - (point.x - prev.x) * 0.35 : point.x;
    point.cp1y = point.y;
    point.cp2x = next ? point.x + (next.x - point.x) * 0.35 : point.x;
    point.cp2y = point.y;
  }

  // keep Chart.js from recomputing its own control points afterwards
  (meta.dataset as { _pointsUpdated: boolean })._pointsUpdated = true;
}

const isSmoothDataset = (dataset: unknown): boolean =>
  (dataset as { mtApexSmooth?: boolean })?.mtApexSmooth === true;

/**
 * Apex's "smooth" curve: horizontal tangents with handles at 0.35 * dx
 * (reverse-engineered from its SVG). Chart.js has no such mode, so the
 * plugin overwrites the computed control points of flagged datasets.
 * afterUpdate covers the fill path, beforeDatasetDraw the animated stroke.
 */
export const apexSmoothPlugin: Plugin = {
  id: "mtApexSmooth",
  afterUpdate(chart) {
    for (const meta of chart.getSortedVisibleDatasetMetas()) {
      if (isSmoothDataset(chart.data.datasets[meta.index])) applyApexSmooth(meta);
    }
  },
  beforeDatasetDraw(chart, args) {
    if (isSmoothDataset(chart.data.datasets[args.index])) applyApexSmooth(args.meta);
  },
};

/** Apex-style nice scale: five 1/2/5/10-magnitude steps with rounded bounds. */
function niceScale(min: number, max: number): { min: number; max: number; step: number } {
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const raw = (max - min) / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalized = raw / magnitude;
  const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude;
  return { min: Math.floor(min / step) * step, max: Math.ceil(max / step) * step, step };
}

/** Apex scatter/bubble data pairs ([x, y] / [x, y, z]) -> Chart.js point objects */
function toPoints(data: unknown[]): unknown[] {
  return data.map((point) =>
    Array.isArray(point)
      ? { x: point[0], y: point[1], ...(point.length > 2 ? { r: point[2] } : {}) }
      : point,
  );
}

export function toChartConfig(
  type: string,
  series: ChartSeries[] | number[],
  options: ChartOptions,
  resolve: ColorResolver = (value) => value,
): ChartConfiguration {
  const { chartType, area } = toChartType(type);
  const circular = CIRCULAR_TYPES.has(chartType);

  const colors = options.colors?.length ? options.colors : [DEFAULT_COLOR];
  const borderWidth = options.stroke?.width ?? 2;
  const gridColor = resolve(options.grid?.borderColor);
  const tickColor = resolve("var(--color-text-secondary-default)");

  // "smooth" is drawn by apexSmoothPlugin; the nonzero tension only routes
  // Chart.js to the bezier path so the plugin's control points apply
  const curve = options.stroke?.curve;
  const lineStyle =
    curve === "smooth"
      ? { tension: 0.35, mtApexSmooth: true }
      : curve === "monotoneCubic"
        ? { cubicInterpolationMode: "monotone" as const }
        : curve === "stepline"
          ? { stepped: "after" as const }
          : { tension: 0 };

  let labels: (string | number)[];
  let datasets: ChartDataset[];

  if (circular) {
    // Apex circular series are plain numbers, colored per slice
    const values = (series as unknown[]).map((entry) =>
      typeof entry === "number" ? entry : ((entry as ChartSeries).data?.[0] ?? 0),
    );
    labels = options.labels ?? values.map((_, index) => String(index + 1));
    datasets = [
      {
        data: values,
        backgroundColor: values.map((_, index) => colors[index % colors.length] ?? DEFAULT_COLOR),
        borderWidth: 0,
      } as ChartDataset,
    ];
  } else {
    const namedSeries = series as ChartSeries[];

    datasets = namedSeries.map((entry, index): ChartDataset => {
      const color =
        (typeof entry.color === "string" ? entry.color : undefined) ??
        colors[index % colors.length] ??
        DEFAULT_COLOR;
      const data =
        chartType === "scatter" || chartType === "bubble" ? toPoints(entry.data) : entry.data;
      const base = {
        label: entry.name,
        data,
        borderColor: color,
        borderWidth,
        ...lineStyle,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: color,
      };

      if (area) {
        return {
          ...base,
          fill: true,
          backgroundColor:
            options.fill?.type === "gradient" || options.fill?.gradient
              ? gradientFill(color, options.fill?.gradient)
              : withAlpha(color, 0.3),
        } as ChartDataset;
      }

      return { ...base, fill: false, backgroundColor: color } as ChartDataset;
    });

    labels =
      options.xaxis?.categories ??
      namedSeries[0]?.data.map((_, index) => String(index + 1)) ??
      [];
  }

  const showScales = !circular && chartType !== "radar";
  const stacked = options.chart?.stacked === true;
  const yAxis = Array.isArray(options.yaxis) ? options.yaxis[0] : options.yaxis;

  // Apex-style y scale from the data; user yaxis min/max win, stacked charts
  // fall back to auto scaling (their range depends on per-point sums)
  let yMin = yAxis?.min as number | undefined;
  let yMax = yAxis?.max as number | undefined;
  let yStep: number | undefined;
  const numericValues =
    showScales && !stacked && chartType !== "scatter" && chartType !== "bubble"
      ? (series as ChartSeries[])
          .flatMap((entry) => entry.data ?? [])
          .filter((value): value is number => typeof value === "number")
      : [];
  if (numericValues.length) {
    const dataMin =
      chartType === "bar" ? Math.min(0, ...numericValues) : Math.min(...numericValues);
    const nice = niceScale(dataMin, Math.max(...numericValues));
    yMin ??= nice.min;
    yMax ??= nice.max;
    yStep = nice.step;
  }

  return {
    type: chartType,
    data: { labels, datasets },
    plugins: [apexSmoothPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // plot-area geometry measured from Apex (30px top, 37.7px bottom)
      layout: showScales ? { padding: { top: 30, bottom: 3 } } : undefined,
      animation: options.chart?.animations?.enabled === false ? false : undefined,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: options.legend?.show ?? (circular || series.length > 1) },
      },
      // axis fonts, tick stubs and label gaps measured from Apex
      scales: showScales
        ? {
            x: {
              stacked,
              grid: {
                display: true,
                drawOnChartArea: false,
                drawTicks: true,
                tickLength: 6,
                tickColor: gridColor,
              },
              border: { color: gridColor },
              ticks: { color: tickColor, padding: 7, font: { size: 12 } },
            },
            y: {
              stacked,
              min: yMin,
              max: yMax,
              grid: { color: gridColor, drawTicks: false },
              border: { display: false },
              ticks: {
                color: tickColor,
                padding: 13,
                font: { size: 11 },
                ...(yStep ? { stepSize: yStep } : { maxTicksLimit: 7 }),
              },
            },
          }
        : undefined,
    },
  };
}

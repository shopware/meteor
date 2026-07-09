// ApexCharts-shaped options kept for API compatibility; the adapter maps the
// supported subset to Chart.js. Permissive so existing consumers keep compiling.

export interface ChartFillGradient {
  type?: string;
  opacityFrom?: number;
  opacityTo?: number;
  stops?: number[];
  [key: string]: unknown;
}

export interface ChartOptions {
  chart?: {
    type?: string;
    width?: string | number;
    height?: string | number;
    stacked?: boolean;
    toolbar?: { show?: boolean };
    zoom?: { enabled?: boolean };
    animations?: { enabled?: boolean };
    [key: string]: unknown;
  };
  colors?: string[];
  /** slice labels for circular charts (pie, donut, polarArea) */
  labels?: (string | number)[];
  stroke?: {
    curve?: "smooth" | "straight" | "stepline" | string;
    width?: number;
    [key: string]: unknown;
  };
  fill?: {
    type?: string;
    gradient?: ChartFillGradient;
    [key: string]: unknown;
  };
  xaxis?: { categories?: (string | number)[]; [key: string]: unknown };
  yaxis?: Record<string, unknown> | Record<string, unknown>[];
  grid?: { show?: boolean; borderColor?: string; [key: string]: unknown };
  dataLabels?: { enabled?: boolean; [key: string]: unknown };
  legend?: { show?: boolean; [key: string]: unknown };
  tooltip?: { enabled?: boolean; [key: string]: unknown };
  markers?: Record<string, unknown>;
  noData?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ChartSeries {
  name?: string;
  data: number[];
  [key: string]: unknown;
}

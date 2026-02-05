import type { ApexOptions } from "apexcharts";

export function getDefaultOptions(type: string): ApexOptions {
  const options = createOptions();

  return options[type] ?? {};
}

function createOptions(): Record<string, ApexOptions> {
  return {
    area: {
      noData: {
        align: "center",
        verticalAlign: "middle",
      },
      stroke: {
        curve: "straight",
        width: 2,
      },
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: false },
      },
      xaxis: {
        tooltip: { enabled: false },
        crosshairs: {
          show: true,
          width: 1,
          stroke: {
            color: "#2d2e32",
            width: 1,
            dashArray: 0,
          },
        },
        axisBorder: {
          color: "var(--color-border-primary-default)",
        },
        axisTicks: {
          color: "var(--color-border-primary-default)",
        },
      },
      grid: {
        show: true,
        borderColor: "var(--color-border-primary-default)",
      },
      colors: ["#0870ff"],
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          opacityFrom: 0.7,
          opacityTo: 0,
          stops: [0, 100],
        },
      },
      dataLabels: { enabled: false },
    },
  };
}

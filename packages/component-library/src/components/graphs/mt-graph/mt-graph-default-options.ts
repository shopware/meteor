import type { ApexOptions } from "apexcharts";

const defaultOptions: { [key: string]: ApexOptions } = {
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
    },
    grid: {
      show: true,
      borderColor: "#cdced4",
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
  // Add default options for other chart types once needed
};

export default defaultOptions;

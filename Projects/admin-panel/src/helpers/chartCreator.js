import Chart from "chart.js";

export const chartCreate = (chartId, chartData) => {
  const ctx = document.getElementById(chartId);
  const myChart = new Chart(ctx, {
    type: chartData.type,
    data: chartData.data,
    options: chartData.options
  });
  return myChart;
};

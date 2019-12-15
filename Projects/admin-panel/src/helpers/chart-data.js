export const chartBuilder = (type, data, labels, label) => {
  const chartData = {
    type: type, //'bar'
    data: {
      labels, // ["Dollar", "Euro", "Yen", "Yuan", "Shekel"],
      datasets: [
        {
          label, // "Currency"
          data, // [12, 67, 62, 27, 14]
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)"
          ],
          borderColor: ["#36495d", "#36495d", "#36495d", "#36495d", "#36495d"],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      lineTension: 1,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              padding: 25
            }
          }
        ]
      }
    }
  };
  return chartData;
};

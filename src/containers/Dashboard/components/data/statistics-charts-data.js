import { chartsConfig } from "../../../../configs/charts-config";


const completedTaskChart = {
  type: "line",
  height: 220,

  options: {
    ...chartsConfig,
    colors: ["#388e3c"],
    stroke: {
      lineCap: "round",
    },
    markers: {
      size: 5,
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  },
};


const completedTasksChart = {
  ...completedTaskChart,
  series: [
    {
      name: "Số bài",
      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    },
  ],
};

export const statisticsChartsData = [
  {
    color: "white",
    title: "Thống kê bài đăng",
    description: "Thống kê bài đăng từng tháng trong năm",
    footer: "Mới cập nhật",
    chart: completedTasksChart,
  },
];

export default statisticsChartsData;
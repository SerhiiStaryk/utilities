import { LineChart as LineChartMui } from "@mui/x-charts/LineChart";

const gasData = {
  January: 0,
  February: 659.12,
  March: 309.95,
  April: 183.76,
  May: 26.27,
  June: 5.4,
  July: 3.07,
  August: 8.91,
  September: 27.22,
  October: 166.91,
  November: 877.86,
  December: 1161.81,
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const LineChart = () => {
  return (
    <LineChartMui
      xAxis={[
        {
          data: months,
          scaleType: "point",
          label: "Місяць",
        },
      ]}
      series={[
        {
          data: months.map((month) => gasData[month as keyof typeof gasData]),
          label: "Газ",
        },
      ]}
      height={300}
    />
  );
};

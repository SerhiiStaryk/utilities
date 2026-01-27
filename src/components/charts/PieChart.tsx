import { PieChart as PieChartMui } from "@mui/x-charts/PieChart";

const pieData = [
  { id: 0, value: 1161.81, label: "Газ" },
  { id: 1, value: 99.08, label: "Доставка газу" },
  { id: 2, value: 138.95, label: "Квартплата" },
  { id: 3, value: 163.92, label: "Світло" },
  { id: 4, value: 177.59, label: "Холодна вода" },
  { id: 5, value: 58.17, label: "Водовідведення" },
];

export const PieChart = () => {
  return <PieChartMui series={[{ data: pieData }]} height={300} />;
};

import { BarChart as BarChartMui } from "@mui/x-charts/BarChart";

interface BarChartProps {
  data: { category: string; value: number }[];
  label?: string;
}

export const BarChart = ({ data, label }: BarChartProps) => {
  return (
    <BarChartMui
      xAxis={[{ data: data.map((item) => item.category), scaleType: "band" }]}
      series={[{ data: data.map((item) => item.value), label: label }]}
      height={300}
    />
  );
};

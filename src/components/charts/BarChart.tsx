import { BarChart as BarChartMui } from "@mui/x-charts/BarChart";

interface BarChartProps {
  data: { category: string; value: number }[];
  label?: string;
}

export const BarChart = ({ data, label }: BarChartProps) => {
  return (
    <BarChartMui
      xAxis={[
        {
          data: data.map((item) => item.category),
          scaleType: "band",
          tickLabelStyle: {
            angle: 45,
            textAnchor: "start",
            fontSize: 10,
          },
        },
      ]}
      series={[{ data: data.map((item) => item.value), label: label }]}
      height={300}
      margin={{ bottom: 70, left: 60, right: 10, top: 20 }}
    />
  );
};

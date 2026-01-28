import { LineChart as LineChartMui } from "@mui/x-charts/LineChart";

interface LineChartProps {
  data: number[];
  labels: string[];
  seriesLabel?: string;
}

export const LineChart = ({ data, labels, seriesLabel = "Selected" }: LineChartProps) => {
  return (
    <LineChartMui
      xAxis={[
        {
          data: labels,
          scaleType: "point",
        },
      ]}
      series={[
        {
          data: data,
          label: seriesLabel,
        },
      ]}
      height={300}
    />
  );
};


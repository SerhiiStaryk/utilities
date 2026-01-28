import { BarChart } from "@mui/x-charts/BarChart";

interface BarChartAllProps {
  data: number[];
  labels: string[];
  seriesLabel?: string;
}

export default function BarChartAll({ data, labels, seriesLabel = "Selected" }: BarChartAllProps) {
  return (
    <BarChart
      xAxis={[
        {
          data: labels,
          scaleType: "band",
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
}


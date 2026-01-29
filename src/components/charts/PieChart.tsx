import { PieChart as PieChartMui } from "@mui/x-charts/PieChart";

interface PieChartProps {
  data: { id: number | string; value: number; label: string }[];
}

export const PieChart = ({ data }: PieChartProps) => {
  return (
    <PieChartMui
      series={[
        {
          data,
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          paddingAngle: 2,
          cornerRadius: 4,
        },
      ]}
      height={350}
      margin={{ top: 10, bottom: 100, left: 10, right: 10 }}
      slotProps={{
        legend: {
          direction: "row",
          position: { vertical: "bottom", horizontal: "middle" },
          padding: 0,

          labelStyle: {
            fontSize: 12,
          },
        },
      }}
    />
  );
};

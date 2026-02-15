import { PieChart as PieChartMui } from "@mui/x-charts/PieChart";
import { Box, useTheme, useMediaQuery } from "@mui/material";

interface PieChartProps {
  data: { id: number | string; value: number; label: string }[];
}

export const PieChart = ({ data }: PieChartProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const hasManyItems = data.length > 8;

  return (
    <Box sx={{ width: "100%", height: isMobile ? 300 : 350, position: "relative" }}>
      <PieChartMui
        series={[
          {
            data,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            paddingAngle: 2,
            cornerRadius: 6,
            innerRadius: 40,
            outerRadius: 80,
            cx: isMobile ? "50%" : hasManyItems ? "35%" : "50%",
            cy: isMobile ? "40%" : "50%",
          },
        ]}
        height={isMobile ? 300 : 350}
        margin={{
          top: 10,
          bottom: isMobile ? 80 : 10,
          left: 10,
          right: isMobile ? 10 : hasManyItems ? 180 : 10,
        }}
        slotProps={{
          legend: {
            hidden: data.length === 0,
            direction: isMobile ? "row" : "column",
            position: {
              vertical: isMobile ? "bottom" : "middle",
              horizontal: isMobile ? "middle" : "right",
            },
            itemMarkWidth: 8,
            itemMarkHeight: 8,
            markGap: 5,
            itemGap: isMobile ? 12 : data.length > 12 ? 4 : 8,
            labelStyle: {
              fontSize: isMobile ? 10 : data.length > 12 ? 9 : 11,
              fill: theme.palette.text.secondary,
            },
          },
        }}
      />
    </Box>
  );
};

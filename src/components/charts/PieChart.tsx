import { Box, useTheme, useMediaQuery } from "@mui/material";
import { PieChart as PieChartMui } from "@mui/x-charts/PieChart";

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
            highlightScope: { fade: "global", highlight: "item" },
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
            direction: (isMobile ? "row" : "column") as any,
            position: {
              vertical: isMobile ? "bottom" : "center",
              horizontal: isMobile ? "center" : "end",
            },
            sx: {
              // Adjust legend item mark size
              "& .MuiChartsLegend-itemMark": {
                width: 8,
                height: 8,
                marginRight: 1,
              },
              // Gap between mark and label
              "& .MuiChartsLegend-item": {
                gap: isMobile ? 12 : data.length > 12 ? 4 : 8,
                marginBottom: 4,
              },
              // Label styling
              "& .MuiChartsLegend-label": {
                fontSize: isMobile ? 10 : data.length > 12 ? 9 : 11,
                color: theme.palette.text.secondary,
              },
            },
          },
        }}
      />
    </Box>
  );
};

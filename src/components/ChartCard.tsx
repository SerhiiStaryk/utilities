import { Card, Box, Typography, CircularProgress, Grid } from "@mui/material";
import { GridSize } from "@mui/material/Grid";
import { ResponsiveStyleValue } from "@mui/system";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

type ChartCardProps = {
  chartTitle: string;
  dataLoading: boolean;
  chartCondition: boolean;
  size: ResponsiveStyleValue<GridSize>;
};

export const ChartCard = ({
  children,
  chartTitle,
  dataLoading,
  chartCondition,
  size,
}: PropsWithChildren<ChartCardProps>) => {
  const { t } = useTranslation();

  return (
    <Grid size={size}>
      <Card sx={{ height: "100%", minHeight: 400, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t(`${chartTitle}`)}
        </Typography>
        <Box sx={{ height: 350 }}>
          {dataLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : chartCondition ? (
            children
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", mt: 10 }}>
              {t("dashboard.charts.no_data", "No data available for charts")}
            </Typography>
          )}
        </Box>
      </Card>
    </Grid>
  );
};

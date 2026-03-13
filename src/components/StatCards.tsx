import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";

import { StatCard } from "@/components/StatCard";
import { DashboardType } from "@/hooks/useDashboardData";

type StatCardsProps = {
  dashboardType: DashboardType;
  stats: {
    total: number;
    filtered: number;
    avgMonthly: number;
    lastMonth: number;
  };
  dataLoading?: boolean;
  selectedYear: string | number;
};

export const StatCards = ({ dashboardType, stats, dataLoading, selectedYear }: StatCardsProps) => {
  const { t } = useTranslation();

  const formatValue = (value: number) => {
    if (dashboardType === "expenses") {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "UAH",
      }).format(value);
    }
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
    }).format(value);
  };

  const statsList = [
    {
      title:
        dashboardType === "expenses"
          ? t("dashboard.stats.total_spent")
          : t("dash.total_usage", "Разом спожито"),
      value: formatValue(stats.total),
    },
    {
      title:
        selectedYear === "all"
          ? t("dashboard.stats.filtered_spent", "Filtered Total")
          : dashboardType === "expenses"
            ? t("dashboard.stats.year_spent")
            : t("dash.year_usage", "Спожито за рік"),
      value: formatValue(stats.filtered),
    },
    {
      title: t("dashboard.stats.avg_monthly"),
      value: formatValue(stats.avgMonthly),
    },
    {
      title: t("dashboard.stats.last_month"),
      value: formatValue(stats.lastMonth),
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsList.map((stat, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={stat.title} value={stat.value} loading={dataLoading} />
        </Grid>
      ))}
    </Grid>
  );
};

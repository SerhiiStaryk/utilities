import { useEffect, useState } from "react";

import {
  Card,
  Box,
  Typography,
  CardContent,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  CircularProgress,
} from "@mui/material";
import { BarChart } from "../../components/charts/BarChart";
import { LineChart } from "../../components/charts/LineChart";
import { PieChart } from "../../components/charts/PieChart";
import BarChartAll from "../../components/charts/BarChartAll";
import { Add } from "@mui/icons-material";
import { CreateUtilityModal } from "../../components/modal/CreateUtilityModal";
import { getAddresses } from "../../firebase/firestore";
import { AddressDoc } from "../../types/firestore";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid2";
import { useDashboardData } from "../../hooks/useDashboardData";
import { MONTHS } from "../../constants/months";

const StatCard = ({ title, value, loading }: { title: string; value: string | number; loading?: boolean }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Typography color="textSecondary" gutterBottom variant="overline">
        {title}
      </Typography>
      {loading ? (
        <CircularProgress size={24} sx={{ mt: 1 }} />
      ) : (
        <Typography component="div" variant="h4">
          {value}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<{ id: string; data: AddressDoc }[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");

  const { stats, chartData, availableYears, availableServices, loading: dataLoading } = 
    useDashboardData(selectedAddress, selectedYear, selectedService);

  const [createUtilityOpen, setCreateUtilityOpen] = useState(false);

  const fetchAddresses = async () => {
    try {
      const list = await getAddresses();
      setAddresses(list);
      if (list.length > 0 && !selectedAddress) {
        setSelectedAddress(list[0].id);
      }
    } catch (e) {
      console.error("Failed to fetch addresses", e);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Reset year/service when address changes
  useEffect(() => {
    setSelectedYear("all");
    setSelectedService("all");
  }, [selectedAddress]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "UAH",
    }).format(value);
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        gap={2}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {t("dashboard.title")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("dashboard.overview", {
              address: selectedAddress || t("dashboard.all_addresses"),
            })}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={2}
          alignItems="center"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {/* Address Filter */}
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
            <InputLabel>{t("dashboard.current_address")}</InputLabel>
            <MuiSelect
              value={selectedAddress}
              label={t("dashboard.current_address")}
              onChange={(e) => setSelectedAddress(e.target.value)}
            >
              {addresses.map((addr) => (
                <MenuItem key={addr.id} value={addr.id}>
                  {addr.data.street} {addr.data.house_number}, {addr.data.city}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          {/* Year Filter */}
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 120 } }}>
            <InputLabel>{t("utility.year")}</InputLabel>
            <MuiSelect
              value={selectedYear}
              label={t("utility.year")}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <MenuItem value="all">{t("common.all")}</MenuItem>
              {availableYears.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          {/* Service Filter */}
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
            <InputLabel>{t("utility.service")}</InputLabel>
            <MuiSelect
              value={selectedService}
              label={t("utility.service")}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <MenuItem value="all">{t("common.all")}</MenuItem>
              {availableServices.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<Add />}
            disabled={!selectedAddress}
            onClick={() => setCreateUtilityOpen(true)}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {t("dashboard.add_utility")}
          </Button>
        </Stack>
      </Stack>

      <CreateUtilityModal
        open={createUtilityOpen}
        onClose={() => setCreateUtilityOpen(false)}
        addressId={selectedAddress}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("dashboard.stats.total_spent")}
            value={formatCurrency(stats.totalSpent)}
            loading={dataLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={selectedYear === "all" ? t("dashboard.stats.filtered_spent", "Filtered Total") : t("dashboard.stats.year_spent")}
            value={formatCurrency(stats.filteredSpent)}
            loading={dataLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("dashboard.stats.avg_monthly")}
            value={formatCurrency(stats.avgMonthly)}
            loading={dataLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("dashboard.stats.last_month")}
            value={formatCurrency(stats.lastMonthSpent)}
            loading={dataLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: "100%", minHeight: 400, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("dashboard.charts.performance")} {selectedService !== "all" ? `(${selectedService})` : ""}
            </Typography>
            <Box sx={{ height: 350 }}>
              {dataLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : chartData.lineData.length > 0 ? (
                <LineChart
                  data={chartData.lineData}
                  labels={MONTHS.map((m) => t(`utility.months.${m}`))}
                  seriesLabel={selectedService !== "all" ? selectedService : t("utility.amount")}
                />
              ) : (
                <Typography variant="body2" color="textSecondary" textAlign="center" mt={10}>
                  No data available for charts
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%", minHeight: 400, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("dashboard.charts.device_distribution")}
            </Typography>
            <Box
              sx={{
                height: 350,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {dataLoading ? (
                <CircularProgress />
              ) : chartData.pieData.length > 0 ? (
                <PieChart data={chartData.pieData} />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No data
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%", minHeight: 400, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("dashboard.charts.sales_category")}
            </Typography>
            <Box sx={{ height: 350 }}>
              {dataLoading ? (
                <CircularProgress />
              ) : chartData.barData.length > 0 ? (
                <BarChart data={chartData.barData} label={t("utility.service")} />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No data
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%", minHeight: 400, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("dashboard.charts.monthly_trends")}
            </Typography>
            <Box sx={{ height: 350 }}>
              {dataLoading ? (
                <CircularProgress />
              ) : chartData.monthlyTrend.length > 0 ? (
                <BarChartAll
                  data={chartData.monthlyTrend}
                  labels={MONTHS.map((m) => t(`utility.months.${m}`))}
                  seriesLabel={t("utility.amount")}
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No data
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};



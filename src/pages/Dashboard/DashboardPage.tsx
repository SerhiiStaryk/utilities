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
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { BarChart } from "../../components/charts/BarChart";
import { LineChart } from "../../components/charts/LineChart";
import { PieChart } from "../../components/charts/PieChart";
import BarChartAll from "../../components/charts/BarChartAll";
import { Add, Payment, Speed } from "@mui/icons-material";
import { CreateUtilityModal } from "../../components/modal/CreateUtilityModal";
import { getAddresses } from "../../firebase/firestore";
import { AddressDoc } from "../../types/firestore";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid2";
import { useDashboardData, DashboardType } from "../../hooks/useDashboardData";
import { MONTHS } from "../../constants/months";
import { useAuth } from "../../app/providers/AuthProvider";

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
  const [dashboardType, setDashboardType] = useState<DashboardType>("expenses");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");

  const { role, allowedAddresses } = useAuth();
  const isAdmin = role === "admin";

  const { stats, chartData, availableYears, availableServices, loading: dataLoading } = 
    useDashboardData(selectedAddress, dashboardType, selectedYear, selectedService);

  const [createUtilityOpen, setCreateUtilityOpen] = useState(false);


  const fetchAddresses = async () => {
    try {
      const allAddresses = await getAddresses();
      let filtered: { id: string; data: AddressDoc }[] = [];
      
      if (isAdmin) {
        filtered = allAddresses;
      } else {
        filtered = allAddresses.filter(addr => allowedAddresses?.includes(addr.id));
      }

      setAddresses(filtered);
      
      if (filtered.length > 0 && !selectedAddress) {
        setSelectedAddress(filtered[0].id);
      }
    } catch (e) {
      console.error("Failed to fetch addresses", e);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [isAdmin, allowedAddresses]);


  // Reset year/service when address changes
  useEffect(() => {
    setSelectedYear("all");
    setSelectedService("all");
  }, [selectedAddress, dashboardType]);

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
            {dashboardType === "expenses" ? t("utility.payments") : t("utility.meter_readings")} 
            {" — "}
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
          <ToggleButtonGroup
            color="primary"
            value={dashboardType}
            exclusive
            onChange={(_, newType) => newType && setDashboardType(newType)}
            size="small"
          >
            <ToggleButton value="expenses">
              <Payment sx={{ mr: 1 }} fontSize="small" />
              {t("dash.expenses", "Витрати")}
            </ToggleButton>
            <ToggleButton value="readings">
              <Speed sx={{ mr: 1 }} fontSize="small" />
              {t("dash.readings", "Споживання")}
            </ToggleButton>
          </ToggleButtonGroup>

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

          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<Add />}
              disabled={!selectedAddress}
              onClick={() => setCreateUtilityOpen(true)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {t("dashboard.add_utility")}
            </Button>
          )}
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
            title={dashboardType === "expenses" ? t("dashboard.stats.total_spent") : t("dash.total_usage", "Разом спожито")}
            value={formatValue(stats.total)}
            loading={dataLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={selectedYear === "all" ? t("dashboard.stats.filtered_spent", "Filtered Total") : (dashboardType === "expenses" ? t("dashboard.stats.year_spent") : t("dash.year_usage", "Спожито за рік"))}
            value={formatValue(stats.filtered)}
            loading={dataLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("dashboard.stats.avg_monthly")}
            value={formatValue(stats.avgMonthly)}
            loading={dataLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("dashboard.stats.last_month")}
            value={formatValue(stats.lastMonth)}
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
                  {t("dashboard.charts.no_data", "No data available for charts")}
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
                  {t("common.no_data", "No data")}
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
                  {t("common.no_data", "No data")}
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
                  {t("common.no_data", "No data")}
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};



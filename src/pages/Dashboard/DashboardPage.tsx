import { Payment, Speed } from "@mui/icons-material";
import {
  Box,
  Typography,
  Stack,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/app/providers/AuthProvider";
import { BarChart } from "@/components/charts/BarChart";
import BarChartAll from "@/components/charts/BarChartAll";
import { LineChart } from "@/components/charts/LineChart";
import { PieChart } from "@/components/charts/PieChart";
import { StatCards } from "@/components/StatCards";
import { MONTHS } from "@/constants/months";
import { getAddresses } from "@/firebase/firestore";
import { getLocalStorage, setLocalStorage } from "@/helpers/localStorage";
import { useDashboardData, DashboardType } from "@/hooks/useDashboardData";
import { AddressDoc } from "@/types/firestore";
import { FilterSearch } from '@/components/FilterSearch';
import { ChartCard } from '@/components/ChartCard';

export const DashboardPage = () => {
  const [addresses, setAddresses] = useState<{ id: string; data: AddressDoc }[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    getLocalStorage("dashboard_selectedAddress") || "",
  );
  const [dashboardType, setDashboardType] = useState<DashboardType>(
    (getLocalStorage("dashboard_dashboardType") as DashboardType) || "expenses",
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    getLocalStorage("dashboard_selectedYear") || "all",
  );
  const [selectedService, setSelectedService] = useState<string>(
    getLocalStorage("dashboard_selectedService") || "all",
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getLocalStorage("dashboard_selectedMonth") || "all",
  );

  const { role, allowedAddresses } = useAuth();
  const { t } = useTranslation();

  const isAdmin = role === "admin";

  const {
    stats,
    chartData,
    availableYears,
    availableServices,
    loading: dataLoading,
  } = useDashboardData(
    selectedAddress,
    dashboardType,
    selectedYear,
    selectedService,
    selectedMonth,
  );

  const fetchAddresses = async () => {
    try {
      const allAddresses = await getAddresses();
      let filtered: { id: string; data: AddressDoc }[] = [];

      filtered = isAdmin
        ? allAddresses
        : allAddresses.filter((addr) => allowedAddresses?.includes(addr.id));

      setAddresses(filtered);

      if (filtered.length > 0 && !selectedAddress) {
        setSelectedAddress(filtered[0].id);
      }
    } catch (e) {
      console.error("Failed to fetch addresses", e);
    }
  };

  const filters = [
    {
      label: t("dashboard.current_address"),
      value: selectedAddress,
      hasAll: false,
      formControlStyle: { minWidth: { xs: "100%", sm: 150 } },
      handleChange: setSelectedAddress,
      options: addresses.map((addr) => (
        <MenuItem key={addr.id} value={addr.id}>
          {addr.data.street} {addr.data.house_number}, {addr.data.city}
        </MenuItem>
      )),
    },
    {
      label: t("utility.year"),
      value: selectedYear,
      formControlStyle: { minWidth: { xs: "100%", sm: 120 } },
      handleChange: setSelectedYear,
      options: availableYears.map((y) => (
        <MenuItem key={y} value={y}>
          {y}
        </MenuItem>
      )),
    },
    {
      label: t("utility.service"),
      value: selectedService,
      formControlStyle: { minWidth: { xs: "100%", sm: 150 } },
      handleChange: setSelectedService,
      options: availableServices.map((s) => (
        <MenuItem key={s} value={s}>
          {s}
        </MenuItem>
      )),
    },
    {
      label: t("utility.month"),
      value: selectedMonth,
      formControlStyle: { minWidth: { xs: "100%", sm: 150 } },
      handleChange: setSelectedMonth,
      options: MONTHS.map((m) => (
        <MenuItem key={m} value={m}>
          {m}
        </MenuItem>
      )),
    }
  ]

  useEffect(() => {
    fetchAddresses();
  }, [isAdmin, allowedAddresses]);

  useEffect(() => {
    if (selectedAddress) {
      setLocalStorage("dashboard_selectedAddress", selectedAddress);
      setLocalStorage("dashboard_dashboardType", dashboardType);
      setLocalStorage("dashboard_selectedYear", selectedYear);
      setLocalStorage("dashboard_selectedService", selectedService);
      setLocalStorage("dashboard_selectedMonth", selectedMonth);
    }
  }, [selectedAddress, dashboardType, selectedYear, selectedService, selectedMonth]);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="flex-start"
        mb={4}
        gap={2}
        flexWrap='wrap'
      >

        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={4}
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ width: "100%" }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {t("dashboard.title")}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {dashboardType === "expenses" ? t("utility.payments") : t("utility.meter_readings")}
            </Typography>
          </Box>
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
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={2}
          alignItems="center"
          flexWrap='wrap'
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {filters.map((filter) => (
            <FilterSearch
              key={filter.label}
              formControlStyle={filter.formControlStyle}
              value={filter.value}
              label={filter.label}
              handleChange={filter.handleChange}
              options={filter.options}
            />
          ))}
        </Stack>
      </Stack>

      <StatCards
        dashboardType={dashboardType}
        stats={stats}
        dataLoading={dataLoading}
        selectedYear={selectedYear}
      />

      <Grid container spacing={3}>
        <ChartCard
          chartTitle="dashboard.charts.performance"
          dataLoading={dataLoading}
          chartCondition={chartData.lineData.length > 0}
          size={{ xs: 12 }}
        >
          <LineChart
            data={chartData.lineData}
            labels={MONTHS.map((m) => t(`utility.months.${m}`))}
            seriesLabel={selectedService !== "all" ? selectedService : t("utility.amount")}
          />
        </ChartCard>

        <ChartCard
          chartTitle="dashboard.charts.device_distribution"
          dataLoading={dataLoading}
          chartCondition={chartData.pieData.length > 0}
          size={{ xs: 12 }}
        >
          <PieChart data={chartData.pieData} />
        </ChartCard>

        <ChartCard
          chartTitle="dashboard.charts.sales_category"
          dataLoading={dataLoading}
          chartCondition={chartData.barData.length > 0}
          size={{ xs: 12, md: 6 }}
        >
          <BarChart data={chartData.barData} label={t("utility.service")} />
        </ChartCard>

        <ChartCard
          chartTitle="dashboard.charts.monthly_trends"
          dataLoading={dataLoading}
          chartCondition={chartData.monthlyTrend.length > 0}
          size={{ xs: 12, md: 6 }}
        >
          <BarChartAll
            data={chartData.monthlyTrend}
            labels={MONTHS.map((m) => t(`utility.months.${m}`))}
            seriesLabel={t("utility.amount")}
          />
        </ChartCard>
      </Grid>
    </Box >
  );
};

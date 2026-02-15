import { useState, useEffect } from "react";
import {
  getAllUtilityServicesForYear,
  getYearsForAddress,
  getAllMeterReadingsForYear,
} from "../firebase/firestore";
import { UtilityService, MeterReadingService } from "../types/firestore";
import { MONTHS } from "../constants/months";
import { useTranslation } from "react-i18next";

export type DashboardType = "expenses" | "readings";

export const useDashboardData = (
  addressId: string,
  dashboardType: DashboardType = "expenses",
  selectedYearId: string = "all",
  selectedServiceId: string = "all",
  selectedMonth: string = "all",
) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableServices, setAvailableServices] = useState<string[]>([]);

  const [stats, setStats] = useState({
    total: 0,
    filtered: 0,
    avgMonthly: 0,
    lastMonth: 0,
  });

  const [chartData, setChartData] = useState<{
    lineData: number[];
    pieData: { id: number; value: number; label: string }[];
    barData: { category: string; value: number }[];
    monthlyTrend: number[];
  }>({
    lineData: [],
    pieData: [],
    barData: [],
    monthlyTrend: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!addressId) return;
      setLoading(true);
      try {
        const yearDocs = await getYearsForAddress(addressId);
        const yearIds = yearDocs.map((y) => y.id).sort((a, b) => b.localeCompare(a));
        setAvailableYears(yearIds);

        const targetYears = selectedYearId === "all" ? yearIds : [selectedYearId];

        let allFilteredData: (UtilityService | MeterReadingService)[] = [];
        let servicesList: string[] = [];

        const latestYearId = yearIds[0];
        if (latestYearId) {
          if (dashboardType === "expenses") {
            const sList = await getAllUtilityServicesForYear(addressId, latestYearId);
            servicesList = Array.from(new Set(sList.map((s) => s.name)));
          } else {
            const rList = await getAllMeterReadingsForYear(addressId, latestYearId);
            servicesList = Array.from(new Set(rList.map((r) => r.name)));
          }
          setAvailableServices(servicesList);
        }

        for (const yId of targetYears) {
          if (dashboardType === "expenses") {
            const data = await getAllUtilityServicesForYear(addressId, yId);
            allFilteredData = [...allFilteredData, ...data];
          } else {
            const data = await getAllMeterReadingsForYear(addressId, yId);
            allFilteredData = [...allFilteredData, ...data];
          }
        }

        let filteredTotal = 0;
        const itemTotals: Record<string, number> = {};
        const monthlyTotals: Record<string, number> = {};
        MONTHS.forEach((m) => (monthlyTotals[m] = 0));

        allFilteredData.forEach((item) => {
          if (
            selectedServiceId !== "all" &&
            item.id !== selectedServiceId &&
            item.name !== selectedServiceId
          )
            return;

          const itemName =
            item.name +
            (dashboardType === "readings"
              ? ` (#${(item as MeterReadingService).meter_number})`
              : "");
          if (!itemTotals[itemName]) itemTotals[itemName] = 0;

          if (dashboardType === "expenses") {
            const s = item as UtilityService;
            Object.entries(s.monthly_payments || {}).forEach(([month, p]) => {
              if (selectedMonth !== "all" && month !== selectedMonth) return;
              filteredTotal += p.amount || 0;
              itemTotals[itemName] += p.amount || 0;
              monthlyTotals[month] += p.amount || 0;
            });
          } else {
            const r = item as MeterReadingService;
            Object.entries(r.monthly_readings || {}).forEach(([month, rd]) => {
              if (selectedMonth !== "all" && month !== selectedMonth) return;
              const val = parseFloat(rd.value) || 0;
              filteredTotal += val;
              itemTotals[itemName] += val;
              monthlyTotals[month] += val;
            });
          }
        });

        const activeMonths = MONTHS.filter((m) => monthlyTotals[m] > 0);
        const lastMonth = activeMonths.length > 0 ? activeMonths[activeMonths.length - 1] : null;

        setStats({
          total: filteredTotal,
          filtered: filteredTotal,
          avgMonthly:
            activeMonths.length > 0
              ? filteredTotal /
                (activeMonths.length * (selectedYearId === "all" ? yearIds.length : 1))
              : 0,
          lastMonth: lastMonth ? monthlyTotals[lastMonth] : 0,
        });

        const pieDataRaw = Object.entries(itemTotals)
          .map(([name, val], index) => ({
            id: index,
            value: val,
            label: name,
          }))
          .sort((a, b) => b.value - a.value);

        let finalPieData = pieDataRaw;
        if (pieDataRaw.length > 10) {
          const topItems = pieDataRaw.slice(0, 8);
          const otherItems = pieDataRaw.slice(8);
          const othersValue = otherItems.reduce((acc, curr) => acc + curr.value, 0);
          finalPieData = [
            ...topItems,
            { id: 999, value: othersValue, label: t("common.others", "Інші") },
          ];
        }

        setChartData({
          lineData: MONTHS.map(
            (m) => monthlyTotals[m] / (selectedYearId === "all" ? yearIds.length : 1),
          ),
          pieData: finalPieData,
          barData: Object.entries(itemTotals).map(([name, val]) => ({
            category: name,
            value: val,
          })),
          monthlyTrend: MONTHS.map((m) => monthlyTotals[m]),
        });
      } catch (e) {
        console.error("Dashboard data fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addressId, dashboardType, selectedYearId, selectedServiceId, selectedMonth]);

  return { stats, chartData, availableYears, availableServices, loading };
};

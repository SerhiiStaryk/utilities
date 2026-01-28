import { useState, useEffect } from "react";
import { getAllUtilityServicesForYear, getYearsForAddress } from "../firebase/firestore";
import { UtilityService } from "../types/firestore";
import { MONTHS } from "../constants/months";

export const useDashboardData = (
  addressId: string,
  selectedYearId: string = "all",
  selectedServiceId: string = "all"
) => {
  const [loading, setLoading] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  
  const [stats, setStats] = useState({
    totalSpent: 0,
    filteredSpent: 0,
    avgMonthly: 0,
    lastMonthSpent: 0,
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
        
        let allFilteredServices: UtilityService[] = [];
        let servicesForYearList: string[] = [];


        // Determine which services to look at for the current year context (for availableServices list)
        // If "all years" selected, we maybe show union of services? Let's just use the latest year's services for the list
        const latestYearId = yearIds[0];
        if (latestYearId) {
          const sList = await getAllUtilityServicesForYear(addressId, latestYearId);
          servicesForYearList = Array.from(new Set(sList.map((s) => s.name)));
          setAvailableServices(servicesForYearList);
        }

        // Fetching data for filtered view
        for (const yId of targetYears) {
          const services = await getAllUtilityServicesForYear(addressId, yId);
          allFilteredServices = [...allFilteredServices, ...services];
        }

        // Calculate Stats
        let filteredTotal = 0;
        const serviceTotals: Record<string, number> = {};
        const monthlyTotals: Record<string, number> = {};
        MONTHS.forEach((m) => (monthlyTotals[m] = 0));

        allFilteredServices.forEach((s) => {
          if (selectedServiceId !== "all" && s.id !== selectedServiceId && s.name !== selectedServiceId) return;

          if (!serviceTotals[s.name]) serviceTotals[s.name] = 0;
          
          Object.entries(s.monthly_payments).forEach(([month, p]) => {
            filteredTotal += p.amount;
            serviceTotals[s.name] += p.amount;
            monthlyTotals[month] += p.amount;
          });
        });

        // Calculate Overall Total (unfiltered across all years/services) for comparison if needed
        // But let's keep it simple: total is sum of what's currently being viewed
        
        const activeMonths = MONTHS.filter((m) => monthlyTotals[m] > 0);
        const lastMonth = activeMonths.length > 0 ? activeMonths[activeMonths.length - 1] : null;

        setStats({
          totalSpent: filteredTotal, // For ahora, total is the filtered total
          filteredSpent: filteredTotal,
          avgMonthly: activeMonths.length > 0 ? filteredTotal / (activeMonths.length * (selectedYearId === 'all' ? yearIds.length : 1)) : 0,
          lastMonthSpent: lastMonth ? monthlyTotals[lastMonth] : 0,
        });

        setChartData({
          lineData: MONTHS.map((m) => monthlyTotals[m] / (selectedYearId === 'all' ? yearIds.length : 1)), // Average per month across years if all years
          pieData: Object.entries(serviceTotals).map(([name, val], index) => ({
            id: index,
            value: val,
            label: name,
          })),
          barData: Object.entries(serviceTotals).map(([name, val]) => ({
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
  }, [addressId, selectedYearId, selectedServiceId]);

  return { stats, chartData, availableYears, availableServices, loading };
};


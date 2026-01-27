import { BarChart as BarChartMui } from '@mui/x-charts/BarChart';

const barData = [
  { category: 'Газ', value: 1161.81 },
  { category: 'Доставка газу', value: 99.08 },
  { category: 'Квартплата', value: 138.95 },
  { category: 'Світло', value: 163.92 },
  { category: 'Холодна вода', value: 177.59 },
  { category: 'Водовідведення', value: 58.17 },
];

export const BarChart = () => {
  return (
    <BarChartMui
      xAxis={[{ data: barData.map(item => item.category), scaleType: 'band' }]}
      series={[{ data: barData.map(item => item.value), label: 'Грудень' }]}
      height={300}
    />
  );
};

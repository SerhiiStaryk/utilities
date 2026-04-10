export const DRAWER_WIDTH = 240;

export const addresses = [
  {
    value: "Mazepy",
    label: "Мазепи",
  },
  {
    value: "Levandivska",
    label: "Левандівська",
  },
  {
    value: "Dashkevicha",
    label: "Дашкевича",
  },
  {
    value: "Haidamatska",
    label: "Гайдамацька",
  },
];

export const utilityServices = [
  {
    value: "electricity",
    label: "Світло",
  },
  {
    value: "cold_water",
    label: "Холодна вода",
  },
  {
    value: "hot_water",
    label: "Гаряча вода",
  },
  {
    value: "heating",
    label: "Центральне опалення",
  },
  {
    value: "kvartplata_osbb",
    label: "Квартплата (ОСББ)",
  },
  {
    value: "gas",
    label: "Газ",
  },
  {
    value: "gas_delivery",
    label: "Доставка газу",
  },
  {
    value: "sweet_tv",
    label: "SweetTV",
  },
  {
    value: "intercom",
    label: "Домофон",
  },
  {
    value: "internet",
    label: "Інтернет",
  },
];

import { MONTHS_META } from "./months";

// Export months metadata referencing centralized `MONTHS_META`.
// `label` contains i18n key (e.g. `utility.months.january`) — components should call `t()`.
export const months = MONTHS_META.map((m) => ({ value: m.id, label: m.key }));

export const currencies = [
  { value: "UAH", label: "грн." },
  { value: "USD", label: "дол." },
  { value: "EUR", label: "євро" },
];

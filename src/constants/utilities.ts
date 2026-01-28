import { currencies } from ".";
import { DefaultValuesUtilityForm } from "../types/utilities";

export const defaultValuesUtilityForm: DefaultValuesUtilityForm = {
  currency: currencies[0].value,
  accountNumber: "",
  january: 0,
  february: 0,
  march: 0,
  april: 0,
  may: 0,
  june: 0,
  july: 0,
  august: 0,
  september: 0,
  october: 0,
  november: 0,
  december: 0,
};

export enum UtilityType {
  HOA = 'hoa',
  ELECTRICITY = 'electricity',
  COLD_WATER = 'cold_water',
  HOT_WATER = 'hot_water',
  HEATING = 'heating',
  GAS = 'gas',
  GAS_DELIVERY = 'gas_delivery',
  GAS_SERVICE = 'gas_service',
  SWEET_TV = 'sweet_tv',
  INTERCOM = 'intercom',
  INTERNET = 'internet',
}

import { Month } from "../../../constants/months";
import { UtilityType } from "../../../constants/utilities";
import { ID, Timestamp } from "../../../types/common";

export interface MonthlyPayment {
  month: Month;
  amount: number | null; // null якщо не оплачено/нема даних
  note?: string; // опціонально
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface UtilityServiceYear {
  id: ID;
  utilityType: UtilityType;
  accountNumber?: string;
  year: number;
  payments: Record<Month, MonthlyPayment>;
}

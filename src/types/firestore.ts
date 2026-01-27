export interface MonthPayment {
  amount: string;
  currency: string;
}

export interface MonthlyPayments {
  january: MonthPayment;
  february: MonthPayment;
  march: MonthPayment;
  april: MonthPayment;
  may: MonthPayment;
  june: MonthPayment;
  july: MonthPayment;
  august: MonthPayment;
  september: MonthPayment;
  october: MonthPayment;
  november: MonthPayment;
  december: MonthPayment;
}

export interface UtilityService {
  id?: string;
  name: string;
  account_number: string;
  monthly_payments: MonthlyPayments;
}

export interface AddressDoc {
  street: string;
  house_number: string;
  flat_number: string;
  city: string;
  services?: (string | { name: string; accountNumber: string })[];
}

export interface YearDoc {
  year: number;
}

export interface UtilityDataPayload {
  addressId: string;
  yearId: string;
  serviceId: string;
  addressDoc: AddressDoc;
  accountNumber: string;
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
  currency: string;
}

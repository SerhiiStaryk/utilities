import { UtilityServiceYear } from "@/features/utilities/utils/utility.types";
import { ID } from "@/types/common";

export interface AddressYear {
  id: ID;
  addressId: ID;
  year: number;
  services: UtilityServiceYear[];
}

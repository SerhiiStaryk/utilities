import { ID } from "../../../types/common";
import { UtilityServiceYear } from "../../utilities/utils/utility.types";

export interface AddressYear {
  id: ID;
  addressId: ID;
  year: number;
  services: UtilityServiceYear[];
}

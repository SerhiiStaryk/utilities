import { collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase/firebase.config";
import * as coreFirestore from "@/firebase/firestore";

export async function getCategories(addressId: string, yearId: string) {
  if (!addressId || !yearId) return [];
  const col = collection(db, "addresses", addressId, "years", yearId, "categories");
  const snap = await getDocs(col);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export const getYearsForAddress = coreFirestore.getYearsForAddress;
export const getAllUtilityServicesForYear = coreFirestore.getAllUtilityServicesForYear;

export default {
  getCategories,
  getYearsForAddress,
  getAllUtilityServicesForYear,
};

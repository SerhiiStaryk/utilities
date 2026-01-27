import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { AddressDoc, UtilityDataPayload, UtilityService, YearDoc } from "../types/firestore";

const db = getFirestore();

// --- Create / Update ---

export async function addAddress(id: string, data: AddressDoc) {
  try {
    const addressRef = doc(db, "addresses", id);
    await setDoc(addressRef, data, { merge: true });
    alert(`Address ${id} created/updated successfully`);
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
}

export async function addUtilityData({
  addressId,
  yearId,
  serviceId,
  addressDoc,
  accountNumber,
  january,
  february,
  march,
  april,
  may,
  june,
  july,
  august,
  september,
  october,
  november,
  december,
  currency,
}: UtilityDataPayload) {
  try {
    // 1. Create/Update Address Document
    const addressRef = doc(db, "addresses", addressId);
    await setDoc(addressRef, addressDoc, { merge: true });

    // 2. Create/Update Year Document
    const yearRef = doc(db, "addresses", addressId, "years", yearId);
    await setDoc(yearRef, { year: parseInt(yearId) }, { merge: true });

    // 3. Create/Update Service Document
    const serviceRef = doc(
      db,
      "addresses",
      addressId,
      "years",
      yearId,
      "utility_services",
      serviceId,
    );

    const payload = {
      name: serviceId,
      account_number: accountNumber,
      monthly_payments: {
        january: { amount: january, currency },
        february: { amount: february, currency },
        march: { amount: march, currency },
        april: { amount: april, currency },
        may: { amount: may, currency },
        june: { amount: june, currency },
        july: { amount: july, currency },
        august: { amount: august, currency },
        september: { amount: september, currency },
        october: { amount: october, currency },
        november: { amount: november, currency },
        december: { amount: december, currency },
      },
    };

    await setDoc(serviceRef, payload);
    alert(`Utility data for ${serviceId} in ${yearId} added/updated successfully`);
  } catch (error) {
    console.error("Error adding utility data: ", error);
    throw error;
  }
}

// --- Read ---

export async function getAddresses(): Promise<{ id: string; data: AddressDoc }[]> {
  const addressesCol = collection(db, "addresses");
  const snapshot = await getDocs(addressesCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data() as AddressDoc,
  }));
}

export async function getYearsForAddress(
  addressId: string,
): Promise<{ id: string; data: YearDoc }[]> {
  const yearsCol = collection(db, "addresses", addressId, "years");
  const snapshot = await getDocs(yearsCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data() as YearDoc,
  }));
}

export async function getAllUtilityServicesForYear(
  addressId: string,
  yearId: string,
): Promise<UtilityService[]> {
  const servicesCol = collection(db, "addresses", addressId, "years", yearId, "utility_services");
  const snapshot = await getDocs(servicesCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as UtilityService[];
}

export async function getSpecificUtilityServiceData(
  addressId: string,
  yearId: string,
  serviceId: string,
): Promise<UtilityService | null> {
  const serviceRef = doc(
    db,
    "addresses",
    addressId,
    "years",
    yearId,
    "utility_services",
    serviceId,
  );
  const snapshot = await getDoc(serviceRef);

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as UtilityService;
  } else {
    console.warn(`No service found: ${serviceId}`);
    return null;
  }
}

// --- Delete ---

export async function deleteUtilityService(addressId: string, yearId: string, serviceId: string) {
  try {
    const serviceRef = doc(
      db,
      "addresses",
      addressId,
      "years",
      yearId,
      "utility_services",
      serviceId,
    );
    await deleteDoc(serviceRef);
    alert(`Deleted service: ${serviceId}`);
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}

/**
 * Deletes a Year document and all its containing Utility Services.
 * Note: Firestore defines that deleting a parent does NOT delete subcollections.
 * We must manually delete the subcollection documents first.
 */
export async function deleteYearAndServices(addressId: string, yearId: string) {
  try {
    // 1. Get all services in this year
    const services = await getAllUtilityServicesForYear(addressId, yearId);

    // 2. Delete each service
    const deletePromises = services.map((service) =>
      deleteUtilityService(addressId, yearId, service.id || service.name),
    );
    await Promise.all(deletePromises);

    // 3. Delete the year document itself
    const yearRef = doc(db, "addresses", addressId, "years", yearId);
    await deleteDoc(yearRef);
    alert(`Deleted year: ${yearId}`);
  } catch (error) {
    console.error("Error deleting year:", error);
    throw error;
  }
}

export async function getAddress(id: string): Promise<AddressDoc | null> {
  const addressRef = doc(db, "addresses", id);
  const snapshot = await getDoc(addressRef);
  if (snapshot.exists()) {
    return snapshot.data() as AddressDoc;
  }
  return null;
}

export async function deleteAddress(id: string) {
  try {
    const addressRef = doc(db, "addresses", id);
    await deleteDoc(addressRef);
    alert(`Address ${id} deleted`);
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
}

export async function updateUtilityService(
  addressId: string,
  yearId: string,
  serviceId: string,
  data: Partial<UtilityService>,
) {
  try {
    const serviceRef = doc(
      db,
      "addresses",
      addressId,
      "years",
      yearId,
      "utility_services",
      serviceId,
    );
    await setDoc(serviceRef, data, { merge: true });
    alert(`Service ${serviceId} updated successfully`);
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}
export async function createYearWithServices(
  addressId: string,
  yearId: string,
  services: (string | { name: string; accountNumber: string })[],
) {
  try {
    // 1. Create/Update Year Document
    const yearRef = doc(db, "addresses", addressId, "years", yearId);
    await setDoc(yearRef, { year: parseInt(yearId) }, { merge: true });

    // 2. Create Service Documents
    const promises = services.map((service) => {
      const isString = typeof service === "string";
      const serviceName = isString ? service : service.name;
      const accountNumber = isString ? "" : service.accountNumber;

      const serviceRef = doc(
        db,
        "addresses",
        addressId,
        "years",
        yearId,
        "utility_services",
        serviceName,
      );
      // Initialize with empty payments or defaults
      return setDoc(serviceRef, {
        name: serviceName,
        account_number: accountNumber,
        monthly_payments: {},
      });
    });

    await Promise.all(promises);
    alert(`Year ${yearId} created with services`);
  } catch (error) {
    console.error("Error creating year with services:", error);
    throw error;
  }
}

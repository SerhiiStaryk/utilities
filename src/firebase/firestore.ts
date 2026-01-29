import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import {
  AddressDoc,
  UtilityDataPayload,
  UtilityService,
  YearDoc,
  ReadingDataPayload,
  MeterReadingService,
} from "../types/firestore";

const db = getFirestore();

// --- Create / Update ---

export async function addAddress(id: string, data: AddressDoc) {
  try {
    const addressRef = doc(db, "addresses", id);
    await setDoc(addressRef, data, { merge: true });
    toast.success(`Address ${id} created/updated successfully`);
  } catch (error) {
    console.error("Error adding address:", error);
    toast.error(`Error adding address: ${id}`);
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
    if (!addressId || !yearId || !serviceId) {
      throw new Error("Missing required parameters: addressId, yearId, or serviceId");
    }

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

    const monthlyPayments = {
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
    };

    const monthly_payments = Object.fromEntries(
      Object.entries(monthlyPayments)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, amount]) => amount !== "" && amount !== undefined)
        .map(([month, amount]) => [month, { amount: amount, currency }]),
    );

    const payload = {
      name: serviceId,
      account_number: accountNumber,
      monthly_payments,
    };

    await setDoc(serviceRef, payload);
    toast.success(`Utility data for ${serviceId} in ${yearId} added/updated successfully`);
  } catch (error) {
    console.error("Error adding utility data: ", error);
    toast.error("Error adding utility data");
    throw error;
  }
}

export async function addMeterReadingData({
  addressId,
  yearId,
  serviceId,
  meter_number,
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
}: ReadingDataPayload) {
  try {
    const docId = `${serviceId}_${meter_number}`.replace(/\s+/g, "_");
    const readingRef = doc(db, "addresses", addressId, "years", yearId, "meter_readings", docId);

    const payload = {
      name: serviceId,
      meter_number,
      monthly_readings: {
        january: { value: january },
        february: { value: february },
        march: { value: march },
        april: { value: april },
        may: { value: may },
        june: { value: june },
        july: { value: july },
        august: { value: august },
        september: { value: september },
        october: { value: october },
        november: { value: november },
        december: { value: december },
      },
    };

    await setDoc(readingRef, payload);
    toast.success(`Meter reading for ${serviceId} (#${meter_number}) added successfully`);
  } catch (error) {
    console.error("Error adding meter reading data: ", error);
    toast.error("Error adding meter reading data");
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

export async function getAllMeterReadingsForYear(
  addressId: string,
  yearId: string,
): Promise<MeterReadingService[]> {
  const readingsCol = collection(db, "addresses", addressId, "years", yearId, "meter_readings");
  const snapshot = await getDocs(readingsCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MeterReadingService[];
}

export async function getSpecificMeterReadingData(
  addressId: string,
  yearId: string,
  serviceId: string,
): Promise<MeterReadingService | null> {
  const readingRef = doc(db, "addresses", addressId, "years", yearId, "meter_readings", serviceId);
  const snapshot = await getDoc(readingRef);

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as MeterReadingService;
  } else {
    console.warn(`No reading found: ${serviceId}`);
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
    toast.success(`Deleted service: ${serviceId}`);
  } catch (error) {
    console.error("Error deleting service:", error);
    toast.error(`Error deleting service: ${serviceId}`);
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
    toast.success(`Deleted year: ${yearId}`);
  } catch (error) {
    console.error("Error deleting year:", error);
    toast.error(`Error deleting year: ${yearId}`);
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
    toast.success(`Address ${id} deleted`);
  } catch (error) {
    console.error("Error deleting address:", error);
    toast.error(`Error deleting address: ${id}`);
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
    toast.success(`Service ${serviceId} updated successfully`);
  } catch (error) {
    console.error("Error updating service:", error);
    toast.error(`Error updating service: ${serviceId}`);
    throw error;
  }
}

export async function updateMeterReading(
  addressId: string,
  yearId: string,
  serviceId: string,
  data: Partial<MeterReadingService>,
) {
  try {
    const readingRef = doc(
      db,
      "addresses",
      addressId,
      "years",
      yearId,
      "meter_readings",
      serviceId,
    );
    await setDoc(readingRef, data, { merge: true });
    toast.success(`Meter reading ${serviceId} updated successfully`);
  } catch (error) {
    console.error("Error updating meter reading:", error);
    toast.error("Error updating meter reading");
    throw error;
  }
}

export async function deleteMeterReading(addressId: string, yearId: string, serviceId: string) {
  try {
    const readingRef = doc(
      db,
      "addresses",
      addressId,
      "years",
      yearId,
      "meter_readings",
      serviceId,
    );
    await deleteDoc(readingRef);
    toast.success(`Deleted reading for: ${serviceId}`);
  } catch (error) {
    console.error("Error deleting meter reading:", error);
    toast.error("Error deleting meter reading");
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
    toast.success(`Year ${yearId} created with services`);
  } catch (error) {
    console.error("Error creating year with services:", error);
    toast.error(`Error creating year: ${yearId}`);
    throw error;
  }
}

export async function addUtilityService(serviceName: string) {
  try {
    const serviceRef = doc(db, "utility_services", serviceName);
    await setDoc(serviceRef, { name: serviceName }, { merge: true });
    toast.success(`Utility service ${serviceName} added successfully`);
  } catch (error) {
    console.error("Error adding utility service: ", error);
    toast.error("Error adding utility service");
    throw error;
  }
}

// --- User Management ---

export async function getUsers(): Promise<
  { id: string; role: string; email: string; allowedAddresses?: string[] }[]
> {
  const usersCol = collection(db, "users");
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { role: string; email: string; allowedAddresses?: string[] }),
  }));
}

export async function updateUserRole(uid: string, role: "admin" | "user") {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { role }, { merge: true });
    toast.success(`User role updated to ${role}`);
  } catch (error) {
    console.error("Error updating user role:", error);
    toast.error("Error updating user role");
    throw error;
  }
}

export async function updateAllowedAddresses(uid: string, addresses: string[]) {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { allowedAddresses: addresses }, { merge: true });
  } catch (error) {
    console.error("Error updating allowed addresses:", error);
    throw error;
  }
}

export async function syncUserProfile(
  uid: string,
  data: { displayName?: string; photoURL?: string },
) {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    console.error("Error syncing user profile:", error);
    throw error;
  }
}

export async function getUserSettings(uid: string) {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().settings || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
}

export async function updateUserSettings(uid: string, settings: any) {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { settings }, { merge: true });
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
}

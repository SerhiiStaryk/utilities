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
  RentalInfo,
  RentalPayment,
} from "../types/firestore";

const db = getFirestore();

// --- Rental Management ---

export async function updateRentalInfo(addressId: string, rentalInfo: RentalInfo) {
  try {
    const addressRef = doc(db, "addresses", addressId);
    await setDoc(addressRef, { rental_info: rentalInfo }, { merge: true });
    toast.success("Rental information updated");
  } catch (error) {
    console.error("Error updating rental info:", error);
    toast.error("Error updating rental info");
    throw error;
  }
}

export async function addRentalPayment(addressId: string, payment: RentalPayment) {
  try {
    const addressRef = doc(db, "addresses", addressId);
    const snapshot = await getDoc(addressRef);
    if (snapshot.exists()) {
      const currentData = snapshot.data() as AddressDoc;
      const currentRental = currentData.rental_info;
      const updatedPayments = [...(currentRental?.payments || []), payment];
      await setDoc(
        addressRef,
        { rental_info: { ...currentRental, payments: updatedPayments } },
        { merge: true },
      );
      toast.success("Payment added successfully");
    }
  } catch (error) {
    console.error("Error adding rental payment:", error);
    toast.error("Error adding rental payment");
    throw error;
  }
}


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
        .map(([month, amount]) => [month, { amount: Number(amount), currency }]),
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
  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      data: doc.data() as YearDoc,
    }))
    .sort((a, b) => (b.data.year || 0) - (a.data.year || 0));
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

export async function getAddressBackupData(addressId: string) {
  const address = await getAddress(addressId);
  if (!address) return null;

  const years = await getYearsForAddress(addressId);
  const yearsWithData = await Promise.all(
    years.map(async (year) => {
      const services = await getAllUtilityServicesForYear(addressId, year.id);
      const readings = await getAllMeterReadingsForYear(addressId, year.id);
      return {
        ...year.data,
        id: year.id,
        utility_services: services,
        meter_readings: readings,
      };
    }),
  );

  return {
    ...address,
    id: addressId,
    years: yearsWithData,
    backup_date: new Date().toISOString(),
  };
}

export async function restoreAddressFromBackup(backupData: any) {
  try {
    const { id, years, backup_date, ...addressInfo } = backupData;
    if (!id) throw new Error("Invalid backup data: missing address ID");

    // 1. Restore address doc
    const addressRef = doc(db, "addresses", id);
    await setDoc(addressRef, addressInfo as AddressDoc, { merge: true });

    // 2. Restore years and their subcollections
    if (years && Array.isArray(years)) {
      for (const yearData of years) {
        const { id: yearId, utility_services, meter_readings, ...yearInfo } = yearData;
        const yearRef = doc(db, "addresses", id, "years", yearId);
        await setDoc(yearRef, yearInfo, { merge: true });

        // Restore services
        if (utility_services && Array.isArray(utility_services)) {
          for (const service of utility_services) {
            const { id: serviceId, ...serviceData } = service;
            const serviceRef = doc(
              db,
              "addresses",
              id,
              "years",
              yearId,
              "utility_services",
              serviceId || service.name,
            );
            await setDoc(serviceRef, serviceData, { merge: true });
          }
        }

        // Restore readings
        if (meter_readings && Array.isArray(meter_readings)) {
          for (const reading of meter_readings) {
            const { id: readingId, ...readingData } = reading;
            const readingRef = doc(
              db,
              "addresses",
              id,
              "years",
              yearId,
              "meter_readings",
              readingId || `${reading.name}_${reading.meter_number}`.replace(/\s+/g, "_"),
            );
            await setDoc(readingRef, readingData, { merge: true });
          }
        }
      }
    }
    toast.success(`Address ${id} restored successfully from backup of ${backup_date}`);
  } catch (error) {
    console.error("Error restoring from backup:", error);
    toast.error("Failed to restore from backup");
    throw error;
  }
}

export async function getGlobalBackupData() {
  const addresses = await getAddresses();
  const globalData = await Promise.all(
    addresses.map(async (addr) => {
      return await getAddressBackupData(addr.id);
    }),
  );

  return {
    addresses: globalData,
    backup_date: new Date().toISOString(),
    version: "1.0",
  };
}

export async function restoreGlobalFromBackup(backupData: any) {
  try {
    const { addresses, backup_date } = backupData;
    if (!addresses || !Array.isArray(addresses)) {
      throw new Error("Invalid global backup data");
    }

    for (const addrData of addresses) {
      await restoreAddressFromBackup(addrData);
    }
    toast.success(`Global backup from ${backup_date} restored successfully`);
  } catch (error) {
    console.error("Global restore error:", error);
    toast.error("Failed to restore global backup");
    throw error;
  }
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
    // 1. Check if Year Document already exists
    const yearRef = doc(db, "addresses", addressId, "years", yearId);
    const yearSnap = await getDoc(yearRef);

    if (yearSnap.exists()) {
      toast.error(`Рік ${yearId} вже існує`);
      throw new Error(`Year ${yearId} already exists`);
    }

    // 2. Create/Update Year Document
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
  { id: string; role: string; email: string; allowedAddresses?: string[]; allowedPages?: string[] }[]
> {
  const usersCol = collection(db, "users");
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as {
      role: string;
      email: string;
      allowedAddresses?: string[];
      allowedPages?: string[];
    }),
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
export async function updateAllowedPages(uid: string, pages: string[]) {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { allowedPages: pages }, { merge: true });
  } catch (error) {
    console.error("Error updating allowed pages:", error);
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

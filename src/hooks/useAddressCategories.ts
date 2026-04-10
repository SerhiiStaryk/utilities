import { useEffect, useState } from "react";

import { getCategories } from "@/services/firestore/addresses";

export const useAddressCategories = (
  addressId?: string,
  yearId?: string,
): {
  data: any[];
  loading: boolean;
  error: any | null;
} => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      if (!addressId || !yearId) return;
      setLoading(true);
      try {
        const res = await getCategories(addressId, yearId);
        if (!mounted) return;
        setData(res || []);
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, [addressId, yearId]);

  return { data, loading, error };
};

export default useAddressCategories;

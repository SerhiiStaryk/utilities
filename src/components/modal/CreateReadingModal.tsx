import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { ReadingForm } from "../forms/ReadingForm";
import { Box, Button, TextField } from "@mui/material";

import { addMeterReadingData, getAddress } from "../../firebase/firestore";
import { useTranslation } from "react-i18next";

interface CreateReadingModalProps {
  open: boolean;
  onClose: () => void;
  addressId: string;
  onSuccess?: () => void;
}

import { toast } from "react-toastify";

export const CreateReadingModal = ({
  open,
  onClose,
  addressId,
  onSuccess,
}: CreateReadingModalProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    if (addressId) {
      getAddress(addressId).then((addr) => {
        if (addr?.services) {
          const names = addr.services.map((s) => (typeof s === "string" ? s : s.name));
          setServices(names);
        }
      });
    }
  }, [addressId]);

  const handleSubmit = async (data: any) => {
    if (!addressId) return;
    setLoading(true);
    try {
      await addMeterReadingData({
        addressId,
        yearId: year,
        serviceId: data.serviceId,
        ...data,
      });
      onSuccess?.();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Failed to add meter reading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("utility.meter_readings", "Add Meter Reading")}
      footer={
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose}>{t("address.create.cancel")}</Button>
          <Button variant="contained" type="submit" form="create-reading-form" disabled={loading}>
            {loading ? "..." : t("utility.submit")}
          </Button>
        </Box>
      }
    >
      <Box mb={2}>
        <TextField
          label={t("utility.year", "Year")}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          fullWidth
          type="number"
          sx={{ mb: 2 }}
        />
      </Box>
      <ReadingForm
        id="create-reading-form"
        services={services}
        onSubmit={handleSubmit}
        showActions={false}
      />
    </Modal>
  );
};

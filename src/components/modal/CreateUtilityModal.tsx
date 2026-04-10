import { Button, Stack, Box, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { IconSelect } from "@/components/IconSelect";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { currencies } from "@/constants";
import { MONTHS, MONTHS_META } from "@/constants/months";
import { addUtilityData } from "@/firebase/firestore";
import { UtilityDataPayload } from "@/types/firestore";

import { GenericModal } from "./GenericModal";

interface CreateUtilityModalProps {
  open: boolean;
  onClose: () => void;
  addressId: string; // The ID of the address we are adding data to
  onSuccess?: () => void;
  addressData?: {
    street: string;
    house_number: string;
    flat_number: string;
    city: string;
  } | null;
  initialYear?: string;
}

export const CreateUtilityModal = ({
  open,
  onClose,
  addressId,
  onSuccess,
  addressData,
  initialYear,
}: CreateUtilityModalProps) => {
  const [disabledSubmit, setDisabledSubmit] = useState(false);

  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      yearId: "",
      serviceId: "",
      icon: "DefaultIcon",
      currency: "",
      accountNumber: "",
      ...MONTHS.reduce((acc: any, m) => {
        acc[m] = "";
        return acc;
      }, {}),
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        yearId: initialYear || "",
        serviceId: "",
        icon: "DefaultIcon",
        currency: "UAH",
        accountNumber: "",
        ...MONTHS.reduce((acc: any, m) => {
          acc[m] = "";
          return acc;
        }, {}),
      });
    }
  }, [open, initialYear, reset]);

  const onSubmit: SubmitHandler<{
    yearId: string;
    serviceId: string;
    icon: string;
    currency: string;
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
  }> = async (data) => {
    try {
      setDisabledSubmit(true);
      const { yearId, serviceId, icon, currency, accountNumber, ...monthsData } = data;

      const payload: UtilityDataPayload = {
        addressId,
        yearId,
        serviceId,
        icon,
        addressDoc: addressData ?? {
          street: "",
          house_number: "",
          flat_number: "",
          city: "",
        },
        currency,
        accountNumber,
        ...monthsData,
      };

      await addUtilityData(payload);

      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error("Error adding utility", e);
    } finally {
      setDisabledSubmit(false);
    }
  };

  return (
    <GenericModal
      title={t("utility.add_title", { address: addressId })}
      open={open}
      onClose={onClose}
      footer={
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose} color="inherit">
            {t("address.create.cancel")}
          </Button>
          <Button
            variant="contained"
            type="submit"
            form="create-utility-form"
            disabled={disabledSubmit}
          >
            {t("utility.submit")}
          </Button>
        </Box>
      }
    >
      <form id="create-utility-form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            {/* General Info Column */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                {t("utility.config")}
              </Typography>
              <Stack spacing={2}>
                <Controller
                  name="yearId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      label={t("utility.year")}
                      placeholder={t("utility.year_placeholder")}
                    />
                  )}
                />
                <Controller
                  name="serviceId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={t("utility.service")}
                      placeholder={t("utility.service_placeholder")}
                    />
                  )}
                />
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label={t("utility.currency")} options={currencies} />
                  )}
                />
                <Controller
                  name="accountNumber"
                  control={control}
                  render={({ field }) => <Input {...field} label={t("utility.account")} />}
                />
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <IconSelect
                      {...field}
                      value={field.value || "DefaultIcon"}
                      label={t("utility.icon")}
                    />
                  )}
                />
              </Stack>
            </Grid>

            {/* Monthly Data Column */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                {t("utility.monthly")}
              </Typography>
              <Grid container spacing={2}>
                {MONTHS.map((month) => (
                  <Grid key={month} size={6}>
                    <Controller
                      name={month}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} type="number" label={t(`utility.months.${month}`)} />
                      )}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </form>
    </GenericModal>
  );
};

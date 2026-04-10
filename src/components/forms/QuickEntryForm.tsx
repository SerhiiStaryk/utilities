import { Button, Box, Stack, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/Input";
import { Select as CustomSelect } from "@/components/Select";
import { currencies } from "@/constants";
import { MONTHS } from "@/constants/months";

type QuickEntryFormProps = {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  currentMonth: string;
  services: { name: string; accountNumber: string; monthly_payments?: any }[];
  showActions?: boolean;
  id?: string;
};

export const QuickEntryForm = ({
  onSubmit,
  onCancel,
  currentMonth,
  services,
  showActions = true,
  id,
}: QuickEntryFormProps) => {
  const { t } = useTranslation();
  // ... (useForm hook unchanged)
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      month: currentMonth,
      year: new Date().getFullYear().toString(),
      payments: services.map((s) => ({
        serviceId: s.name,
        accountNumber: s.accountNumber,
        amount: s.monthly_payments?.[currentMonth]?.amount || "",
        currency: s.monthly_payments?.[currentMonth]?.currency || "UAH",
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "payments",
  });

  const selectedMonth = useWatch({
    control,
    name: "month",
  });

  useEffect(() => {
    services.forEach((s, index) => {
      const payment = s.monthly_payments?.[selectedMonth];
      if (payment) {
        setValue(`payments.${index}.amount`, payment.amount || "");
        setValue(`payments.${index}.currency`, payment.currency || "UAH");
      } else {
        setValue(`payments.${index}.amount`, "");
      }
    });
  }, [selectedMonth, services, setValue]);

  const monthOptions = MONTHS.map((month) => ({
    value: month,
    label: t(`utility.months.${month}`, month),
  }));

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ mt: 2 }}>
        {/* ... (form body remains same) */}
        <Box>
          <Controller
            name="month"
            control={control}
            render={({ field }) => (
              <CustomSelect {...field} label={t("utility.month", "Month")} options={monthOptions} />
            )}
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            {t("utility.reporting_for", "Reporting for")}{" "}
            {t(`utility.months.${selectedMonth}`, selectedMonth)}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {fields.map((field, index) => (
            <Grid size={4} key={field.id}>
              <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  {field.serviceId}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mb: 1, color: "textSecondary" }}
                >
                  {field.accountNumber}
                </Typography>

                <Stack spacing={2}>
                  <Controller
                    name={`payments.${index}.amount`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} label={t("utility.amount")} placeholder="0.00" />
                    )}
                  />
                  <Controller
                    name={`payments.${index}.currency`}
                    control={control}
                    render={({ field }) => (
                      <CustomSelect {...field} label={t("utility.currency")} options={currencies} />
                    )}
                  />
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>

        {showActions && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button onClick={onCancel} color="inherit">
              {t("address.create.cancel")}
            </Button>
            <Button variant="contained" type="submit">
              {t("utility.submit")}
            </Button>
          </Box>
        )}
      </Stack>
    </form>
  );
};

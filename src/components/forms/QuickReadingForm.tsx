import { useForm, useFieldArray } from "react-hook-form";
import { Box, Button, Stack, Typography, MenuItem, TextField, Divider } from "@mui/material";
import { Input } from "../Input";
import { MONTHS } from "../../constants/months";
import { useTranslation } from "react-i18next";

interface QuickReadingFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  services: { name: string; meter_number: string }[];
  currentMonth: string;
  showActions?: boolean;
  id?: string;
}

export const QuickReadingForm = ({
  onSubmit,
  onCancel,
  services,
  currentMonth,
  showActions = true,
  id = "quick-reading-form",
}: QuickReadingFormProps) => {
  const { t } = useTranslation();

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      month: currentMonth,
      readings: services.map((s) => ({
        serviceId: s.name,
        meterNumber: s.meter_number,
        value: "",
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "readings",
  });

  return (
    <Box component="form" id={id} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          select
          label={t("utility.month")}
          {...register("month")}
          fullWidth
          defaultValue={currentMonth}
        >
          {MONTHS.map((m) => (
            <MenuItem key={m} value={m} sx={{ textTransform: "capitalize" }}>
              {t(`utility.months.${m}`)}
            </MenuItem>
          ))}
        </TextField>

        <Divider />

        <Stack spacing={2}>
          {fields.map((field, index) => (
            <Box
              key={field.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: "500" }}>{field.serviceId}</Typography>
                <Typography variant="caption" color="textSecondary">
                  #{field.meterNumber}
                </Typography>
                {/* Hidden fields to keep IDs and meter numbers in form data */}
                <input type="hidden" {...register(`readings.${index}.serviceId` as const)} />
                <input type="hidden" {...register(`readings.${index}.meterNumber` as const)} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Input
                  label={t("utility.amount", "Reading")}
                  type="number"
                  {...register(`readings.${index}.value` as const)}
                  fullWidth
                />
              </Box>
            </Box>
          ))}
        </Stack>

        {showActions && (
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            {onCancel && (
              <Button onClick={onCancel} color="inherit">
                {t("address.create.cancel")}
              </Button>
            )}
            <Button variant="contained" type="submit">
              {t("utility.submit")}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

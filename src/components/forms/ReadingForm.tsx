import { Box, Button, Stack, Typography, Autocomplete, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/Input";
import { MONTHS_META } from "@/constants/months";

interface ReadingFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialValues?: any;
  showActions?: boolean;
  id?: string;
  services?: string[];
}

export const ReadingForm = ({
  onSubmit,
  onCancel,
  initialValues,
  showActions = true,
  id = "reading-form",
  services = [],
}: ReadingFormProps) => {
  const { t } = useTranslation();

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: initialValues || {
      serviceId: "",
      meter_number: "",
      ...MONTHS_META.reduce((acc: any, month) => {
        acc[month.id] = "";
        return acc;
      }, {}),
    },
  });

  const selectedService = watch("serviceId");

  return (
    <Box component="form" id={id} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {services.length > 0 && (
          <Autocomplete
            options={services}
            value={selectedService}
            onChange={(_, newValue) => setValue("serviceId", newValue || "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("utility.service", "Service")}
                required
                variant="outlined"
              />
            )}
            fullWidth
          />
        )}

        <Input
          label={t("utility.meter_number", "Meter Number")}
          required
          {...register("meter_number")}
          fullWidth
        />

        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {t("utility.monthly", "Monthly Readings")}
        </Typography>

        <Grid container spacing={2}>
          {MONTHS_META.map((month) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={month.id}>
              <Input
                label={t(month.key, month.id)}
                placeholder="0.00"
                type="number"
                {...register(month.id)}
                fullWidth
              />
            </Grid>
          ))}
        </Grid>

        {showActions && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
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

import { Stack, Grid, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { IconSelect } from "@/components/IconSelect";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { currencies } from "@/constants";
import { MONTHS_META } from "@/constants/months";
import { defaultValuesUtilityForm } from "@/constants/utilities";
import { DefaultValuesUtilityForm } from "@/types/utilities";

interface UtilityFormProps {
  initialValues?: DefaultValuesUtilityForm;
  onSubmit: (data: unknown) => void;
  onCancel: () => void;
  showActions?: boolean;
  id?: string;
}

export const UtilityForm = ({ initialValues, onSubmit, id }: UtilityFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    defaultValues: initialValues || defaultValuesUtilityForm,
  });

  return (
    <Stack id={id} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ gap: 3, mt: 2 }}>
      <Grid container spacing={3}>
        {/* ... (grid body remains same) */}
        <Grid size={12}>
          <Typography variant="subtitle2" gutterBottom color="primary">
            {t("utility.monthly")}
          </Typography>
          <Grid container spacing={2}>
            {MONTHS_META.map((month) => (
              <Grid key={month.id} size={4}>
                <Controller
                  name={month.id}
                  control={control}
                  render={({ field }) => {
                    const { onChange, onBlur, name, ref, value } = field;
                    return (
                      <Input
                        name={name}
                        value={value !== undefined && value !== null ? String(value) : ""}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        ref={ref}
                        type="number"
                        label={t(month.key)}
                        sx={{
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                            {
                              display: "none",
                            },
                          "& input[type=number]": {
                            MozAppearance: "textfield",
                          },
                        }}
                      />
                    );
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid size={12}>
          <Typography variant="subtitle2" gutterBottom color="primary">
            {t("utility.config")}
          </Typography>
          <Stack sx={{ gap: 2 }}>
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
      </Grid>
    </Stack>
  );
};

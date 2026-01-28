import { Button, Box, Stack, Grid2, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "../Input";
import { Select } from "../Select";
import { currencies } from "../../constants";
import { defaultValuesUtilityForm } from "../../constants/utilities";
import { MONTHS } from "../../constants/months";
import { DefaultValuesUtilityForm } from "../../types/utilities";

interface UtilityFormProps {
  initialValues?: DefaultValuesUtilityForm;
  onSubmit: (data: unknown) => void;
  onCancel: () => void;
  showActions?: boolean;
  id?: string;
}

export const UtilityForm = ({
  initialValues,
  onSubmit,
  onCancel,
  showActions = true,
  id,
}: UtilityFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    defaultValues: initialValues || defaultValuesUtilityForm,
  });

  return (
    <Stack id={id} component="form" onSubmit={handleSubmit(onSubmit)} gap={3} sx={{ mt: 2 }}>
      <Grid2 container spacing={3}>
        {/* ... (grid body remains same) */}
        <Grid2 size={12}>
          <Typography variant="subtitle2" gutterBottom color="primary">
            {t("utility.monthly")}
          </Typography>
          <Grid2 container spacing={2}>
            {MONTHS.map((month) => (
              <Grid2 key={month} size={4}>
                <Controller
                  name={month}
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
                        label={t(`utility.months.${month}`)}
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
              </Grid2>
            ))}
          </Grid2>
        </Grid2>
        <Grid2 size={12}>
          <Typography variant="subtitle2" gutterBottom color="primary">
            {t("utility.config")}
          </Typography>
          <Stack gap={2}>
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
          </Stack>
        </Grid2>
      </Grid2>

      {showActions && (
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button onClick={onCancel} color="inherit">
            {t("address.create.cancel")}
          </Button>
          <Button variant="contained" type="submit">
            {t("utility.submit")}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";
import { Input } from "../../components/Input";
import { addAddress, getAddress } from "../../firebase/firestore";

interface AddressFormValues {
  id: string;
  city: string;
  street: string;
  houseNumber: string;
  flatNumber: string;
}

export const EditAddressPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { control, handleSubmit, reset } = useForm<AddressFormValues>({
    defaultValues: {
      id: id || "",
      city: "",
      street: "",
      houseNumber: "",
      flatNumber: "",
    },
  });

  useEffect(() => {
    if (id) {
      getAddress(id)
        .then((doc) => {
          if (doc) {
            reset({
              id: id,
              city: doc.city,
              street: doc.street,
              houseNumber: doc.house_number,
              flatNumber: doc.flat_number,
            });
          } else {
            setError("Address not found");
          }
        })
        .catch((e) => {
          console.error(e);
          setError("Failed to fetch address");
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [id, reset]);

  const onSubmit: SubmitHandler<AddressFormValues> = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await addAddress(data.id, {
        city: data.city,
        street: data.street,
        house_number: data.houseNumber,
        flat_number: data.flatNumber,
      });
      navigate("/address-list");
    } catch (e) {
      console.error(e);
      setError("Failed to update address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={4}
        gap={2}
      >
        <Typography variant="h4" fontWeight="bold">
          {t("address.edit.title", "Edit Address")}
        </Typography>
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          fullWidth={{ xs: true, sm: false } as any}
        >
          {t("common.back", "Back")}
        </Button>
      </Stack>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Typography variant="h6" gutterBottom color="textSecondary">
                  Basic Information
                </Typography>
              </Grid>

              <Grid size={12}>
                <Controller
                  name="id"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} label={t("address.create.id_label")} disabled />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: "City is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      label={t("address.create.city")}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="street"
                  control={control}
                  rules={{ required: "Street is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      label={t("address.create.street")}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="houseNumber"
                  control={control}
                  rules={{ required: "House Number is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      label={t("address.create.house")}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="flatNumber"
                  control={control}
                  render={({ field }) => <Input {...field} label={t("address.create.flat")} />}
                />
              </Grid>

              <Grid size={12}>
                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  justifyContent="flex-end"
                  gap={2}
                  mt={2}
                >
                  <Button
                    onClick={() => navigate("/address-list")}
                    color="inherit"
                    fullWidth={{ xs: true, sm: false } as any}
                  >
                    {t("address.create.cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    fullWidth={{ xs: true, sm: false } as any}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

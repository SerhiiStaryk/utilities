import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { Add, ArrowBack, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader } from "../../components/Loader";
import { useSettings } from "../../app/providers/SettingsProvider";
import { getAddress, addAddress } from "../../firebase/firestore"; // Reusing addAddress for update
import { AddressDoc } from "../../types/firestore";

export const AddressServicesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const { hideDeleteButtons } = useSettings();

  const [address, setAddress] = useState<AddressDoc | null>(null);
  const [services, setServices] = useState<{ name: string; accountNumber: string }[]>([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      getAddress(id)
        .then((doc) => {
          if (doc) {
            setAddress(doc);
            // Migrate legacy string services to object format
            const loadedServices = (doc.services || []).map((s) =>
              typeof s === "string" ? { name: s, accountNumber: "" } : s,
            );
            setServices(loadedServices);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddService = () => {
    const name = newServiceName.trim();
    if (name && !services.find((s) => s.name === name)) {
      setServices([...services, { name, accountNumber: newAccountNumber.trim() }]);
      setNewServiceName("");
      setNewAccountNumber("");
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setServices(services.filter((s) => s.name !== serviceToRemove));
  };

  const handleSave = async () => {
    if (!id || !address) return;
    setSaving(true);
    try {
      await addAddress(id, {
        ...address,
        services,
      });
      navigate(-1);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: { xs: 2, sm: 4 } }}>
      <Stack direction="row" alignItems="center" mb={4} gap={1}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: { xs: 0, sm: 1 } }}>
          <ArrowBack />
        </IconButton>
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
          {t("address.configure_services", "Configure Services")}
        </Typography>
      </Stack>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom>
            {t("address.services_list", "Services List")}
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            {t(
              "address.services_desc",
              "Define the default utility services for this address (e.g., Gas, Water, Internet). These will be automatically added when you create a new year.",
            )}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} gap={2} mb={3} alignItems="stretch">
            <TextField
              label={t("address.new_service_name", "New Service Name")}
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              label={t("address.account_number_optional", "Account Number (Optional)")}
              value={newAccountNumber}
              onChange={(e) => setNewAccountNumber(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddService();
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddService}
              disabled={!newServiceName.trim()}
              fullWidth={isMobile}
            >
              {t("common.add", "Add")}
            </Button>
          </Stack>

          <Paper variant="outlined" sx={{ p: 2, minHeight: 100 }}>
            {services.length === 0 ? (
              <Typography color="textSecondary" textAlign="center">
                {t("address.no_services_configured", "No services configured yet.")}
              </Typography>
            ) : (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {services.map((service) => (
                  <Chip
                    key={service.name}
                    label={
                      service.accountNumber
                        ? `${service.name} (${service.accountNumber})`
                        : service.name
                    }
                    onDelete={
                      !hideDeleteButtons ? () => handleRemoveService(service.name) : undefined
                    }
                    deleteIcon={!hideDeleteButtons ? <Delete /> : undefined}
                  />
                ))}
              </Stack>
            )}
          </Paper>

          <Stack
            mt={4}
            direction={{ xs: "column-reverse", sm: "row" }}
            justifyContent="flex-end"
            gap={2}
          >
            <Button onClick={() => navigate(-1)} fullWidth={isMobile}>
              {t("address.create.cancel")}
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving} fullWidth={isMobile}>
              {saving ? t("common.saving") : t("address.save_config", "Save Configuration")}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

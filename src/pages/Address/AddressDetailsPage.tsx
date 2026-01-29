import { useEffect, useState } from "react";
import {
  Button,
  Stack,
  Typography,
  Box,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { ArrowBack, Edit, Delete, CalendarToday } from "@mui/icons-material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Modal } from "../../components/modal/Modal";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
import { CreateUtilityModal } from "../../components/modal/CreateUtilityModal";
import { CreateReadingModal } from "../../components/modal/CreateReadingModal";
import {
  deleteAddress,
  getYearsForAddress,
  createYearWithServices,
  getAddress,
  deleteYearAndServices,
} from "../../firebase/firestore";
import { YearDoc } from "../../types/firestore";
import { Settings } from "@mui/icons-material";
import { Input } from "../../components/Input";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../app/providers/SettingsProvider";
import { useAuth } from "../../app/providers/AuthProvider";

import { toast } from "react-toastify";

export const AddressDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { t } = useTranslation();
  const { hideDeleteButtons } = useSettings();
  const { role, allowedAddresses, loading } = useAuth();
  const isAdmin = role === "admin";

  const [addressData, setAddressData] = useState<{
    street: string;
    house_number: string;
    city: string;
    flat_number: string;
  } | null>(null);
  const [yearsList, setYearsList] = useState<{ id: string; data: YearDoc }[]>([]);
  const [createYearOpen, setCreateYearOpen] = useState(false);
  const [createUtilityOpen, setCreateUtilityOpen] = useState(false);
  const [createReadingOpen, setCreateReadingOpen] = useState(false);
  const [deleteAddressOpen, setDeleteAddressOpen] = useState(false);
  const [deletingYear, setDeletingYear] = useState<string | null>(null);
  const [newYear, setNewYear] = useState("");

  const [disabledSubmit, setDisabledSubmit] = useState(false);

  const fetchData = async () => {
    if (id) {
      try {
        const addr = await getAddress(id);
        if (addr) {
          setAddressData({
            street: addr.street,
            house_number: addr.house_number,
            city: addr.city,
            flat_number: addr.flat_number,
          });
        }

        const years = await getYearsForAddress(id);
        setYearsList(years);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (!loading && !isAdmin && allowedAddresses && id && !allowedAddresses.includes(id)) {
      navigate("/address-list");
      return;
    }
    fetchData();
  }, [id, isAdmin, allowedAddresses, loading]);

  const fetchYears = () => {
    if (id) {
      getYearsForAddress(id).then(setYearsList).catch(console.error);
    }
  };

  const handleCreateYear = async () => {
    if (!id || !newYear) return;
    try {
      setDisabledSubmit(true);
      const addressDoc = await getAddress(id);
      const servicesStart = addressDoc?.services || [];
      // If no services configured, maybe warn user? or just create empty year?
      // For now, allow empty.

      await createYearWithServices(id, newYear, servicesStart);
      setCreateYearOpen(false);
      setNewYear("");
      fetchYears();
    } catch (e) {
      console.error(e);
    } finally {
      setDisabledSubmit(false);
    }
  };

  const handleDeleteYear = async () => {
    if (!id || !deletingYear) return;
    try {
      await deleteYearAndServices(id, deletingYear);
      setDeletingYear(null);
      fetchYears();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete year");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteAddress(id);
      setDeleteAddressOpen(false);
      navigate("/address-list");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete address");
    }
  };

  const formatFullAddress = () => {
    if (!addressData) return id;
    const { street, house_number, flat_number } = addressData;
    let addr = `${street} ${house_number}`;
    if (flat_number) {
      addr += `, кв. ${flat_number}`;
    }
    return addr;
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        mb={4}
        gap={2}
      >
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate("/address-list")} sx={{ mr: { xs: 1, sm: 2 } }}>
            <ArrowBack />
          </IconButton>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
            {t("address.details_title", { address: formatFullAddress() })}
          </Typography>
        </Box>
        <Stack direction="row" gap={1} sx={{ width: { xs: "100%", sm: "auto" }, flexWrap: "wrap" }}>
          {isAdmin && (
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={() => navigate(`/address-list/${id}/services`)}
              size={isMobile ? "small" : "medium"}
              sx={{ flexGrow: { xs: 1, sm: 0 } }}
            >
              {t("address.configure_services", "Services")}
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => navigate(`/address-list/edit/${id}`)}
              size={isMobile ? "small" : "medium"}
              sx={{ flexGrow: { xs: 1, sm: 0 } }}
            >
              {t("settings.edit", "Edit")}
            </Button>
          )}
          {isAdmin && !hideDeleteButtons && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteAddressOpen(true)}
              size={isMobile ? "small" : "medium"}
              sx={{ flexGrow: { xs: 1, sm: 0 } }}
            >
              {t("common.delete", "Delete")}
            </Button>
          )}
        </Stack>
      </Stack>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={2}
          gap={2}
        >
          <Typography variant="h6">{t("address.year_archive", "Years Archive")}</Typography>
          <Stack direction="row" gap={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
            {isAdmin && (
              <Button
                variant="outlined"
                onClick={() => setCreateYearOpen(true)}
                sx={{ flexGrow: 1 }}
                size={isMobile ? "small" : "medium"}
              >
                {t("year.create", "New Year")}
              </Button>
            )}
            {isAdmin && (
              <Stack direction="row" gap={1} sx={{ flexGrow: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => setCreateUtilityOpen(true)}
                  size={isMobile ? "small" : "medium"}
                  sx={{ flexGrow: 1 }}
                >
                  {t("dashboard.add_utility")}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setCreateReadingOpen(true)}
                  size={isMobile ? "small" : "medium"}
                  sx={{ flexGrow: 1 }}
                >
                  {t("utility.meter_readings")}
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>

        <List>
          {yearsList.map((year) => (
            <ListItem
              key={year.id}
              disablePadding
              secondaryAction={
                isAdmin &&
                !hideDeleteButtons && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => setDeletingYear(year.data.year.toString())}
                  >
                    <Delete />
                  </IconButton>
                )
              }
            >
              <ListItemButton component={Link} to={`year/${year.data.year}`}>
                <ListItemIcon>
                  <CalendarToday />
                </ListItemIcon>
                <ListItemText primary={year.data.year} />
              </ListItemButton>
              <Button
                size="small"
                onClick={() => navigate(`year/${year.data.year}/readings`)}
                sx={{ mr: 7 }}
              >
                {t("utility.meter_readings", "Readings")}
              </Button>
            </ListItem>
          ))}
          {yearsList.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              {t("year.no_data", "No years found. Add utility data to create a year.")}
            </Typography>
          )}
        </List>
      </Paper>

      <Modal
        additionalStyles={{ maxWidth: 400 }}
        title={t("year.create_title", "Create New Year")}
        open={createYearOpen}
        onClose={() => setCreateYearOpen(false)}
        footer={
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setCreateYearOpen(false)}>{t("address.create.cancel")}</Button>
            <Button
              variant="contained"
              onClick={handleCreateYear}
              disabled={!newYear || disabledSubmit}
            >
              {t("address.create.submit")}
            </Button>
          </Box>
        }
      >
        <Box>
          <Typography variant="body2" mb={2} color="textSecondary">
            {t(
              "year.create_desc",
              "Enter the year (e.g., 2026). This will create a new archive and automatically add the configured services for this address.",
            )}
          </Typography>
          <Input
            label={t("utility.year", "Year")}
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            type="number"
          />
        </Box>
      </Modal>

      <CreateUtilityModal
        addressData={addressData}
        open={createUtilityOpen}
        onClose={() => setCreateUtilityOpen(false)}
        addressId={id || ""}
        onSuccess={fetchYears}
      />

      <CreateReadingModal
        open={createReadingOpen}
        onClose={() => setCreateReadingOpen(false)}
        addressId={id || ""}
        onSuccess={fetchYears}
      />

      <ConfirmModal
        open={deleteAddressOpen}
        onClose={() => setDeleteAddressOpen(false)}
        onConfirm={handleDelete}
        title={t("address.delete_title", "Delete Address")}
        message={t("address.delete_confirm", {
          address: formatFullAddress(),
          defaultValue:
            "Are you sure you want to delete this address? This action cannot be undone.",
        })}
      />

      <ConfirmModal
        open={!!deletingYear}
        onClose={() => setDeletingYear(null)}
        onConfirm={handleDeleteYear}
        title={t("year.delete_title", "Delete Year Archive")}
        message={t("year.delete_confirm", {
          year: deletingYear,
          defaultValue:
            "Are you sure you want to delete the archive for this year? All associated utility data will be lost.",
        })}
      />
    </Box>
  );
};

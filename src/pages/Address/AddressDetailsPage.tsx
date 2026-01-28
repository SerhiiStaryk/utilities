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
import { CreateUtilityModal } from "../../components/modal/CreateUtilityModal";
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


export const AddressDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { t } = useTranslation();
  const { hideDeleteButtons } = useSettings();
  const [addressData, setAddressData] = useState<{ 
    street: string; 
    house_number: string;
    city: string;
    flat_number: string;
  } | null>(null);
  const [yearsList, setYearsList] = useState<{ id: string; data: YearDoc }[]>([]);
  const [createYearOpen, setCreateYearOpen] = useState(false);
  const [createUtilityOpen, setCreateUtilityOpen] = useState(false);
  const [newYear, setNewYear] = useState("");

  const fetchData = async () => {
    if (id) {
      try {
        const addr = await getAddress(id);
        if (addr) {
          setAddressData({ 
            street: addr.street, 
            house_number: addr.house_number,
            city: addr.city,
            flat_number: addr.flat_number
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
    fetchData();
  }, [id]);

  const fetchYears = () => {
    if (id) {
      getYearsForAddress(id).then(setYearsList).catch(console.error);
    }
  };

  const handleCreateYear = async () => {
    if (!id || !newYear) return;
    try {
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
    }
  };

  const handleDeleteYear = async (yearStr: string) => {
    if (!id) return;
    if (
      window.confirm(t("Are you sure you want to delete this year archive? All data will be lost."))
    ) {
      try {
        await deleteYearAndServices(id, yearStr);
        fetchYears();
      } catch (e) {
        console.error(e);
        alert("Failed to delete year");
      }
    }
  };

  const handleDelete = async () => {
    if (id && window.confirm(t("Are you sure you want to delete this address?"))) {
      try {
        await deleteAddress(id);
        navigate("/address-list");
      } catch (e) {
        console.error(e);
        alert("Failed to delete address");
      }
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
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => navigate(`/address-list/${id}/services`)}
            size={isMobile ? "small" : "medium"}
            sx={{ flexGrow: { xs: 1, sm: 0 } }}
          >
            Services
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/address-list/edit/${id}`)}
            size={isMobile ? "small" : "medium"}
            sx={{ flexGrow: { xs: 1, sm: 0 } }}
          >
            Edit
          </Button>
          {!hideDeleteButtons && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
              size={isMobile ? "small" : "medium"}
              sx={{ flexGrow: { xs: 1, sm: 0 } }}
            >
              Delete
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
            <Button
              variant="outlined"
              onClick={() => setCreateYearOpen(true)}
              sx={{ flexGrow: 1 }}
              size={isMobile ? "small" : "medium"}
            >
              {t("year.create", "New Year")}
            </Button>
            <Button
              variant="contained"
              onClick={() => setCreateUtilityOpen(true)}
              sx={{ flexGrow: 1 }}
              size={isMobile ? "small" : "medium"}
            >
              {t("dashboard.add_utility")}
            </Button>
          </Stack>
        </Stack>

        <List>
          {yearsList.map((year) => (
            <ListItem
              key={year.id}
              disablePadding
              secondaryAction={
                !hideDeleteButtons && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteYear(year.data.year.toString())}
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
            </ListItem>
          ))}
          {yearsList.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No years found. Add utility data to create a year.
            </Typography>
          )}
        </List>
      </Paper>

      <Modal
        title={t("year.create_title", "Create New Year")}
        open={createYearOpen}
        onClose={() => setCreateYearOpen(false)}
        footer={
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setCreateYearOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateYear} disabled={!newYear}>
              Create
            </Button>
          </Box>
        }
      >
        <Box>
          <Typography variant="body2" mb={2} color="textSecondary">
            Enter the year (e.g., 2026). This will create a new archive and automatically add the
            configured services for this address.
          </Typography>
          <Input
            label="Year"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            type="number"
          />
        </Box>
      </Modal>

      <CreateUtilityModal
        open={createUtilityOpen}
        onClose={() => setCreateUtilityOpen(false)}
        addressId={id || ""}
        onSuccess={fetchYears}
      />


    </Box>
  );
};

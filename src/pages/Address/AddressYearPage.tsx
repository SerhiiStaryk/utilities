import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Paper,
  Card,
  CardContent,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { ArrowBack, Edit, Delete, ViewModule, ViewList } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getAllUtilityServicesForYear,
  updateUtilityService,
  deleteUtilityService,
  getAddress,
} from "../../firebase/firestore";
import { UtilityService, AddressDoc } from "../../types/firestore";
import { Modal } from "../../components/modal/Modal";
import { UtilityForm } from "../../components/forms/UtilityForm";
import { QuickEntryForm } from "../../components/forms/QuickEntryForm";
import Grid from "@mui/material/Grid2";
import { MONTHS } from "../../constants/months";
import { useSettings } from "../../app/providers/SettingsProvider";

type ViewMode = "cards" | "table";

export const AddressYearPage = () => {
  const { id, year } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { hideDeleteButtons } = useSettings();
  const [services, setServices] = useState<UtilityService[]>([]);
  const [address, setAddress] = useState<AddressDoc | null>(null);
  const [editingService, setEditingService] = useState<UtilityService | null>(null);
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  useEffect(() => {
    if (isMobile) {
      setViewMode("cards");
    }
  }, [isMobile]);

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" }).toLowerCase();

  const fetchServices = () => {

    if (id && year) {
      getAllUtilityServicesForYear(id, year).then(setServices).catch(console.error);
    }
  };

  const fetchAddress = () => {
    if (id) {
      getAddress(id).then(setAddress).catch(console.error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchAddress();
  }, [id, year]);

  const handleUpdate = async (data: any) => {
    if (!id || !year || !editingService) return;

    // Prepare payload for update
    const payload: any = {
      monthly_payments: {},
      account_number: data.accountNumber,
      currency: data.currency,
    };

    MONTHS.forEach((month) => {
      if (data[month]) {
        payload.monthly_payments[month] = {
          amount: Number(data[month]),
          currency: data.currency,
        };
      }
    });

    try {
      await updateUtilityService(id, year, editingService.id || editingService.name, payload);
      setEditingService(null);
      fetchServices();
    } catch (e) {
      console.error("Failed to update service", e);
    }
  };

  const handleDelete = async (service: UtilityService) => {
    if (!id || !year) return;
    if (window.confirm(t("Are you sure you want to delete this service?"))) {
      try {
        await deleteUtilityService(id, year, service.id || service.name);
        fetchServices();
      } catch (e) {
        console.error("Failed to delete service", e);
      }
    }
  };

  const handleQuickEntrySubmit = async (data: any) => {
    if (!id || !year) return;

    const updates = data.payments
      .filter((p: any) => p.amount && parseFloat(p.amount) > 0)
      .map((p: any) => {
        const payload: any = {
          monthly_payments: {
            [data.month]: {
              amount: p.amount,
              currency: p.currency,
            },
          },
        };
        return updateUtilityService(id, year, p.serviceId, payload);
      });

    try {
      await Promise.all(updates);
      setQuickEntryOpen(false);
      fetchServices();
    } catch (e) {
      console.error("Failed to batch update", e);
    }
  };

  const addressDisplay = address
    ? `${address.street}, ${address.house_number}${address.flat_number ? `/${address.flat_number}` : ""}, ${address.city}`
    : id;

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
          <IconButton onClick={() => navigate(`/address-list/${id}`)} sx={{ mr: { xs: 1, sm: 2 } }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" noWrap sx={{ maxWidth: { xs: '70vw', sm: '100%' } }}>
              {addressDisplay}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {year} рік
            </Typography>
          </Box>
        </Box>
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          sx={{ width: { xs: "100%", sm: "auto" }, justifyContent: "space-between" }}
        >
          {!isMobile && (
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => {
                if (newMode !== null) setViewMode(newMode);
              }}
              size="small"
            >
              <ToggleButton value="cards" aria-label="card view">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="table" aria-label="table view">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          )}
          <Button
            variant="contained"
            onClick={() => setQuickEntryOpen(true)}
            fullWidth={isMobile}
          >
            {t("utility.enter_current_month", "Enter Current Month")}
          </Button>
        </Stack>
      </Stack>


      {viewMode === "cards" ? (
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id || service.name}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box>
                      <Typography variant="h6" gutterBottom color="primary">
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Account: {service.account_number}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => setEditingService(service)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      {!hideDeleteButtons && (
                        <IconButton size="small" onClick={() => handleDelete(service)} color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  <Box mt={2}>
                    {Object.entries(service.monthly_payments)
                      .sort(([monthA], [monthB]) => {
                        const indexA = MONTHS.indexOf(monthA as any);
                        const indexB = MONTHS.indexOf(monthB as any);

                        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
                      })
                      .map(([month, payment]) => (
                        <Box key={month} display="flex" justifyContent="space-between" my={0.5}>
                          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                            {month}:
                          </Typography>

                          <Typography variant="body2" fontWeight="bold">
                            {payment.amount} {payment.currency}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {services.length === 0 && (
            <Grid size={12}>
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body1" color="textSecondary">
                  No utility services found for this year.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>{t("utility.service", "Service")}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t("utility.account", "Account Number")}</strong>
                </TableCell>
                {MONTHS.map((month) => (
                  <TableCell key={month} align="right">
                    <strong>{t(`utility.months.${month}`, month)}</strong>
                  </TableCell>
                ))}
                <TableCell align="center">
                  <strong>{t("address.create.cancel", "Actions")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No utility services found for this year.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id || service.name}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {service.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {service.account_number}
                      </Typography>
                    </TableCell>
                    {MONTHS.map((month) => {
                      const payment = service.monthly_payments[month];
                      return (
                        <TableCell key={month} align="right">
                          {payment ? (
                            <Typography variant="body2">
                              {payment.amount} {payment.currency}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => setEditingService(service)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      {!hideDeleteButtons && (
                        <IconButton size="small" onClick={() => handleDelete(service)} color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {editingService && (
        <Modal
          title={editingService.name}
          open={!!editingService}
          onClose={() => setEditingService(null)}
          footer={
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setEditingService(null)} color="inherit">
                {t("address.create.cancel")}
              </Button>
              <Button variant="contained" type="submit" form="edit-utility-form">
                {t("utility.submit")}
              </Button>
            </Box>
          }
        >
          <UtilityForm
            id="edit-utility-form"
            showActions={false}
            initialValues={{
              currency: Object.values(editingService.monthly_payments || {})[0]?.currency || "",
              accountNumber: editingService.account_number,
              ...Object.entries(editingService.monthly_payments || {}).reduce(
                (acc: any, [month, val]) => {
                  acc[month] = val.amount;
                  return acc;
                },
                {},
              ),
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingService(null)}
          />
        </Modal>
      )}

      <Modal
        title={t("utility.quick_entry", "Quick Entry")}
        open={quickEntryOpen}
        onClose={() => setQuickEntryOpen(false)}
        footer={
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setQuickEntryOpen(false)} color="inherit">
              {t("address.create.cancel")}
            </Button>
            <Button variant="contained" type="submit" form="quick-entry-form">
              {t("utility.submit")}
            </Button>
          </Box>
        }
      >
        <QuickEntryForm
          id="quick-entry-form"
          showActions={false}
          currentMonth={currentMonth}
          services={services.map((s) => ({
            name: s.name,
            accountNumber: s.account_number,
          }))}
          onSubmit={handleQuickEntrySubmit}
          onCancel={() => setQuickEntryOpen(false)}
        />
      </Modal>

    </Box>
  );
};

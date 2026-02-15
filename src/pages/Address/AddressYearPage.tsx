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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ArrowBack, Edit, Delete, ViewModule, ViewList, ExpandMore } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getAllUtilityServicesForYear,
  updateUtilityService,
  deleteUtilityService,
  getAddress,
} from "../../firebase/firestore";
import { UtilityService, AddressDoc, MonthlyPayments } from "../../types/firestore";
import { Modal } from "../../components/modal/Modal";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
import { UtilityForm } from "../../components/forms/UtilityForm";
import { QuickEntryForm } from "../../components/forms/QuickEntryForm";
import { CreateUtilityModal } from "../../components/modal/CreateUtilityModal";
import Grid from "@mui/material/Grid2";
import { MONTHS } from "../../constants/months";
import { useSettings } from "../../app/providers/SettingsProvider";
import { useAuth } from "../../app/providers/AuthProvider";

type ViewMode = "cards" | "table";

export const AddressYearPage = () => {
  const { id, year } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { hideDeleteButtons } = useSettings();
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [services, setServices] = useState<UtilityService[]>([]);

  const [address, setAddress] = useState<AddressDoc | null>(null);
  const [editingService, setEditingService] = useState<UtilityService | null>(null);
  const [deletingService, setDeletingService] = useState<UtilityService | null>(null);
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);
  const [createUtilityOpen, setCreateUtilityOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [disableSubmit, setDisabledSubmit] = useState(false);

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
      setDisabledSubmit(true);
      await updateUtilityService(id, year, editingService.id || editingService.name, payload);
      setEditingService(null);
      fetchServices();
    } catch (e) {
      console.error("Failed to update service", e);
    } finally {
      setDisabledSubmit(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !year || !deletingService) return;
    try {
      await deleteUtilityService(id, year, deletingService.id || deletingService.name);
      setDeletingService(null);
      fetchServices();
    } catch (e) {
      console.error("Failed to delete service", e);
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

  const countSumOfService = (service: UtilityService) => {
    return Object.values(service.monthly_payments || {}).reduce((sum, payment) => {
      return sum + (parseFloat(payment.amount) || 0);
    }, 0);
  };

  const countSumOfAllServices = () => {
    return services.reduce((total, service) => {
      return total + countSumOfService(service);
    }, 0);
  };

  const monthlySums = MONTHS.reduce(
    (acc, month) => {
      const sum = services.reduce((total, service) => {
        const payment = service.monthly_payments[month as keyof MonthlyPayments];
        return total + (payment ? parseFloat(payment.amount) || 0 : 0);
      }, 0);
      if (sum > 0) {
        acc[month] = sum;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

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
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight="bold"
              noWrap
              sx={{ maxWidth: { xs: "70vw", sm: "100%" } }}
            >
              {addressDisplay}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {t("utility.payments", "Payments")} - {year} {t("common.year_short", "year")}
            </Typography>
            <Accordion
              elevation={0}
              sx={{
                bgcolor: "transparent",
                "&:before": { display: "none" },
                mt: 0.5,
                "&.Mui-expanded": { margin: 0 },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  p: 0,
                  minHeight: "unset",
                  "& .MuiAccordionSummary-content": {
                    margin: "4px 0",
                    "&.Mui-expanded": { margin: "4px 0" },
                  },
                  "& .MuiAccordionSummary-expandIconWrapper": {
                    color: "text.secondary",
                  },
                }}
              >
                <Typography variant="subtitle1" color="textSecondary">
                  {t("utility.sum_for_year", "Сума за рік")}:{" "}
                  <strong>
                    {countSumOfAllServices().toFixed(2)} {services[0]?.currency ?? ""}
                  </strong>
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0, pb: 1 }}>
                {Object.keys(monthlySums).length > 0 && (
                  <Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ fontWeight: "bold", mb: 0.5 }}
                    >
                      {t("utility.monthly_summary", "Загальний підсумок по місяцях")}:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" sx={{ gap: { xs: 0.5, sm: 1 } }}>
                      {MONTHS.map((month) => {
                        const sum = monthlySums[month];
                        if (!sum) return null;
                        return (
                          <Typography
                            key={month}
                            variant="body2"
                            color="textSecondary"
                            sx={{ mr: 2 }}
                          >
                            <span style={{ textTransform: "capitalize" }}>
                              {t(`utility.months.${month}`, month)}
                            </span>
                            :{" "}
                            <strong>
                              {sum.toFixed(2)} {services[0]?.currency ?? ""}
                            </strong>
                          </Typography>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
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
          {isAdmin && (
            <Stack direction={{ xs: "column", sm: "row" }} gap={1} sx={{ width: "100%" }}>
              <Button
                variant="outlined"
                onClick={() => setCreateUtilityOpen(true)}
                fullWidth={isMobile}
              >
                {t("dashboard.add_utility", "Add Service")}
              </Button>
              <Button
                variant="contained"
                onClick={() => setQuickEntryOpen(true)}
                fullWidth={isMobile}
              >
                {t("utility.enter_current_month", "Enter Current Month")}
              </Button>
            </Stack>
          )}
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
                        {t("utility.account_short", "Account")}: {service.account_number}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Cума: {countSumOfService(service).toFixed(2)}
                        {Object.values(service.monthly_payments || {})[0]?.currency || ""}
                      </Typography>
                    </Box>
                    {isAdmin && (
                      <Box>
                        <IconButton size="small" onClick={() => setEditingService(service)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        {!hideDeleteButtons && (
                          <IconButton
                            size="small"
                            onClick={() => setDeletingService(service)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    )}
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
                            {t(`utility.months.${month}`, month)}:
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
                      {t("utility.no_services", "No utility services found for this year.")}
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
                      {isAdmin && (
                        <>
                          <IconButton size="small" onClick={() => setEditingService(service)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          {!hideDeleteButtons && (
                            <IconButton
                              size="small"
                              onClick={() => setDeletingService(service)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </>
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
              <Button
                variant="contained"
                type="submit"
                form="edit-utility-form"
                disabled={disableSubmit}
              >
                {t("utility.submit")}
              </Button>
            </Box>
          }
        >
          <UtilityForm
            id="edit-utility-form"
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

      <ConfirmModal
        open={!!deletingService}
        onClose={() => setDeletingService(null)}
        onConfirm={handleDelete}
        title={t("common.delete_confirm_title", "Confirm Deletion")}
        message={t("utility.delete_service_confirm", {
          name: deletingService?.name,
          defaultValue:
            "Are you sure you want to delete this service? All data for this service will be lost.",
        })}
      />

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

      <CreateUtilityModal
        addressData={address}
        open={createUtilityOpen}
        onClose={() => setCreateUtilityOpen(false)}
        addressId={id || ""}
        initialYear={year}
        onSuccess={fetchServices}
      />
    </Box>
  );
};

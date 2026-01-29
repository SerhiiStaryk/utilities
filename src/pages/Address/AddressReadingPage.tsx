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
  getAllMeterReadingsForYear,
  updateMeterReading,
  deleteMeterReading,
  getAddress,
} from "../../firebase/firestore";
import { MeterReadingService, AddressDoc } from "../../types/firestore";
import { Modal } from "../../components/modal/Modal";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
import { ReadingForm } from "../../components/forms/ReadingForm";
import { QuickReadingForm } from "../../components/forms/QuickReadingForm";
import Grid from "@mui/material/Grid2";
import { MONTHS } from "../../constants/months";
import { useSettings } from "../../app/providers/SettingsProvider";
import { useAuth } from "../../app/providers/AuthProvider";

type ViewMode = "cards" | "table";

export const AddressReadingPage = () => {
  const { id, year } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { hideDeleteButtons } = useSettings();
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [readings, setReadings] = useState<MeterReadingService[]>([]);

  const [address, setAddress] = useState<AddressDoc | null>(null);
  const [editingReading, setEditingReading] = useState<MeterReadingService | null>(null);
  const [deletingReading, setDeletingReading] = useState<MeterReadingService | null>(null);
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  useEffect(() => {
    if (isMobile) {
      setViewMode("cards");
    }
  }, [isMobile]);

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" }).toLowerCase();

  const fetchReadings = () => {
    if (id && year) {
      getAllMeterReadingsForYear(id, year).then(setReadings).catch(console.error);
    }
  };

  const fetchAddress = () => {
    if (id) {
      getAddress(id).then(setAddress).catch(console.error);
    }
  };

  useEffect(() => {
    fetchReadings();
    fetchAddress();
  }, [id, year]);

  const handleUpdate = async (data: any) => {
    if (!id || !year || !editingReading) return;

    const payload: any = {
      name: editingReading.name,
      meter_number: editingReading.meter_number,
      monthly_readings: {},
    };

    MONTHS.forEach((month) => {
      if (data[month]) {
        payload.monthly_readings[month] = {
          value: data[month],
        };
      }
    });

    try {
      const docId = `${editingReading.name}_${editingReading.meter_number}`.replace(/\s+/g, "_");
      await updateMeterReading(id, year, docId, payload);
      setEditingReading(null);
      fetchReadings();
    } catch (e) {
      console.error("Failed to update reading", e);
    }
  };

  const handleDelete = async () => {
    if (!id || !year || !deletingReading) return;
    try {
      const docId = `${deletingReading.name}_${deletingReading.meter_number}`.replace(/\s+/g, "_");
      await deleteMeterReading(id, year, docId);
      setDeletingReading(null);
      fetchReadings();
    } catch (e) {
      console.error("Failed to delete reading", e);
    }
  };

  const handleQuickEntrySubmit = async (data: any) => {
    if (!id || !year) return;

    const updates = data.readings
      .filter((r: any) => r.value)
      .map((r: any) => {
        const payload: any = {
          monthly_readings: {
            [data.month]: {
              value: r.value,
            },
          },
        };
        const docId = `${r.serviceId}_${r.meterNumber}`.replace(/\s+/g, "_");
        return updateMeterReading(id, year, docId, payload);
      });

    try {
      await Promise.all(updates);
      setQuickEntryOpen(false);
      fetchReadings();
    } catch (e) {
      console.error("Failed to batch update readings", e);
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
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight="bold"
              noWrap
              sx={{ maxWidth: { xs: "70vw", sm: "100%" } }}
            >
              {addressDisplay}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {t("utility.meter_readings", "Meter Readings")} - {year}{" "}
              {t("common.year_short", "year")}
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
          {isAdmin && (
            <Button
              variant="contained"
              onClick={() => setQuickEntryOpen(true)}
              fullWidth={isMobile}
            >
              {t("utility.enter_current_month", "Enter Current Month")}
            </Button>
          )}
        </Stack>
      </Stack>

      {viewMode === "cards" ? (
        <Grid container spacing={3}>
          {readings.map((reading) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={reading.id || reading.name}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box>
                      <Typography variant="h6" gutterBottom color="secondary">
                        {reading.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        #{reading.meter_number}
                      </Typography>
                    </Box>
                    {isAdmin && (
                      <Box>
                        <IconButton size="small" onClick={() => setEditingReading(reading)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        {!hideDeleteButtons && (
                          <IconButton
                            size="small"
                            onClick={() => setDeletingReading(reading)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </Box>
                  <Box mt={2}>
                    {Object.entries(reading.monthly_readings || {})
                      .sort(([monthA], [monthB]) => {
                        const indexA = MONTHS.indexOf(monthA as any);
                        const indexB = MONTHS.indexOf(monthB as any);
                        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
                      })
                      .map(([month, r]) => (
                        <Box key={month} display="flex" justifyContent="space-between" my={0.5}>
                          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                            {t(`utility.months.${month}`, month)}:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {r.value}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {readings.length === 0 && (
            <Grid size={12}>
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body1" color="textSecondary">
                  {t("utility.no_readings", "No meter readings found for this year.")}
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
                  <strong>{t("utility.meter_number", "Meter #")}</strong>
                </TableCell>
                {MONTHS.map((month) => (
                  <TableCell key={month} align="right">
                    <strong>{t(`utility.months.${month}`, month)}</strong>
                  </TableCell>
                ))}
                <TableCell align="center">
                  <strong>{t("common.actions", "Actions")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {readings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    <Typography variant="body1" color="textSecondary">
                      {t("utility.no_readings", "No meter readings found for this year.")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                readings.map((reading) => (
                  <TableRow key={reading.id || reading.name}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {reading.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {reading.meter_number}
                      </Typography>
                    </TableCell>
                    {MONTHS.map((month) => {
                      const r = reading.monthly_readings?.[month];
                      return (
                        <TableCell key={month} align="right">
                          {r ? (
                            <Typography variant="body2">{r.value}</Typography>
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
                          <IconButton size="small" onClick={() => setEditingReading(reading)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          {!hideDeleteButtons && (
                            <IconButton
                              size="small"
                              onClick={() => setDeletingReading(reading)}
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

      {editingReading && (
        <Modal
          title={editingReading.name}
          open={!!editingReading}
          onClose={() => setEditingReading(null)}
          footer={
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setEditingReading(null)} color="inherit">
                {t("address.create.cancel")}
              </Button>
              <Button variant="contained" type="submit" form="edit-reading-form">
                {t("utility.submit")}
              </Button>
            </Box>
          }
        >
          <ReadingForm
            id="edit-reading-form"
            showActions={false}
            initialValues={{
              serviceId: editingReading.name,
              meter_number: editingReading.meter_number,
              ...Object.entries(editingReading.monthly_readings || {}).reduce(
                (acc: any, [month, val]) => {
                  acc[month] = val.value;
                  return acc;
                },
                {},
              ),
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingReading(null)}
          />
        </Modal>
      )}

      <ConfirmModal
        open={!!deletingReading}
        onClose={() => setDeletingReading(null)}
        onConfirm={handleDelete}
        title={t("common.delete_confirm_title", "Confirm Deletion")}
        message={t("utility.delete_reading_confirm", {
          name: deletingReading?.name,
          number: deletingReading?.meter_number,
          defaultValue:
            "Are you sure you want to delete this meter reading? All data for this meter will be lost.",
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
            <Button variant="contained" type="submit" form="quick-reading-form">
              {t("utility.submit")}
            </Button>
          </Box>
        }
      >
        <QuickReadingForm
          id="quick-reading-form"
          showActions={false}
          currentMonth={currentMonth}
          services={readings.map((s) => ({
            name: s.name,
            meter_number: s.meter_number,
          }))}
          onSubmit={handleQuickEntrySubmit}
          onCancel={() => setQuickEntryOpen(false)}
        />
      </Modal>
    </Box>
  );
};

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Card,
  CardContent,
  Grid2 as Grid,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import { Add, Save, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getAddresses, getAddress, updateRentalInfo } from "../../firebase/firestore";
import { AddressDoc, RentalInfo, RentalPayment } from "../../types/firestore";
import { useAuth } from "../../app/providers/AuthProvider";
import { toast } from "react-toastify";

export const RentalManagementPage = () => {
  const { t } = useTranslation();
  const { role, allowedAddresses } = useAuth();
  const isAdmin = role === "admin";

  const [addresses, setAddresses] = useState<{ id: string; data: AddressDoc }[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    localStorage.getItem("rental_selectedAddressId") || ""
  );

  useEffect(() => {
    if (selectedAddressId) {
      localStorage.setItem("rental_selectedAddressId", selectedAddressId);
    }
  }, [selectedAddressId]);

  const [rentalInfo, setRentalInfo] = useState<RentalInfo>({
    isRented: false,
    tenantName: "",
    tenantPhone: "",
    startDate: "",
    monthlyRent: 0,
    deposit: 0,
    currency: "UAH",
    payments: [],
  });


  const fetchAddresses = async () => {
    try {
      const all = await getAddresses();
      const filtered = isAdmin ? all : all.filter(a => allowedAddresses?.includes(a.id));
      setAddresses(filtered);
      if (filtered.length > 0 && !selectedAddressId) {
        setSelectedAddressId(filtered[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [isAdmin, allowedAddresses]);

  useEffect(() => {
    if (selectedAddressId) {
      getAddress(selectedAddressId).then((addr) => {
        if (addr && addr.rental_info) {
          setRentalInfo(addr.rental_info);
        } else {
          setRentalInfo({
            isRented: false,
            tenantName: "",
            tenantPhone: "",
            startDate: "",
            monthlyRent: 0,
            deposit: 0,
            currency: "UAH",
            payments: [],
          });
        }
      });
    }
  }, [selectedAddressId]);

  const handleSaveInfo = async () => {
    if (!selectedAddressId) return;
    try {
      await updateRentalInfo(selectedAddressId, rentalInfo);
      toast.success(t("rental.save_success", "Дані збережено"));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPayment = () => {
    const newPayment: RentalPayment = {
      id: crypto.randomUUID(),
      month: new Date().toLocaleString("en-US", { month: "long" }).toLowerCase(),
      year: new Date().getFullYear(),
      amount: rentalInfo.monthlyRent,
      date: new Date().toISOString().split("T")[0],
      status: "paid",
    };
    const updatedPayments = [newPayment, ...(rentalInfo.payments || [])];
    setRentalInfo({ ...rentalInfo, payments: updatedPayments });
  };

  const handleDeletePayment = (id: string) => {
    const updatedPayments = (rentalInfo.payments || []).filter((p) => p.id !== id);
    setRentalInfo({ ...rentalInfo, payments: updatedPayments });
  };

  const updatePaymentStatus = (id: string, status: RentalPayment["status"]) => {
    const updatedPayments = (rentalInfo.payments || []).map((p) =>
      p.id === id ? { ...p, status } : p
    );
    setRentalInfo({ ...rentalInfo, payments: updatedPayments });
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          {t("rental.title")}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>{t("dashboard.current_address")}</InputLabel>
          <MuiSelect
            value={selectedAddressId}
            label={t("dashboard.current_address")}
            onChange={(e) => setSelectedAddressId(e.target.value)}
          >
            {addresses.map((addr) => (
              <MenuItem key={addr.id} value={addr.id}>
                {addr.data.street} {addr.data.house_number}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
      </Stack>

      {selectedAddressId ? (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  {t("rental.status")}
                </Typography>
                <Stack gap={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rentalInfo.isRented}
                        onChange={(e) => setRentalInfo({ ...rentalInfo, isRented: e.target.checked })}
                      />
                    }
                    label={rentalInfo.isRented ? t("rental.rented") : t("rental.vacant")}
                  />
                  <TextField
                    label={t("rental.tenant_name")}
                    value={rentalInfo.tenantName}
                    onChange={(e) => setRentalInfo({ ...rentalInfo, tenantName: e.target.value })}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label={t("rental.tenant_phone")}
                    value={rentalInfo.tenantPhone}
                    onChange={(e) => setRentalInfo({ ...rentalInfo, tenantPhone: e.target.value })}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label={t("rental.start_date")}
                    type="date"
                    value={rentalInfo.startDate}
                    onChange={(e) => setRentalInfo({ ...rentalInfo, startDate: e.target.value })}
                    fullWidth
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <Box display="flex" gap={2}>
                    <TextField
                      label={t("rental.monthly_rent")}
                      type="number"
                      value={rentalInfo.monthlyRent}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, monthlyRent: Number(e.target.value) })}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label={t("utility.currency")}
                      value={rentalInfo.currency}
                      onChange={(e) => setRentalInfo({ ...rentalInfo, currency: e.target.value })}
                      sx={{ width: 100 }}
                      size="small"
                    />
                  </Box>
                  <TextField
                    label={t("rental.deposit")}
                    type="number"
                    value={rentalInfo.deposit}
                    onChange={(e) => setRentalInfo({ ...rentalInfo, deposit: Number(e.target.value) })}
                    fullWidth
                    size="small"
                  />
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveInfo}
                    sx={{ mt: 2 }}
                  >
                    {t("common.confirm")}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">{t("rental.payments")}</Typography>
                <Button variant="outlined" startIcon={<Add />} onClick={handleAddPayment}>
                  {t("rental.add_payment")}
                </Button>
              </Stack>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("utility.month")}</TableCell>
                      <TableCell>{t("rental.amount")}</TableCell>
                      <TableCell>{t("rental.payment_date")}</TableCell>
                      <TableCell>{t("rental.status")}</TableCell>
                      <TableCell align="right">{t("common.actions")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rentalInfo.payments || []).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {t(`utility.months.${payment.month}`)} {payment.year}
                        </TableCell>
                        <TableCell>
                          {payment.amount} {rentalInfo.currency}
                        </TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={t(`rental.status_${payment.status}`)}
                            color={
                              payment.status === "paid"
                                ? "success"
                                : payment.status === "overdue"
                                ? "error"
                                : "warning"
                            }
                            size="small"
                            onClick={() => {
                              const nextStatus: Record<string, RentalPayment["status"]> = {
                                paid: "overdue",
                                overdue: "partial",
                                partial: "paid",
                              };
                              updatePaymentStatus(payment.id, nextStatus[payment.status]);
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeletePayment(payment.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!rentalInfo.payments || rentalInfo.payments.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="textSecondary" py={4}>
                            {t("common.no_data")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1" color="textSecondary">
          {t("dashboard.all_addresses")}
        </Typography>
      )}
    </Box>
  );
};

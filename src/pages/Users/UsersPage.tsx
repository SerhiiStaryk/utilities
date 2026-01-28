import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  OutlinedInput,
  Chip,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { getUsers, updateUserRole, getAddresses, updateAllowedAddresses } from "../../firebase/firestore";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { AddressDoc } from "../../types/firestore";

export const UsersPage = () => {
  const { t } = useTranslation();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<{ id: string; role: string; email: string; allowedAddresses?: string[] }[]>([]);
  const [addresses, setAddresses] = useState<{ id: string; data: AddressDoc }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [role, navigate]);

  const fetchData = async () => {
    try {
      const [userData, addrData] = await Promise.all([getUsers(), getAddresses()]);
      setUsers(userData);
      setAddresses(addrData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (uid: string, newRole: "admin" | "user") => {
    try {
      await updateUserRole(uid, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, role: newRole } : u))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleAllowedAddressesChange = async (uid: string, selectedIds: string[]) => {
    try {
      await updateAllowedAddresses(uid, selectedIds);
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, allowedAddresses: selectedIds } : u))
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate("/settings")} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          {t("settings.user_management", "User Management")}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("common.email", "Email")}</TableCell>
              <TableCell>{t("common.role", "Role")}</TableCell>
              <TableCell>{t("settings.authorized_addresses", "Authorized Addresses")}</TableCell>
              <TableCell align="right">{t("common.actions", "Actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      textTransform: "capitalize",
                      color: user.role === "admin" ? "primary.main" : "text.secondary",
                      fontWeight: user.role === "admin" ? "bold" : "normal",
                    }}
                  >
                    {user.role}
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 300 }}>
                  <Select
                    multiple
                    size="small"
                    fullWidth
                    value={user.allowedAddresses || []}
                    onChange={(e) => handleAllowedAddressesChange(user.id, e.target.value as string[])}
                    input={<OutlinedInput size="small" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const addr = addresses.find((a) => a.id === value);
                          return (
                            <Chip 
                              key={value} 
                              label={addr ? `${addr.data.street} ${addr.data.house_number}` : value} 
                              size="small" 
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {addresses.map((addr) => (
                      <MenuItem key={addr.id} value={addr.id}>
                        <Checkbox checked={(user.allowedAddresses || []).indexOf(addr.id) > -1} />
                        <ListItemText primary={`${addr.data.street} ${addr.data.house_number}, ${addr.data.city}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align="right">
                  <Select
                    size="small"
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as "admin" | "user")
                    }
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="user">{t("common.role_user", "User")}</MenuItem>
                    <MenuItem value="admin">{t("common.role_admin", "Admin")}</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};


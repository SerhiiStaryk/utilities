import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useAuth } from "@/app/providers/AuthProvider";
import { getAddresses } from "@/firebase/firestore";
import { AddressDoc } from "@/types/firestore";

export const AddressListPage = () => {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<{ id: string; data: AddressDoc }[]>([]);
  const { role, allowedAddresses } = useAuth();
  const isAdmin = role === "admin";

  useEffect(() => {
    getAddresses()
      .then((allAddresses) => {
        if (isAdmin) {
          setAddresses(allAddresses);
        } else {
          const filtered = allAddresses.filter((addr) => allowedAddresses?.includes(addr.id));
          setAddresses(filtered);
        }
      })
      .catch(console.error);
  }, [isAdmin, allowedAddresses]);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {t("nav.addresses")}
        </Typography>
        {isAdmin && (
          <Button
            component={Link}
            to="create"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {t("dashboard.new_address")}
          </Button>
        )}
      </Stack>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            {t("address.list_title")}
          </Typography>
          {addresses.length === 0 ? (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              {t("address.no_addresses", "No addresses found. Create one!")}
            </Typography>
          ) : (
            <List>
              {addresses.map((addr) => (
                <ListItem key={addr.id} disablePadding>
                  <ListItemButton component={Link} to={addr.id}>
                    <ListItemIcon>
                      <LocationOnIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${addr.data.city}, ${addr.data.street} ${addr.data.house_number}${addr.data.flat_number ? `, ${t("address.flat_short", "кв.")} ${addr.data.flat_number}` : ""}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

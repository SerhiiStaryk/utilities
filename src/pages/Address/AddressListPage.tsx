import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { getAddresses } from "../../firebase/firestore";
import { AddressDoc } from "../../types/firestore";

export const AddressListPage = () => {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<{ id: string; data: AddressDoc }[]>([]);

  useEffect(() => {
    getAddresses().then(setAddresses).catch(console.error);
  }, []);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={4}
        gap={2}
      >
        <Typography variant="h4" fontWeight="bold">
          {t("nav.addresses")}
        </Typography>
        <Button
          component={Link}
          to="create"
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth={{ xs: true, sm: false } as any}
        >
          {t("dashboard.new_address")}
        </Button>
      </Stack>


      <Grid container spacing={3}>
        <Grid size={12}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                {t("address.list_title")}
              </Typography>
              <List>
                {addresses.map((addr) => (
                  <ListItem key={addr.id} disablePadding>
                    <ListItemButton component={Link} to={addr.id}>
                      <ListItemIcon>
                        <LocationOnIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${addr.data.city}, ${addr.data.street} ${addr.data.house_number}${addr.data.flat_number ? `, кв. ${addr.data.flat_number}` : ""}`}
                      />

                    </ListItemButton>
                  </ListItem>
                ))}
                {addresses.length === 0 && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    No addresses found. Create one!
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

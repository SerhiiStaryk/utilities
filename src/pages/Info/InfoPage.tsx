import {
  Phone,
  Language,
  LocalFireDepartment,
  LocalPolice,
  MedicalServices,
  GasMeter,
  ElectricBolt,
  WaterDrop,
  HotTub,
  Wifi,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export const InfoPage = () => {
  const { t } = useTranslation();

  const emergencyContacts = [
    { name: t("info.fire"), phone: "101", icon: <LocalFireDepartment color="error" /> },
    { name: t("info.police"), phone: "102", icon: <LocalPolice color="primary" /> },
    { name: t("info.ambulance"), phone: "103", icon: <MedicalServices color="error" /> },
    { name: t("info.gas_emergency"), phone: "104", icon: <GasMeter color="warning" /> },
  ];

  const utilityServices = [
    {
      name: t("info.electricity"),
      desc: t("info.electricity_desc"),
      phone: "0800 50 15 88",
      site: "https://yasno.com.ua",
      icon: <ElectricBolt color="primary" />,
    },
    {
      name: t("info.gas"),
      desc: t("info.gas_desc"),
      phone: "066 300 2 888",
      site: "https://gas.ua",
      icon: <GasMeter color="warning" />,
    },
    {
      name: t("info.water"),
      desc: t("info.water_desc"),
      phone: "044 202 0202",
      site: "https://vodokanal.kiev.ua",
      icon: <WaterDrop color="info" />,
    },
    {
      name: t("info.heating"),
      desc: t("info.heating_desc"),
      phone: "044 247 4040",
      site: "https://kte.kmda.gov.ua",
      icon: <HotTub color="error" />,
    },
    {
      name: t("info.internet"),
      desc: t("info.internet_desc"),
      phone: "-",
      site: "https://lanet.ua",
      icon: <Wifi color="secondary" />,
    },
  ];

  return (
    <Box sx={{ pb: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        {t("info.title")}
      </Typography>

      <Grid container spacing={4}>
        {/* Emergency Section */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Phone fontSize="small" /> {t("info.emergency")}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {t("info.emergency_desc")}
          </Typography>
          <Stack sx={{ gap: 2 }}>
            {emergencyContacts.map((contact) => (
              <Card
                key={contact.phone}
                sx={{
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent sx={{ py: "16px !important" }}>
                  <Stack
                    sx={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Stack sx={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
                      {contact.icon}
                      <Typography sx={{ fontWeight: 500 }}>{contact.name}</Typography>
                    </Stack>
                    <Typography
                      variant="h5"
                      color="primary"
                      component="a"
                      href={`tel:${contact.phone}`}
                      sx={{ textDecoration: "none", fontWeight: "bold" }}
                    >
                      {contact.phone}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* Utilities Section */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Language fontSize="small" /> {t("info.utility_services")}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {t("info.utility_desc")}
          </Typography>
          <Stack sx={{ gap: 2 }}>
            {utilityServices.map((service) => (
              <Card key={service.name}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                        {service.icon}
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {service.desc}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <List dense sx={{ py: 0 }}>
                        {service.phone !== "-" && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <Phone fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={<Typography variant="body2">{service.phone}</Typography>}
                            />
                          </ListItem>
                        )}
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <Language fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Link
                                href={service.site}
                                target="_blank"
                                rel="noopener"
                                sx={{ textDecoration: "none" }}
                              >
                                <Typography variant="body2">
                                  {service.site.replace("https://", "")}
                                </Typography>
                              </Link>
                            }
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

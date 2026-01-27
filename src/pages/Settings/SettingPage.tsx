import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Button,
} from "@mui/material";
import { Logout, Person, Notifications, DarkMode, Language, DeleteForever } from "@mui/icons-material";
import { logout } from "../../firebase/auth";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../app/providers/SettingsProvider";

export const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { hideDeleteButtons, setHideDeleteButtons } = useSettings();

  const changeLanguage = () => {
    const newLang = i18n.language === "en" ? "uk" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <Box maxWidth="md">
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        {t("settings.title")}
      </Typography>

      <Paper sx={{ mb: 3, overflow: "hidden" }}>
        <Typography variant="h6" sx={{ p: 2, bgcolor: "action.hover" }}>
          {t("settings.account")}
        </Typography>
        <Divider />
        <List>
          <ListItem>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary={t("settings.profile")} secondary={t("settings.profile_desc")} />
            <Button color="inherit">{t("settings.edit")}</Button>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <Logout color="error" />
            </ListItemIcon>
            <ListItemText
              primary={t("settings.sign_out")}
              primaryTypographyProps={{ color: "error" }}
            />
            <Button variant="outlined" color="error" onClick={logout} size="small">
              {t("nav.logout")}
            </Button>
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ mb: 3, overflow: "hidden" }}>
        <Typography variant="h6" sx={{ p: 2, bgcolor: "action.hover" }}>
          {t("settings.preferences")}
        </Typography>
        <Divider />
        <List>
          <ListItem>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText
              primary={t("settings.notifications")}
              secondary={t("settings.notifications_desc")}
            />
            <Switch defaultChecked />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <DeleteForever />
            </ListItemIcon>
            <ListItemText
              primary={t("settings.hide_delete")}
              secondary={t("settings.hide_delete_desc")}
            />
            <Switch
              checked={hideDeleteButtons}
              onChange={(e) => setHideDeleteButtons(e.target.checked)}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <DarkMode />
            </ListItemIcon>
            <ListItemText
              primary={t("settings.dark_mode")}
              secondary={t("settings.dark_mode_desc")}
            />
            <Switch defaultChecked disabled />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            <ListItemText
              primary={t("settings.language")}
              secondary={t("settings.language_desc")}
            />
            <Button color="inherit" onClick={changeLanguage}>
              {i18n.language === "en" ? "English" : "Українська"}
            </Button>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

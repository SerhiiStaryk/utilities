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
import { Logout, Person, DarkMode, Language, DeleteForever, People, Download, Upload } from "@mui/icons-material";
import { logout } from "../../firebase/auth";
import {
  getGlobalBackupData,
  restoreGlobalFromBackup,
} from "../../firebase/firestore";
import { toast } from "react-toastify";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../app/providers/SettingsProvider";
import { useAuth } from "../../app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

export const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { hideDeleteButtons, setHideDeleteButtons, themeMode, setThemeMode } = useSettings();

  const { role } = useAuth();
  const isAdmin = role === "admin";
  const navigate = useNavigate();

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const changeLanguage = () => {
    const newLang = i18n.language === "en" ? "uk" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleGlobalBackup = async () => {
    setIsBackingUp(true);
    try {
      const data = await getGlobalBackupData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `global_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(t("common.save_success", "Backup downloaded successfully"));
    } catch (e) {
      console.error(e);
      toast.error("Failed to create backup");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleGlobalRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);
        await restoreGlobalFromBackup(backupData);
        toast.success(t("common.save_success", "Restored successfully"));
      } catch (err) {
        console.error("Restore error:", err);
        toast.error("Failed to restore backup");
      } finally {
        setIsRestoring(false);
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <Box maxWidth="md">
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        {t("settings.title")}
      </Typography>

      {isAdmin && (
        <Paper sx={{ mb: 3, overflow: "hidden" }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: "action.hover" }}>
            {t("settings.admin_tools", "Admin Tools")}
          </Typography>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <ListItemText
                primary={t("settings.user_management", "User Management")}
                secondary={t("settings.user_management_desc", "Manage user roles and permissions")}
              />
              <Button onClick={() => navigate("/users")}>{t("settings.open", "Open")}</Button>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <Download />
              </ListItemIcon>
              <ListItemText
                primary={t("settings.global_backup", "Global Backup")}
                secondary={t("settings.global_backup_desc", "Export all system data to JSON")}
              />
              <Button onClick={handleGlobalBackup} disabled={isBackingUp}>
                {isBackingUp ? t("common.saving") : t("settings.open")}
              </Button>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <Upload />
              </ListItemIcon>
              <ListItemText
                primary={t("settings.global_restore", "Global Restore")}
                secondary={t("settings.global_restore_desc", "Restore all system data from JSON")}
              />
              <input
                type="file"
                accept=".json"
                id="global-restore-upload"
                style={{ display: "none" }}
                onChange={handleGlobalRestore}
              />
              <label htmlFor="global-restore-upload">
                <Button component="span" disabled={isRestoring}>
                  {isRestoring ? t("common.saving") : t("settings.open")}
                </Button>
              </label>
            </ListItem>
          </List>
        </Paper>
      )}

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
            <Button color="inherit" onClick={() => navigate("/settings/profile")}>
              {t("settings.edit")}
            </Button>
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
          {isAdmin && (
            <>
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
            </>
          )}
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <DarkMode />
            </ListItemIcon>
            <ListItemText
              primary={t("settings.dark_mode")}
              secondary={t("settings.dark_mode_desc")}
            />
            <Switch
              checked={themeMode === "dark"}
              onChange={(e) => setThemeMode(e.target.checked ? "dark" : "light")}
            />
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

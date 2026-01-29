import { useState } from "react";
import { Box, Typography, Paper, Button, Stack, IconButton, Avatar, Divider } from "@mui/material";
import { ArrowBack, CameraAlt } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { Input } from "../../components/Input";
import { updateUserProfile } from "../../firebase/auth";
import { syncUserProfile } from "../../firebase/firestore";

import { toast } from "react-toastify";

export const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(displayName, photoURL);
      await syncUserProfile(user.uid, { displayName, photoURL });
      toast.success(t("profile.save_success", "Profile updated successfully"));
      navigate("/settings");
    } catch (e) {
      console.error(e);
      toast.error(t("profile.save_error", "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box maxWidth="sm" mx="auto">
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate("/settings")} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          {t("settings.profile")}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <Stack spacing={4} alignItems="center">
          <Box position="relative">
            <Avatar src={photoURL} sx={{ width: 120, height: 120, fontSize: "3rem" }}>
              {displayName ? displayName[0].toUpperCase() : user?.email?.[0].toUpperCase()}
            </Avatar>
            <IconButton
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
              }}
              size="small"
            >
              <CameraAlt fontSize="small" />
            </IconButton>
          </Box>

          <Box width="100%">
            <Typography variant="subtitle2" gutterBottom color="textSecondary">
              {t("common.email", "Email")}
            </Typography>
            <Typography variant="body1" mb={3}>
              {user?.email}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              <Input
                label={t("profile.display_name", "Display Name")}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
              />
              <Input
                label={t("profile.photo_url", "Photo URL")}
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </Stack>
          </Box>

          <Box display="flex" justifyContent="flex-end" width="100%" gap={2}>
            <Button onClick={() => navigate("/settings")} color="inherit">
              {t("address.create.cancel")}
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? t("common.saving", "Saving...") : t("utility.submit")}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

import { Box, Button, Typography, Stack } from "@mui/material";
import { Modal } from "./Modal";
import { useTranslation } from "react-i18next";
import { WarningAmber } from "@mui/icons-material";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  loading?: boolean;
}

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmColor = "error",
  loading = false,
}: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      additionalStyles={{ minWidth: 400 }}
      footer={
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            {cancelText || t("address.create.cancel", "Cancel")}
          </Button>
          <Button variant="contained" color={confirmColor} onClick={onConfirm} disabled={loading}>
            {loading ? "..." : confirmText || t("common.confirm", "Confirm")}
          </Button>
        </Box>
      }
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <WarningAmber color={confirmColor} sx={{ fontSize: 40 }} />
        <Typography variant="body1">{message}</Typography>
      </Stack>
    </Modal>
  );
};

import {
  Backdrop,
  Modal as ModalUI,
  Fade,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  IconButton,
  SxProps,
} from "@mui/material";

import { Close } from "@mui/icons-material";
import { PropsWithChildren, ReactNode } from "react";
import { StyledModalContent } from "./styles";

export type GenericModalProps = PropsWithChildren & {
  title: string;
  open: boolean;
  onClose: () => void;
  footer?: ReactNode;
  additionalStyles?: SxProps;
};

export const GenericModal = ({
  title,
  open,
  onClose,
  children,
  footer,
  additionalStyles,
}: GenericModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ModalUI
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      hideBackdrop={isMobile}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <StyledModalContent sx={additionalStyles}>
          {/* Fixed Header */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              zIndex: 1,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            <IconButton onClick={onClose} size="small" autoFocus>
              <Close />
            </IconButton>
          </Box>

          {/* Scrollable Content */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: { xs: 2, sm: 4 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </Box>

          {/* Fixed Footer */}
          {footer && (
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                zIndex: 1,
              }}
            >
              {footer}
            </Box>
          )}
        </StyledModalContent>
      </Fade>
    </ModalUI>
  );
};

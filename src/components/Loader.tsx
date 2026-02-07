import { Box, CircularProgress, Typography, useTheme, keyframes } from "@mui/material";

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
`;

interface LoaderProps {
  message?: string;
  fullPage?: boolean;
  button?: boolean;
}

export const Loader = ({ message, fullPage = false, button = false }: LoaderProps) => {
  const theme = useTheme();

  if (button) {
    return (
      <CircularProgress
        size={20}
        thickness={5}
        sx={{ color: "inherit" }}
      />
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: fullPage ? "100vh" : "200px",
        width: "100%",
        position: fullPage ? "fixed" : "relative",
        top: 0,
        left: 0,
        zIndex: theme.zIndex.modal + 1,
        backgroundColor: fullPage ? theme.palette.background.default : "transparent",
      }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          size={fullPage ? 60 : 40}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            animationDuration: "550ms",
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: `${pulse} 2s infinite ease-in-out`,
          }}
        >
          <Box
            sx={{
              width: fullPage ? 12 : 8,
              height: fullPage ? 12 : 8,
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.main,
            }}
          />
        </Box>
      </Box>
      {message && (
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            fontWeight: 500,
            color: theme.palette.text.secondary,
            letterSpacing: "0.05em",
            animation: `${pulse} 2s infinite ease-in-out`,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

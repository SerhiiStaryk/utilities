import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Card,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";

import logo from "@/assets/logo.png";
import { useLogin } from "@/hooks/useLogin";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "background.default",
        padding: isMobile ? 2 : 0,
      }}
    >
      <Card
        sx={{
          p: 4,
          width: "100%",
          maxWidth: isMobile ? "100%" : 400,
          boxShadow: isMobile ? "none" : undefined,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
          <img src={logo} alt="Logo" style={{ height: 52, marginRight: 8 }} />
          <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold" }}>
            Комуналка
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastContainer } from "react-toastify";

import { getAppTheme } from "@/constants/theme";
import { ModalController } from "@/controller/modal.controller";

import { AuthProvider } from "./providers/AuthProvider";
import "react-toastify/dist/ReactToastify.css";

import AppRouterProvider from "./providers/RouterProvider";
import { SettingsProvider, useSettings } from "./providers/SettingsProvider";

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { themeMode } = useSettings();
  const theme = getAppTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

const App = () => (
  <AuthProvider>
    <SettingsProvider>
      <ThemeWrapper>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ModalController>
            <AppRouterProvider />
            <ToastContainer position="bottom-right" autoClose={3000} />
          </ModalController>
        </LocalizationProvider>
      </ThemeWrapper>
    </SettingsProvider>
  </AuthProvider>
);

export default App;

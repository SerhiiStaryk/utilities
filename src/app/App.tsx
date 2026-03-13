import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";

import { getAppTheme } from "@/constants/theme";
import { ModalController } from "@/controller/modal.controller";

import { AuthProvider } from "./providers/AuthProvider";
import AppRouterProvider from "./providers/RouterProvider";
import { SettingsProvider, useSettings } from "./providers/SettingsProvider";
import "react-toastify/dist/ReactToastify.css";

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
        <ModalController>
          <AppRouterProvider />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </ModalController>
      </ThemeWrapper>
    </SettingsProvider>
  </AuthProvider>
);

export default App;

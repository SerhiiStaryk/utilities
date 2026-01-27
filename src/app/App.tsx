import { ThemeProvider } from "@mui/material";
import { theme } from "../constants/theme";
import AppRouterProvider from "./providers/RouterProvider ";
import { AuthProvider } from "./providers/AuthProvider";
import { ModalController } from "../controller/modal.controller";
import { SettingsProvider } from "./providers/SettingsProvider";

const App = () => (
  <SettingsProvider>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <ModalController>
          <AppRouterProvider />
        </ModalController>
      </ThemeProvider>
    </AuthProvider>
  </SettingsProvider>
);

export default App;

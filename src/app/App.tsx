import { ThemeProvider } from '@mui/material';
import { theme } from '../constants/theme';
import AppRouterProvider from './providers/RouterProvider ';
import { AuthProvider } from './providers/AuthProvider';
import { ModalController } from '../controller/modal.controller';

const App = () => (
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <ModalController>
        <AppRouterProvider />
      </ModalController>
    </ThemeProvider>
  </AuthProvider>
);

export default App;

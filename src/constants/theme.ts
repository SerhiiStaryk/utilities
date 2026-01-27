import { createTheme, ThemeOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    meter: {
      hot: string;
      cold: string;
      gas: string;
      electric: string;
    };
  }
  interface PaletteOptions {
    meter?: {
      hot?: string;
      cold?: string;
      gas?: string;
      electric?: string;
    };
  }
}

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#FFC107",
      light: "#FFECB3",
      dark: "#FFA000",
      contrastText: "#263238",
    },
    secondary: {
      main: "#FF5722",
    },
    background: {
      default: "#F4F7F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#263238",
      secondary: "#607D8B",
    },

    meter: {
      hot: "#F44336",
      cold: "#2196F3",
      gas: "#4CAF50",
      electric: "#FFC107",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E0E0E0",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export { theme };

import { createTheme, responsiveFontSizes } from "@mui/material";

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

export const getAppTheme = (mode: "light" | "dark") => {
  const themeInstance = createTheme({
    palette: {
      mode,
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
        default: mode === "light" ? "#F4F7F9" : "#121212",
        paper: mode === "light" ? "#FFFFFF" : "#1E1E1E",
      },
      text: {
        primary: mode === "light" ? "#263238" : "#ECEFF1",
        secondary: mode === "light" ? "#607D8B" : "#B0BEC5",
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
            border: mode === "light" ? "1px solid #E0E0E0" : "1px solid #333333",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });

  return responsiveFontSizes(themeInstance);
};

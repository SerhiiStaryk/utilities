import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { getUserSettings, updateUserSettings } from "../../firebase/firestore";

export type ThemeMode = "light" | "dark";

interface SettingsContextType {
  hideDeleteButtons: boolean;
  setHideDeleteButtons: (value: boolean) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  loading: boolean;
}


const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hideDeleteButtons, setHideDeleteButtonsState] = useState<boolean>(() => {
    const saved = localStorage.getItem("hideDeleteButtons");
    return saved === "true";
  });
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("themeMode") as ThemeMode;
    return saved || "light";
  });

  // Load settings from Firestore when user logs in
  useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        setLoading(true);
        const remoteSettings = await getUserSettings(user.uid);
        if (remoteSettings) {
          if (remoteSettings.hideDeleteButtons !== undefined) {
            setHideDeleteButtonsState(remoteSettings.hideDeleteButtons);
            localStorage.setItem("hideDeleteButtons", String(remoteSettings.hideDeleteButtons));
          }
          if (remoteSettings.themeMode !== undefined) {
            setThemeModeState(remoteSettings.themeMode);
            localStorage.setItem("themeMode", remoteSettings.themeMode);
          }
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const setHideDeleteButtons = async (value: boolean) => {
    setHideDeleteButtonsState(value);
    localStorage.setItem("hideDeleteButtons", String(value));
    
    if (user) {
      try {
        await updateUserSettings(user.uid, { hideDeleteButtons: value });
      } catch (e) {
        console.error("Failed to save settings to Firestore", e);
      }
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem("themeMode", mode);
    
    if (user) {
      try {
        await updateUserSettings(user.uid, { themeMode: mode });
      } catch (e) {
        console.error("Failed to save theme setting to Firestore", e);
      }
    }
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        hideDeleteButtons, 
        setHideDeleteButtons, 
        themeMode, 
        setThemeMode, 
        loading 
      }}
    >

      {children}
    </SettingsContext.Provider>
  );
};


export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

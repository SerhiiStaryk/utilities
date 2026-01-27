import { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  hideDeleteButtons: boolean;
  setHideDeleteButtons: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [hideDeleteButtons, setHideDeleteButtonsState] = useState<boolean>(() => {
    const saved = localStorage.getItem("hideDeleteButtons");
    return saved === "true";
  });

  const setHideDeleteButtons = (value: boolean) => {
    setHideDeleteButtonsState(value);
    localStorage.setItem("hideDeleteButtons", String(value));
  };

  return (
    <SettingsContext.Provider value={{ hideDeleteButtons, setHideDeleteButtons }}>
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

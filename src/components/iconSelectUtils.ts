import {
  FlashOn,
  WaterDrop,
  Whatshot,
  Wifi,
  Home,
  DeleteOutlineOutlined,
  Thermostat,
  QuestionMark,
  Security,
} from "@mui/icons-material";

import type React from "react";

export const SERVICE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  ElectricityIcon: { icon: FlashOn, color: "#fbc02d" },
  WaterIcon: { icon: WaterDrop, color: "#0288d1" },
  GasIcon: { icon: Whatshot, color: "#f4511e" },
  InternetIcon: { icon: Wifi, color: "#7b1fa2" },
  HousingIcon: { icon: Home, color: "#455a64" },
  WasteIcon: { icon: DeleteOutlineOutlined, color: "#689f38" },
  HeatingIcon: { icon: Thermostat, color: "#e64a19" },
  SecurityIcon: { icon: Security, color: "#1976d2" },
  DefaultIcon: { icon: QuestionMark, color: "" },
};

export interface IconSelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  label?: string;
  error?: boolean;
}

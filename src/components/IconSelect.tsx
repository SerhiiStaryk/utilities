import { forwardRef } from "react";
import { MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  FlashOn,
  WaterDrop,
  Whatshot,
  Wifi,
  Home,
  DeleteOutline,
  Thermostat,
  QuestionMark,
  Security,
} from "@mui/icons-material";

export const SERVICE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  ElectricityIcon: { icon: FlashOn, color: "#fbc02d" },
  WaterIcon: { icon: WaterDrop, color: "#0288d1" },
  GasIcon: { icon: Whatshot, color: "#f4511e" },
  InternetIcon: { icon: Wifi, color: "#7b1fa2" },
  HousingIcon: { icon: Home, color: "#455a64" },
  WasteIcon: { icon: DeleteOutline, color: "#689f38" },
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

export const IconSelect = forwardRef<HTMLSelectElement, IconSelectProps>(
  ({ value, onChange, onBlur, name, label, error }, ref) => {
    const { t } = useTranslation();

    return (
      <FormControl fullWidth size="small" error={error}>
        <InputLabel>{label || t("utility.icon", "Icon")}</InputLabel>
        <Select
          ref={ref as any}
          name={name}
          onBlur={onBlur}
          value={value || "DefaultIcon"}
          label={label || t("utility.icon", "Icon")}
          onChange={(e) => onChange(e.target.value)}
          renderValue={(selected) => {
            const IconComponent = SERVICE_ICONS[selected]?.icon || QuestionMark;
            const color = SERVICE_ICONS[selected]?.color;
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconComponent sx={{ color }} fontSize="small" />
                {selected.replace("Icon", "")}
              </Box>
            );
          }}
        >
          {Object.keys(SERVICE_ICONS).map((key) => {
            const IconComponent = SERVICE_ICONS[key].icon;
            const color = SERVICE_ICONS[key].color;
            return (
              <MenuItem key={key} value={key}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconComponent sx={{ color }} fontSize="small" />
                  {key.replace("Icon", "")}
                </Box>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  }
);

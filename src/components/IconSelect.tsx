import { MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";

import { SERVICE_ICONS, IconSelectProps } from "./iconSelectUtils";
export { SERVICE_ICONS } from "./iconSelectUtils";

export const IconSelect = forwardRef<HTMLSelectElement, IconSelectProps>(
  ({ value, onChange, onBlur, name, label, error }, ref) => {
    const { t } = useTranslation();

    return (
      <FormControl fullWidth size="small" error={error}>
        <InputLabel>{label || t("utility.icon", "Icon")}</InputLabel>
        <Select
          ref={ref as React.Ref<HTMLSelectElement>}
          name={name}
          onBlur={onBlur}
          value={value || "DefaultIcon"}
          label={label || t("utility.icon", "Icon")}
          onChange={(e) => onChange(e.target.value)}
          renderValue={(selected) => {
            const IconComponent = SERVICE_ICONS[selected]?.icon || SERVICE_ICONS.DefaultIcon.icon;
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
  },
);

IconSelect.displayName = "IconSelect";

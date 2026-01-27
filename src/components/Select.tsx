import { forwardRef } from "react";
import { Select as MuiSelect, InputLabel, FormControl, MenuItem } from "@mui/material";

type SelectProps = React.ComponentProps<typeof MuiSelect> & {
  label: string;
  options: Array<{
    value: string | number;
    label: string;
  }>;
};

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ label, options, ...selectProps }, ref) => {
    return (
      <FormControl variant="standard" fullWidth>
        <InputLabel>{label}</InputLabel>
        <MuiSelect {...selectProps} ref={ref}>
          {options.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    );
  },
);

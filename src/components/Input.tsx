import React, { forwardRef } from "react";
import { FormControl, InputLabel, Input as MuiInput, FormHelperText } from "@mui/material";

type InputProps = React.ComponentProps<typeof MuiInput> & {
  label: string;
  value: string;
  helperText?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, ...inputProps }, ref) => (
    <FormControl error={error} fullWidth variant="standard">
      <InputLabel>{label}</InputLabel>
      <MuiInput {...inputProps} inputRef={ref} />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  ),
);


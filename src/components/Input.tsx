import { FormControl, InputLabel, Input as MuiInput, FormHelperText } from '@mui/material';

type InputProps = React.ComponentProps<typeof MuiInput> & {
  label: string;
  value: string;
  helperText?: string;
};

export const Input = ({ label, helperText, error, ...inputProps }: InputProps) => (
  <FormControl error={error} fullWidth variant="standard">
    <InputLabel>{label}</InputLabel>
    <MuiInput
      {...inputProps}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);

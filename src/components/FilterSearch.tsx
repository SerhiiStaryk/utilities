import {
  MenuItem,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  SxProps,
} from "@mui/material";
import { ReactNode, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

type FilterSearchProps = {
  formControlStyle?: SxProps;
  value: string;
  label: string;
  hasAll?: boolean;
  handleChange: (value: SetStateAction<string>) => void
  options: ReactNode;
};

export const FilterSearch = ({ formControlStyle, value, label, handleChange, options, hasAll = true }: FilterSearchProps) => {
  const { t } = useTranslation();

  return (
    <FormControl size="small" sx={formControlStyle}>
      <InputLabel>{t(`${label}`)}</InputLabel>
      <MuiSelect
        value={value}
        label={t(`${label}`)}
        onChange={(e) => handleChange(e.target.value)}
      >
        {hasAll && <MenuItem value="all">{t("common.all")}</MenuItem>}
        {options}
      </MuiSelect>
    </FormControl>
  );
};  
import {
  Table as TableMui,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { MONTHS } from "@/constants/months";
import useAddressCategories from "@/hooks/useAddressCategories";

type CategoryRow = {
  id: string;
  monthly?: Record<string, string | number | null>;
};

type TableProps = {
  addressId: string;
  yearId: string;
  data?: CategoryRow[];
};

const Table = ({ addressId, yearId, data: externalData }: TableProps) => {
  const { t } = useTranslation();
  const { data: hookData } = useAddressCategories(addressId, yearId);

  const rows: CategoryRow[] = externalData ?? hookData ?? [];

  return (
    <TableContainer component={Paper}>
      <TableMui sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Категорія</TableCell>
            {MONTHS.map((month) => (
              <TableCell key={month} align="right">
                {t(`utility.months.${month}`)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              {MONTHS.map((month) => (
                <TableCell key={month} align="right">
                  {item.monthly?.[month] ?? "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableMui>
    </TableContainer>
  );
};

export default Table;

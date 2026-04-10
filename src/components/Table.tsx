import {
  Table as TableMui,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";

import { MONTHS, Month } from "@/constants/months";
import useAddressCategories from "@/hooks/useAddressCategories";

const monthLabels: Record<Month, string> = {
  [Month.JAN]: "Січень",
  [Month.FEB]: "Лютий",
  [Month.MAR]: "Березень",
  [Month.APR]: "Квітень",
  [Month.MAY]: "Травень",
  [Month.JUN]: "Червень",
  [Month.JUL]: "Липень",
  [Month.AUG]: "Серпень",
  [Month.SEP]: "Вересень",
  [Month.OCT]: "Жовтень",
  [Month.NOV]: "Листопад",
  [Month.DEC]: "Грудень",
};

type TableProps = {
  addressId: string;
  yearId: string;
  data?: any[];
};

const Table = ({ addressId, yearId, data: externalData }: TableProps) => {
  const { data: hookData, loading } = useAddressCategories(addressId, yearId);
  const [data, setData] = useState<any[]>(externalData ?? hookData ?? []);

  useEffect(() => {
    setData(externalData ?? hookData ?? []);
  }, [externalData, hookData]);

  return (
    <TableContainer component={Paper}>
      <TableMui sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Категорія</TableCell>
            {MONTHS.map((month) => (
              <TableCell key={month} align="right">
                {monthLabels[month]}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
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

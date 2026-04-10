import {
  Table as TableMui,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { MONTHS, Month } from "@/constants/months";
import { db } from "@/firebase/firebase.config";

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

const fetchData = async (setData: (value: any[]) => void) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, "addresses", "Dashkevycha", "years", "2020", "categories"),
    );
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setData(data);
  } catch (error) {
    console.error("Помилка отримання даних:", error);
  }
};

const Table = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchData(setData);
  }, []);

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

import { Table as TableMui, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase.config';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const monthLabels: Record<string, string> = {
  January: 'Січень',
  February: 'Лютий',
  March: 'Березень',
  April: 'Квітень',
  May: 'Травень',
  June: 'Червень',
  July: 'Липень',
  August: 'Серпень',
  September: 'Вересень',
  October: 'Жовтень',
  November: 'Листопад',
  December: 'Грудень',
};

const fetchData = async (setData: (value: any[]) => void) => {
  try {
    const querySnapshot = await getDocs(collection(db, '/addresses/Dashkevycha/years/2020/categories'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setData(data);
  } catch (error) {
    console.error('Помилка отримання даних:', error);
  }
};

const Table = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchData(setData);
  }, []);

  return (
    <TableContainer component={Paper}>
      <TableMui
        sx={{ minWidth: 650 }}
        size='small'
      >
        <TableHead>
          <TableRow>
            <TableCell>Категорія</TableCell>
            {months.map(month => (
              <TableCell
                key={month}
                align='right'
              >
                {monthLabels[month]}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              {months.map(month => (
                <TableCell
                  key={month}
                  align='right'
                >
                  {item.monthly?.[month] ?? '-'}
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

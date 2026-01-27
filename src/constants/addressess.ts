import { Address } from '../types/common';

export type AddressID = 'Mazepy' | 'Levandivska' | 'Dashkevicha' | 'Haidamatska';
export type Addresses = Record<AddressID, Address>;

export const addresses = {
  Mazepy: {
    city: 'Lviv',
    street: 'Mazepy',
    buildingNumber: '9-a',
    apartmentNumber: '68',
  },
  Levandivska: {
    city: 'Lviv',
    street: 'Levandivska',
    buildingNumber: '15a',
    apartmentNumber: '10',
  },
  Dashkevicha: {
    city: 'Lviv',
    street: 'Dashkevicha',
    buildingNumber: '31',
    apartmentNumber: '6',
  },
  Haidamatska: {
    city: 'Lviv',
    street: 'Haidamatska',
    buildingNumber: '4',
    apartmentNumber: '3a',
  },
};

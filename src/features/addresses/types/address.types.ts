import { ID, Timestamp } from '../../../types/common';

export interface Address {
  id: ID; // Firestore document ID
  label: string; // напр. "Мазепи"
  description?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

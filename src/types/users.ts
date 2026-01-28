import { Timestamp } from "./common";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: 'admin' | 'user';
  allowedAddresses?: string[];
  createdAt: Timestamp | Date;
}


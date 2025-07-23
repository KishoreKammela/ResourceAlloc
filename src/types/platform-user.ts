import type { Timestamp } from 'firebase/firestore';

export type PlatformUserRole =
  | 'superAdmin'
  | 'admin'
  | 'moderator'
  | 'supportAgent'
  | 'dataAnalyst';

export type PlatformUser = {
  uid: string; // Firebase Auth UID
  email: string;
  firstName: string;
  lastName: string;
  role: PlatformUserRole;

  // Professional Information
  employeeId?: string;
  designation?: string;
  department?: string;

  // Access & Security
  isActive: boolean;
  lastLogin?: Timestamp;

  // Audit
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type UpdatablePlatformUserData = Partial<
  Omit<PlatformUser, 'uid' | 'email' | 'createdAt'>
>;

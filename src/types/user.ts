import type { Timestamp } from 'firebase/firestore';

export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Project Manager'
  | 'HR Manager'
  | 'Account Manager'
  | 'Viewer'
  | 'Employee'; // Added for backward compatibility, should be phased out.

export type TeamMember = {
  uid: string; // Firebase Auth UID
  companyId: string;
  email: string | null;
  emailVerified?: boolean;

  // Personal Info
  firstName: string;
  lastName: string;
  phone?: string;
  profilePictureUrl?: string;

  // Professional Info
  designation?: string;
  department?: 'Sales' | 'Operations' | 'HR' | 'Technical' | 'Management';

  // Access & Permissions
  role: UserRole;
  isActive: boolean;

  // Onboarding
  onboardingCompleted: boolean;
  resourceId?: string; // Link to the resource record if applicable

  // Audit
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export interface NewCompanyAdmin {
  name: string;
  email: string;
  password: string;
  companyName: string;
  companyWebsite?: string;
  companySize: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  designation: 'CEO' | 'Hiring Manager';
}

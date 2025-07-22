export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Recruiter'
  | 'Project Manager'
  | 'Employee';

export type AppUser = {
  uid: string;
  email: string | null;
  role: UserRole;
  emailVerified?: boolean;
  name?: string;
  companyId?: string;
  onboardingCompleted?: boolean;
  employeeId?: string; // Link to the employee record
  // New profile fields
  avatarUrl?: string;
  mobile?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string; // Storing as ISO string e.g., "1990-01-01"
  address?: {
    city?: string;
    state?: string;
  };
};

export interface NewCompanyUser {
  name: string;
  email: string;
  password: string;
  companyName: string;
  companyWebsite?: string;
  companySize: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  designation: 'CEO' | 'Hiring Manager';
}

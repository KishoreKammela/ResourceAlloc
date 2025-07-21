export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Recruiter'
  | 'Project Manager'
  | 'Employee';

export interface AppUser {
  uid: string;
  email: string | null;
  role: UserRole;
  emailVerified?: boolean;
  name?: string;
  designation?: 'CEO' | 'Hiring Manager' | string;
  companyId?: string;
  onboardingCompleted?: boolean;
}

export interface NewCompanyUser {
  name: string;
  designation: 'CEO' | 'Hiring Manager';
  email: string;
  password: string;
  companyName: string;
  companyWebsite?: string;
  companySize: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
}

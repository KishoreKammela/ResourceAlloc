export type UserRole = 'Super Admin' | 'Admin' | 'Recruiter' | 'Project Manager' | 'Employee';

export interface AppUser {
  uid: string;
  email: string | null;
  role: UserRole;
  emailVerified?: boolean;
}

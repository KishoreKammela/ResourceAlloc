export type Employee = {
  id: string;
  name: string;
  title: string;
  skills: string[];
  availability: 'Available' | 'On Project';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  status: 'Approved' | 'Pending';
  uid?: string; // Link to the AppUser
  email?: string;
  professionalSummary?: string;
  location?: string;
  compensation?: {
    salary?: number;
    billingRate?: number;
  };
};

export type UpdatableEmployeeData = Partial<Omit<Employee, 'id'>>;

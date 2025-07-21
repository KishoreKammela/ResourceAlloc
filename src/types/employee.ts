export type Employee = {
  id: string;
  uid: string; // Firebase Auth User ID
  name: string;
  title: string;
  skills: string[];
  availability: 'Available' | 'On Project';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  email?: string;
  professionalSummary?: string;
  location?: string;
  compensation?: {
    salary?: number;
    billingRate?: number;
  };
};

export type UpdatableEmployeeData = Partial<Omit<Employee, 'id' | 'uid'>>;

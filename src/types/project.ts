import type { Employee } from './employee';

export type Project = {
  id: string;
  name: string;
  client?: string; // Legacy field, to be replaced by clientId/clientName
  clientId?: string;
  clientName?: string;
  timeline: string;
  status: 'In Progress' | 'Completed' | 'Planning';
  description: string;
  requiredSkills: string[];
  team: Employee[];
  companyId: string;
};

export type UpdatableProjectData = Partial<Omit<Project, 'id'>>;

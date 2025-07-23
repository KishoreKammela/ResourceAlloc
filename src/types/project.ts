import type { Timestamp } from 'firebase/firestore';

export type Project = {
  id: string;
  companyId: string;
  clientId?: string;
  clientName?: string;
  projectCode?: string;
  projectName: string;
  projectDescription?: string;

  // Timeline
  plannedStartDate?: Timestamp;
  plannedEndDate?: Timestamp;
  actualStartDate?: Timestamp;
  actualEndDate?: Timestamp;

  // Status & Progress
  projectStatus: 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  healthStatus?: 'Green' | 'Yellow' | 'Red';
  progressPercentage?: number;

  // Budget & Financial
  projectBudget?: number;
  billingModel?: 'Fixed Price' | 'Time & Material' | 'Milestone-based';

  // Requirements
  requiredSkills?: string[];
  technologyStack?: string[];

  // Team
  projectManagerId?: string; // teamMember.id
  technicalLeadId?: string; // resource.id

  // This team field is for simple cases. For complex allocations,
  // the 'allocations' collection should be used.
  team: {
    resourceId: string;
    name: string;
    title: string;
  }[];

  // Audit
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // teamMember.id
  updatedBy: string; // teamMember.id
  isActive: boolean;
};

export type UpdatableProjectData = Partial<Omit<Project, 'id' | 'companyId'>>;

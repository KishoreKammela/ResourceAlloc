import type { Timestamp } from 'firebase/firestore';

export type Allocation = {
  id: string;
  companyId: string;
  resourceId: string;
  projectId: string;
  roleInProject: string;
  allocationPercentage: number; // 0-100
  allocationStartDate: Timestamp;
  allocationEndDate?: Timestamp;
  allocationStatus:
    | 'Planned'
    | 'Active'
    | 'On Hold'
    | 'Completed'
    | 'Cancelled';

  // Financials
  billingRate?: number; // Project-specific rate
  costRate?: number; // Internal cost
  currency?: string;

  // Management
  allocatedBy?: string; // teamMember.id
  approvedBy?: string; // teamMember.id
  approvalDate?: Timestamp;

  // Audit
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // teamMember.id
  updatedBy: string; // teamMember.id
};

export type UpdatableAllocationData = Partial<
  Omit<Allocation, 'id' | 'companyId' | 'resourceId' | 'projectId'>
>;

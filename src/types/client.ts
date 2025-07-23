import type { Timestamp } from 'firebase/firestore';

export type Client = {
  id: string;
  companyId: string;
  clientName: string;
  clientCode?: string;

  // Basic Information
  clientType?: 'Direct Client' | 'Partner' | 'Subcontractor' | 'Internal';
  industry?: string;
  website?: string;
  logoUrl?: string;

  // Contact Information
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;

  // Address
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  // Relationship Management
  accountManagerId?: string; // teamMember.id
  relationshipStatus?: 'Prospect' | 'Active' | 'Inactive' | 'On Hold';
  relationshipStartDate?: Timestamp;

  // Commercial Information
  paymentTerms?: string;
  billingCurrency?: string;
  standardBillingRate?: number;

  // Audit
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // teamMember.id
  updatedBy: string; // teamMember.id
  isActive: boolean;
};

export type UpdatableClientData = Partial<Omit<Client, 'id' | 'companyId'>>;

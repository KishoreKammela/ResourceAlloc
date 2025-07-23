import type { Timestamp } from 'firebase/firestore';

export type Company = {
  id: string;
  companyName: string;
  companyWebsite?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyLogoUrl?: string;

  // Address
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  // Business Analytics
  industry?: string;
  companyType?: 'Consultancy' | 'Product' | 'Hybrid' | 'Agency';
  companySizeRange: '1-10' | '11-50' | '51-200' | '201-500' | '500+';

  // Subscription
  subscriptionPlan?: 'Starter' | 'Professional' | 'Enterprise' | 'Custom';
  subscriptionStatus?: 'active' | 'trial' | 'suspended' | 'cancelled';

  // Platform Settings
  currency?: string;
  timezone?: string;

  // Audit
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
};

export type UpdatableCompanyData = Partial<Omit<Company, 'id'>>;

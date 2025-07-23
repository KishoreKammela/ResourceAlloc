import type { Timestamp } from 'firebase/firestore';

export type ResourceDocument = {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Timestamp;
};

export type Skill = {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  years?: number;
};

export type Education = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
};

export type Certification = {
  name: string;
  issuingOrganization: string;
  issuedDate: Timestamp;
  expiryDate?: Timestamp;
  credentialId?: string;
};

export type Resource = {
  id: string;
  companyId: string;
  resourceCode?: string;

  // Personal Info
  firstName: string;
  lastName: string;
  email: string; // Can be personal or work email
  phone?: string;
  profilePictureUrl?: string;

  // Professional Info
  designation: string; // Title
  seniorityLevel?:
    | 'Intern'
    | 'Junior'
    | 'Mid-level'
    | 'Senior'
    | 'Lead'
    | 'Principal';
  employmentType?: 'Full-time' | 'Part-time' | 'Contractor' | 'Freelancer';

  // Employment Details
  joiningDate?: Timestamp;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  employmentStatus: 'active' | 'inactive' | 'on_leave' | 'bench';

  // Experience & Education
  totalExperienceYears?: number;
  education?: Education[];
  certifications?: Certification[];

  // Skills
  technicalSkills?: Skill[];
  softSkills?: string[];

  // Availability
  availabilityStatus:
    | 'Available'
    | 'Partially Available'
    | 'Unavailable'
    | 'On Leave';
  currentAllocationPercentage?: number; // 0-100

  // Financial
  costCurrency?: string;
  costRate?: number; // Internal hourly cost
  billingCurrency?: string;
  billingRate?: number; // Standard client billing rate

  // Documents
  documents?: ResourceDocument[];

  // Audit
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // teamMember.id
  updatedBy: string; // teamMember.id
  isActive: boolean;
};

export type UpdatableResourceData = Partial<Omit<Resource, 'id' | 'companyId'>>;

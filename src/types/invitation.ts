import type { UserRole } from './user';
import type { Timestamp } from 'firebase/firestore';

export type InvitationStatus = 'pending' | 'accepted' | 'expired';

export type Invitation = {
  id: string; // The document ID
  companyId: string;
  email: string; // Email of the invitee
  role: UserRole;
  status: InvitationStatus;
  token: string; // Unique token for the invitation link
  createdAt: Timestamp;
  expiresAt: Timestamp;
};

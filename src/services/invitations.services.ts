import { db } from '@/lib/firebase/config';
import type { Invitation, InvitationStatus } from '@/types/invitation';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const invitationsCollection = collection(db, 'invitations');

/**
 * Creates a new invitation in Firestore.
 * @param companyId The ID of the company the user is being invited to.
 * @param email The email of the person being invited.
 * @param role The role assigned to the new user.
 * @returns The newly created invitation object.
 */
export async function createInvitation(
  companyId: string,
  email: string,
  role: Invitation['role']
): Promise<Invitation> {
  const token = uuidv4();
  const createdAt = serverTimestamp() as Timestamp;
  // Invitation expires in 7 days
  const expiresAt = new Timestamp(Date.now() / 1000 + 7 * 24 * 60 * 60, 0);

  const invitationData: Omit<Invitation, 'id' | 'createdAt'> = {
    companyId,
    email,
    role,
    token,
    status: 'pending',
    expiresAt,
  };

  const docRef = await addDoc(invitationsCollection, {
    ...invitationData,
    createdAt,
  });

  return {
    id: docRef.id,
    ...invitationData,
    createdAt: new Timestamp(Date.now() / 1000, 0),
  }; // Return with a client-side timestamp for immediate use
}

/**
 * Fetches an invitation by its token.
 * @param token The unique token of the invitation.
 * @returns The invitation object if found and valid, otherwise null.
 */
export async function getInvitationByToken(
  token: string
): Promise<Invitation | null> {
  const q = query(
    invitationsCollection,
    where('token', '==', token),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  const invitation = { id: doc.id, ...doc.data() } as Invitation;

  // Check if the invitation has expired
  if (invitation.expiresAt.toMillis() < Date.now()) {
    // Optionally, update status to 'expired' in Firestore here
    await updateInvitationStatus(invitation.id, 'expired');
    return null;
  }

  return invitation;
}

/**
 * Updates the status of an invitation.
 * @param invitationId The ID of the invitation document to update.
 * @param status The new status.
 */
export async function updateInvitationStatus(
  invitationId: string,
  status: InvitationStatus
): Promise<void> {
  const docRef = doc(db, 'invitations', invitationId);
  await updateDoc(docRef, { status });
}

/**
 * Fetches all invitations for a specific company.
 * @param companyId The ID of the company.
 * @returns An array of invitation objects.
 */
export async function getInvitationsByCompany(
  companyId: string
): Promise<Invitation[]> {
  try {
    const q = query(
      invitationsCollection,
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Invitation
    );
  } catch (error) {
    console.error('Error fetching invitations by company: ', error);
    return [];
  }
}

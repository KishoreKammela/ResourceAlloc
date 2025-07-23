import { db } from '@/lib/firebase/config';
import type { TeamMember } from '@/types/user';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

const usersCollection = collection(db, 'team_members'); // Changed collection name

/**
 * Creates a new team member profile in the 'team_members' collection.
 * @param uid The Firebase Auth UID of the user.
 * @param userData The user data to be stored.
 */
export async function createTeamMemberProfile(
  uid: string,
  userData: Omit<TeamMember, 'createdAt' | 'updatedAt'>
): Promise<void> {
  const timestamp = serverTimestamp();
  await setDoc(doc(db, 'team_members', uid), {
    ...userData,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

/**
 * Retrieves a team member's profile from Firestore.
 * @param uid The Firebase Auth UID of the user.
 * @returns The team member's profile object, or null if not found.
 */
export async function getTeamMemberProfile(
  uid: string
): Promise<Omit<TeamMember, 'uid'> | null> {
  const docRef = doc(db, 'team_members', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Omit<TeamMember, 'uid'>;
  } else {
    return null;
  }
}

/**
 * Updates a team member's profile.
 * @param uid The Firebase Auth UID of the user.
 * @param data The partial data to update.
 */
export async function updateTeamMemberProfile(
  uid: string,
  data: Partial<TeamMember>
): Promise<void> {
  const userRef = doc(db, 'team_members', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Fetches all team members for a specific company.
 * @param companyId The ID of the company.
 * @returns An array of team member objects.
 */
export async function getTeamMembersByCompany(
  companyId: string
): Promise<TeamMember[]> {
  try {
    const q = query(usersCollection, where('companyId', '==', companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), uid: doc.id }) as TeamMember
    );
  } catch (error) {
    console.error('Error fetching users by company: ', error);
    return [];
  }
}

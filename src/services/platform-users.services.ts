import { db } from '@/lib/firebase/config';
import type { PlatformUser } from '@/types/platform-user';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Creates a new platform user profile in the 'platform_users' collection.
 * @param uid The Firebase Auth UID of the user.
 * @param userData The user data to be stored.
 */
export async function createPlatformUserProfile(
  uid: string,
  userData: Omit<PlatformUser, 'uid' | 'createdAt' | 'updatedAt' | 'isActive'>
): Promise<void> {
  const timestamp = serverTimestamp();
  await setDoc(doc(db, 'platform_users', uid), {
    ...userData,
    uid,
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

/**
 * Retrieves a platform user's profile from Firestore.
 * @param uid The Firebase Auth UID of the user.
 * @returns The platform user's profile object, or null if not found.
 */
export async function getPlatformUserProfile(
  uid: string
): Promise<PlatformUser | null> {
  const docRef = doc(db, 'platform_users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { uid, ...docSnap.data() } as PlatformUser;
  } else {
    return null;
  }
}

/**
 * Updates a platform user's profile.
 * @param uid The Firebase Auth UID of the user.
 * @param data The partial data to update.
 */
export async function updatePlatformUserProfile(
  uid: string,
  data: Partial<PlatformUser>
): Promise<void> {
  const userRef = doc(db, 'platform_users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

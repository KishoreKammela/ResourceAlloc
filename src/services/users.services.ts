import { db } from '@/lib/firebase/config';
import type { AppUser, UserRole } from '@/types/user';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function createUserProfile(
  uid: string,
  userData: Omit<AppUser, 'emailVerified'>
): Promise<void> {
  await setDoc(doc(db, 'users', uid), userData);
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as AppUser;
  } else {
    return null;
  }
}

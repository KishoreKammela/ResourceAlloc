'use client';

import { db } from '@/lib/firebase/config';
import type { AppUser } from '@/types/user';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export async function createUserProfile(
  uid: string,
  userData: Omit<AppUser, 'emailVerified' | 'email'>
): Promise<void> {
  await setDoc(doc(db, 'users', uid), userData);
}

export async function getUserProfile(
  uid: string
): Promise<Omit<AppUser, 'emailVerified' | 'email'> | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Omit<AppUser, 'emailVerified' | 'email'>;
  } else {
    return null;
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<AppUser>
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
}

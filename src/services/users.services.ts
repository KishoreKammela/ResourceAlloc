import { db } from '@/lib/firebase/config';
import type { AppUser, UserRole } from '@/types/user';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function createUserProfile(uid: string, email: string | null): Promise<void> {
    await setDoc(doc(db, 'users', uid), {
        uid,
        email,
        role: 'Employee' // Default role
    });
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

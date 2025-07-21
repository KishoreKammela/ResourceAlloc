'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { createUserProfile, getUserProfile } from '@/services/users.services';
import type { AppUser, NewCompanyUser } from '@/types/user';
import { usePathname, useRouter } from 'next/navigation';
import { addCompany } from '@/services/companies.services';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (data: NewCompanyUser) => Promise<any>;
  logout: () => Promise<any>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            // Combine firestore profile with live auth properties
            setUser({
              ...userProfile,
              emailVerified: firebaseUser.emailVerified,
            });

            if (!userProfile.name) {
              if (pathname !== '/onboarding/create-profile') {
                router.push('/onboarding/create-profile');
              }
            }
          } else {
            // If there's a firebase user but no profile, something is wrong.
            // It might be a partially deleted account. Log them out.
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (data: NewCompanyUser) => {
    setLoading(true);
    try {
      // 1. Create the company
      const newCompany = await addCompany({
        name: data.companyName,
        website: data.companyWebsite || '',
        size: data.companySize,
      });

      // 2. Create the Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const firebaseUser = userCredential.user;

      // 3. Send verification email
      await sendEmailVerification(firebaseUser);

      // 4. Create the user profile in Firestore
      const userProfileData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: data.name,
        designation: data.designation,
        companyId: newCompany.id,
        role: 'Super Admin' as const, // First user is always Super Admin
      };

      await createUserProfile(firebaseUser.uid, userProfileData);

      // Set user state immediately to avoid waiting for onAuthStateChanged
      setUser({
        ...userProfileData,
        emailVerified: firebaseUser.emailVerified,
      });

      return userCredential;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error('Not authenticated. Cannot send verification email.');
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    sendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

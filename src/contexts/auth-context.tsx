
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
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { createUserProfile, getUserProfile } from '@/services/users.services';
import type { AppUser } from '@/types/user';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<any>;
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
            setUser(userProfile);
            // Onboarding check
            if (
              userProfile.role === 'Employee' &&
              !pathname.startsWith('/onboarding')
            ) {
              // This part will be handled by page-level logic to avoid complexity here.
            }
          } else {
            // This could happen if user exists in Auth but not in Firestore.
            // Create the profile and then set the user state.
            try {
              await createUserProfile(firebaseUser.uid, firebaseUser.email);
              const newUserProfile = await getUserProfile(firebaseUser.uid);
              if (newUserProfile) {
                setUser(newUserProfile);
                router.push('/onboarding/create-profile');
              } else {
                setUser(null);
              }
            } catch (createError) {
              console.error('Failed to create user profile:', createError);
              setUser(null);
            }
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

  const signup = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      // Profile creation is now handled by the onAuthStateChanged listener
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

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
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

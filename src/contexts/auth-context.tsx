'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { app } from '@/lib/firebase/config';
import { createUserProfile, getUserProfile } from '@/services/users.services';
import { getEmployeeByUid } from '@/services/employees.services';
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

const auth = getAuth(app);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);

        if (userProfile) {
          setUser(userProfile);
          // Onboarding check
          if (
            userProfile.role === 'Employee' &&
            pathname !== '/onboarding/create-profile'
          ) {
            const employeeProfile = await getEmployeeByUid(firebaseUser.uid);
            if (!employeeProfile) {
              router.push('/onboarding/create-profile');
            }
          }
        } else {
          // This could happen if user exists in Auth but not in Firestore.
          // Create the profile and then set the user state.
          await createUserProfile(firebaseUser.uid, firebaseUser.email);
          const newUserProfile = await getUserProfile(firebaseUser.uid);
          setUser(newUserProfile);
        }
      } else {
        setUser(null);
        const isProtectedRoute =
          !['/', '/login', '/signup'].includes(pathname) &&
          !pathname.startsWith('/api');
        if (isProtectedRoute) {
          router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged will handle the rest
  };

  const signup = async (email: string, pass: string) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass
    );
    await createUserProfile(
      userCredential.user.uid,
      userCredential.user.email
    );
    // onAuthStateChanged will handle the rest
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    // onAuthStateChanged will handle redirecting to /login
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          {/* You can replace this with a more sophisticated loading spinner */}
          <p>Loading...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

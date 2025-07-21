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
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  type User as FirebaseUser,
  type MultiFactorResolver,
  type AuthError,
  MultiFactorError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { createUserProfile, getUserProfile } from '@/services/users.services';
import type { AppUser, NewCompanyUser } from '@/types/user';
import { usePathname, useRouter } from 'next/navigation';
import { addCompany } from '@/services/companies.services';
import { addEmployee, getEmployeeByUid } from '@/services/employees.services';
import { addAuditLog } from '@/services/audit.services';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ mfa: boolean } | undefined>;
  signup: (data: NewCompanyUser) => Promise<any>;
  logout: () => Promise<any>;
  sendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<void>;
  mfaResolver: ((verificationCode: string) => Promise<void>) | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaResolver, setMfaResolver] =
    useState<AuthContextType['mfaResolver']>(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      // First, get the user profile from Firestore, which contains the role
      const userProfile = await getUserProfile(firebaseUser.uid);
      if (userProfile) {
        // Only once we have the profile, we create the full user object
        const fullUser: AppUser = {
          ...userProfile,
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
        };
        setUser(fullUser);
      } else {
        // If there's a Firebase user but no profile, it's an inconsistent state.
        // Log them out to be safe.
        await signOut(auth);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    // Only set loading to false after all async operations are complete
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      await fetchUser(firebaseUser);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshUser = async () => {
    if (auth.currentUser) {
      setLoading(true);
      await auth.currentUser.reload();
      await fetchUser(auth.currentUser);
    }
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      setLoading(false);
      const authError = error as AuthError;
      if (authError.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(
          auth,
          error as MultiFactorError
        );
        const mfaContinuation = async (verificationCode: string) => {
          setLoading(true);
          try {
            const phoneAuthCredential = PhoneAuthProvider.credential(
              resolver.hints[0].uid,
              verificationCode
            );
            const multiFactorAssertion =
              PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
            await resolver.resolveSignIn(multiFactorAssertion);
          } finally {
            setLoading(false);
          }
        };
        setMfaResolver(() => mfaContinuation);
        return { mfa: true };
      }
      throw error;
    }
  };

  const signup = async (data: NewCompanyUser) => {
    setLoading(true);
    try {
      const newCompany = await addCompany({
        name: data.companyName,
        website: data.companyWebsite || '',
        size: data.companySize,
      });

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const firebaseUser = userCredential.user;

      await sendEmailVerification(firebaseUser);

      const userProfileData: Omit<AppUser, 'emailVerified' | 'email'> = {
        uid: firebaseUser.uid,
        name: data.name,
        designation: data.designation,
        companyId: newCompany.id,
        role: 'Super Admin' as const,
        onboardingCompleted: false,
      };

      await createUserProfile(firebaseUser.uid, userProfileData);

      await addEmployee({
        uid: firebaseUser.uid,
        name: data.name,
        title: data.designation,
        email: firebaseUser.email ?? undefined,
        skills: [],
        availability: 'Available',
        workMode: 'Remote',
        status: 'Approved',
      });

      await addAuditLog({
        event: 'user_created',
        userId: firebaseUser.uid,
        details: `New user registered: ${firebaseUser.email}`,
      });

      // The onAuthStateChanged listener will handle setting the user state.
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    if (user) {
      await addAuditLog({
        event: 'user_logout',
        userId: user.uid,
        details: `User logged out: ${user.email}`,
      });
    }
    await signOut(auth);
    setUser(null);
    setMfaResolver(null);
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
    refreshUser,
    mfaResolver,
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

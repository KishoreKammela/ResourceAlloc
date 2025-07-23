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
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  type User as FirebaseUser,
  type MultiFactorResolver,
  type AuthError,
  MultiFactorError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import {
  createTeamMemberProfile,
  getTeamMemberProfile,
} from '@/services/users.services';
import { getPlatformUserProfile } from '@/services/platform-users.services';
import type { TeamMember, NewCompanyAdmin } from '@/types/user';
import type { PlatformUser } from '@/types/platform-user';
import { addCompany } from '@/services/companies.services';
import { addAuditLog } from '@/services/audit.services';
import {
  getInvitationByToken,
  updateInvitationStatus,
} from '@/services/invitations.services';
import { serverTimestamp } from 'firebase/firestore';

// This union type allows our user object to hold either a TeamMember or a PlatformUser
export type AuthenticatedUser =
  | ({
      type: 'team';
      emailVerified: boolean;
      uid: string;
      email: string | null;
    } & Omit<TeamMember, 'uid' | 'email'>)
  | ({
      type: 'platform';
      emailVerified: boolean;
    } & PlatformUser);

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ mfa: boolean } | undefined>;
  signup: (data: NewCompanyAdmin) => Promise<any>;
  invitedUserSignup: (
    name: string,
    email: string,
    pass: string,
    token: string
  ) => Promise<any>;
  logout: () => Promise<any>;
  sendVerificationEmail: () => Promise<void>;
  updateUserPassword: (currentPass: string, newPass: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  mfaResolver: ((verificationCode: string) => Promise<void>) | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaResolver, setMfaResolver] =
    useState<AuthContextType['mfaResolver']>(null);

  const fetchUser = async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      // 1. First, check if the user is a Platform User
      const platformUserProfile = await getPlatformUserProfile(
        firebaseUser.uid
      );
      if (platformUserProfile) {
        setUser({
          ...platformUserProfile,
          type: 'platform',
          emailVerified: firebaseUser.emailVerified,
        });
      } else {
        // 2. If not a platform user, check if they are a Team Member
        const teamMemberProfile = await getTeamMemberProfile(firebaseUser.uid);
        if (teamMemberProfile) {
          setUser({
            ...teamMemberProfile,
            type: 'team',
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
          });
        } else {
          // Inconsistent state: Firebase user exists but has no profile anywhere.
          await signOut(auth);
          setUser(null);
        }
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      await fetchUser(firebaseUser);
    });

    return () => unsubscribe();
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

  const signup = async (data: NewCompanyAdmin) => {
    setLoading(true);
    try {
      const newCompany = await addCompany({
        companyName: data.companyName,
        companyWebsite: data.companyWebsite || '',
        companySizeRange: data.companySize,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      });

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const firebaseUser = userCredential.user;

      await sendEmailVerification(firebaseUser);

      const [firstName, ...lastNameParts] = data.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const userProfileData: Omit<TeamMember, 'createdAt' | 'updatedAt'> = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName,
        lastName,
        companyId: newCompany.id,
        role: 'Super Admin' as const,
        onboardingCompleted: true, // Super Admin doesn't need to create a profile
        isActive: true,
      };

      await createTeamMemberProfile(firebaseUser.uid, userProfileData);

      await addAuditLog({
        event: 'user_created',
        userId: firebaseUser.uid,
        details: `New company user registered: ${firebaseUser.email}`,
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const invitedUserSignup = async (
    name: string,
    email: string,
    pass: string,
    token: string
  ) => {
    setLoading(true);
    try {
      const invitation = await getInvitationByToken(token);
      if (!invitation) {
        throw new Error('Invitation is invalid or has expired.');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const firebaseUser = userCredential.user;

      await sendEmailVerification(firebaseUser);

      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');

      const userProfileData: Omit<TeamMember, 'createdAt' | 'updatedAt'> = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName,
        lastName,
        companyId: invitation.companyId,
        role: invitation.role,
        onboardingCompleted: false,
        isActive: true,
      };
      await createTeamMemberProfile(firebaseUser.uid, userProfileData);

      await updateInvitationStatus(invitation.id, 'accepted');

      await addAuditLog({
        event: 'user_created',
        userId: firebaseUser.uid,
        details: `Invited user registered: ${firebaseUser.email}`,
      });
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

  const updateUserPassword = async (currentPass: string, newPass: string) => {
    setLoading(true);
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      setLoading(false);
      throw new Error('You must be logged in to change your password.');
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPass
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPass);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    invitedUserSignup,
    logout,
    sendVerificationEmail,
    updateUserPassword,
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

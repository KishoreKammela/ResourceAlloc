
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendEmailVerification,
    type User as FirebaseUser
} from 'firebase/auth';
import { app } from '@/lib/firebase/config';
import { createUserProfile, getUserProfile } from '@/services/users.services';
import { getEmployeeByUid } from '@/services/employees.services';
import type { AppUser } from '@/types/user';
import { usePathname, useRouter } from 'next/navigation';


interface AuthContextType {
    user: AppUser | null;
    isEmailVerified: boolean;
    loading: boolean;
    login: (email: string, pass: string) => Promise<any>;
    signup: (email: string, pass: string) => Promise<any>;
    logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Manually reload the user to get the latest emailVerified status
                await firebaseUser.reload();
                const freshUser = getAuth().currentUser;

                if (freshUser) {
                    setIsEmailVerified(freshUser.emailVerified);
                    const userProfile = await getUserProfile(freshUser.uid);
                    
                    if(userProfile) {
                        setUser({...userProfile, emailVerified: freshUser.emailVerified});

                        // Onboarding check
                        if (userProfile.role === 'Employee' && freshUser.emailVerified) {
                            const employeeProfile = await getEmployeeByUid(freshUser.uid);
                            if (!employeeProfile && pathname !== '/onboarding/create-profile') {
                                router.push('/onboarding/create-profile');
                            }
                        }

                    } else {
                        // This could happen if user exists in Auth but not in Firestore.
                        await createUserProfile(freshUser.uid, freshUser.email);
                        const newUserProfile = await getUserProfile(freshUser.uid);
                        setUser(newUserProfile);
                    }
                }

            } else {
                setUser(null);
                setIsEmailVerified(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [pathname, router]);

    const login = (email: string, pass: string) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, pass).finally(() => setLoading(false));
    };

    const signup = async (email: string, pass: string) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            await sendEmailVerification(userCredential.user);
            await createUserProfile(userCredential.user.uid, userCredential.user.email);
            return userCredential;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        user,
        isEmailVerified,
        loading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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

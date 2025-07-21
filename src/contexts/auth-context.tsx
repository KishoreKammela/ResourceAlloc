
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    type User as FirebaseUser
} from 'firebase/auth';
import { app } from '@/lib/firebase/config';
import { createUserProfile, getUserProfile } from '@/services/users.services';
import type { AppUser } from '@/types/user';


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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userProfile = await getUserProfile(firebaseUser.uid);
                if(userProfile) {
                    setUser(userProfile);
                } else {
                    // This could happen if user exists in Auth but not in Firestore.
                    // We can create a profile here as a fallback.
                    await createUserProfile(firebaseUser.uid, firebaseUser.email);
                    const newUserProfile = await getUserProfile(firebaseUser.uid);
                    setUser(newUserProfile);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = (email: string, pass: string) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, pass).finally(() => setLoading(false));
    };

    const signup = async (email: string, pass: string) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
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

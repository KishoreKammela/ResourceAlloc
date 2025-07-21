
'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, MailCheck } from 'lucide-react';
import { getAuth } from 'firebase/auth';

export default function VerifyEmailPage() {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const [isSending, setIsSending] = useState(false);
    const auth = getAuth();

    const handleResendVerification = async () => {
        if (!auth.currentUser) return;
        setIsSending(true);
        try {
            await sendEmailVerification(auth.currentUser);
            toast({
                title: 'Verification Email Sent',
                description: 'A new verification link has been sent to your email address.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to send verification email. Please try again later.',
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="items-center text-center">
                    <MailCheck className="h-12 w-12 text-accent mb-4" />
                    <CardTitle className="font-headline text-2xl">Verify Your Email</CardTitle>
                    <CardDescription>
                        A verification link has been sent to <span className="font-semibold text-foreground">{user?.email}</span>. Please check your inbox and click the link to activate your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        Didn't receive an email? Check your spam folder or click below to resend.
                    </p>
                    <Button onClick={handleResendVerification} disabled={isSending}>
                        {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Resend Verification Email
                    </Button>
                </CardContent>
                <CardContent className="text-center border-t pt-4">
                     <Button variant="link" onClick={logout}>
                        Log out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

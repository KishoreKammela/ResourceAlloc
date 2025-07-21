'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
        description:
          'A new verification link has been sent to your email address.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Failed to send verification email. Please try again later.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center text-center">
          <MailCheck className="mb-4 h-12 w-12 text-accent" />
          <CardTitle className="font-headline text-2xl">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            A verification link has been sent to{' '}
            <span className="font-semibold text-foreground">{user?.email}</span>
            . Please check your inbox and click the link to activate your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Didn't receive an email? Check your spam folder or click below to
            resend.
          </p>
          <Button onClick={handleResendVerification} disabled={isSending}>
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Resend Verification Email
          </Button>
        </CardContent>
        <CardContent className="border-t pt-4 text-center">
          <Button variant="link" onClick={logout}>
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

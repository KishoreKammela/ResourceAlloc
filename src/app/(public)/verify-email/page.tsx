'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MailCheck } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const { user, sendVerificationEmail, loading, logout } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleResendEmail = async () => {
    setIsSending(true);
    try {
      await sendVerificationEmail();
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your inbox (and spam folder).',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Sending Email',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to{' '}
            <strong>{user?.email}</strong>. Please check your inbox to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email?
          </p>
          <Button onClick={handleResendEmail} disabled={isSending || loading}>
            {isSending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          <Button variant="link" onClick={handleLogout}>
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

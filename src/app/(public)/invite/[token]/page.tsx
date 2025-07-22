'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { getInvitationByToken } from '@/services/invitations.services';
import type { Invitation } from '@/types/invitation';
import { Loader2, ServerCrash, Clock } from 'lucide-react';
import InvitedUserSignupForm from '@/components/app/invited-user-signup-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

type InvitePageProps = {
  params: {
    token: string;
  };
};

export default function InvitePage({ params }: InvitePageProps) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateToken() {
      try {
        const inv = await getInvitationByToken(params.token);
        if (!inv) {
          setError(
            'This invitation link is either invalid or has expired. Please request a new one.'
          );
        } else {
          setInvitation(inv);
        }
      } catch (e) {
        setError(
          'An unexpected error occurred. Please try the link again later.'
        );
      } finally {
        setLoading(false);
      }
    }
    validateToken();
  }, [params.token]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Validating invitation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Clock className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Invitation Invalid</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/login"
              className="text-sm text-primary hover:underline"
            >
              Return to login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invitation) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <InvitedUserSignupForm invitation={invitation} />
      </div>
    );
  }

  return notFound();
}

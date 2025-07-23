'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { getInvitationsByCompany } from '@/services/invitations.services';
import type { Invitation } from '@/types/invitation';
import { Loader2 } from 'lucide-react';
import InvitationManager from '@/components/app/invitation-manager';

export default function TeamPage() {
  const { user, loading: authLoading } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvitations() {
      if (user?.type === 'team' && user.companyId) {
        setLoading(true);
        const fetchedInvitations = await getInvitationsByCompany(
          user.companyId
        );
        setInvitations(fetchedInvitations);
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchInvitations();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user?.type !== 'team' || !user.companyId) {
    return (
      <div className="text-center text-destructive">
        Could not load company information. Please try again.
      </div>
    );
  }

  if (user.role !== 'Super Admin' && user.role !== 'Admin') {
    return (
      <div className="text-center text-muted-foreground">
        You do not have permission to access this page.
      </div>
    );
  }

  return (
    <InvitationManager
      companyId={user.companyId}
      initialInvitations={invitations}
    />
  );
}

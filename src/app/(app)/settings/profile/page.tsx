'use client';

import { useAuth } from '@/contexts/auth-context';
import UserProfileForm from '@/components/app/user-profile-form';
import { Loader2 } from 'lucide-react';

export default function UserProfilePage() {
  const { user, loading, refreshUser } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <UserProfileForm user={user} onUpdate={refreshUser} />;
}

'use client';

import { useAuth } from '@/contexts/auth-context';
import UserProfileForm from '@/components/app/user-profile-form';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserProfilePage() {
  const { user, loading, refreshUser } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // A simple display for platform users for now. This can be expanded later.
  if (user.type === 'platform') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Administrator Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </CardContent>
      </Card>
    );
  }

  return <UserProfileForm user={user} onUpdate={refreshUser} />;
}

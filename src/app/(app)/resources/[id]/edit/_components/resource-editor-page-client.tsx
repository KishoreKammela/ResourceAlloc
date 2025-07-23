'use client';

import { notFound, useRouter } from 'next/navigation';
import { getResourceById } from '@/services/resources.services';
import ProfileEditor from '@/components/app/profile-editor';
import { useEffect, useState } from 'react';
import type { Resource } from '@/types/resource';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

type ResourceEditorPageClientProps = {
  resourceId: string;
};

export default function ResourceEditorPageClient({
  resourceId,
}: ResourceEditorPageClientProps) {
  const { user } = useAuth();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      if (user?.type === 'team' && user.companyId) {
        const res = await getResourceById(resourceId, user.companyId);
        setResource(res);
      }
      setLoading(false);
    };
    fetchResource();
  }, [resourceId, user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!resource) {
    notFound();
  }

  return (
    <div>
      <ProfileEditor resource={resource} />
    </div>
  );
}

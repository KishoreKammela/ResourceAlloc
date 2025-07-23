'use client';

import { Button } from '@/components/ui/button';
import { UserPlus, GitCompareArrows } from 'lucide-react';
import Link from 'next/link';
import { getResources } from '@/services/resources.services';
import ResourcesClientPage from './_lib/components/resources-client-page';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import type { Resource } from '@/types/resource';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ResourcesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  useEffect(() => {
    async function fetchResources() {
      if (user?.type === 'team' && user.companyId) {
        const res = await getResources(user.companyId);
        setResources(res);
      }
      setLoading(false);
    }
    fetchResources();
  }, [user]);

  const canAddResource = user?.role === 'Admin' || user?.role === 'Super Admin';

  const handleCompare = () => {
    if (selectedResources.length < 2) return;
    const params = new URLSearchParams();
    params.set('ids', selectedResources.join(','));
    router.push(`/resources/compare?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Resources</h1>
        <div className="flex items-center gap-2">
          {canAddResource && (
            <Button asChild>
              <Link href="/resources/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Resource
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            disabled={selectedResources.length < 2}
            onClick={handleCompare}
          >
            <GitCompareArrows className="mr-2 h-4 w-4" />
            Compare ({selectedResources.length})
          </Button>
        </div>
      </div>

      <ResourcesClientPage
        resources={resources}
        selectedResources={selectedResources}
        onSelectionChange={setSelectedResources}
      />
    </div>
  );
}

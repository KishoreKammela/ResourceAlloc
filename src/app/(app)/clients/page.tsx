'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/auth-context';
import { getClients } from '@/services/clients.services';
import type { Client } from '@/types/client';
import { Loader2, Building } from 'lucide-react';
import EmptyState from '@/components/app/empty-state';
import ClientCreator from './_components/client-creator';

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  useEffect(() => {
    async function fetchClients() {
      if (user?.companyId) {
        setLoading(true);
        const fetchedClients = await getClients(user.companyId);
        setClients(fetchedClients);
        setLoading(false);
      }
    }
    fetchClients();
  }, [user]);

  const handleClientCreated = (newClient: Client) => {
    setClients((prevClients) => [newClient, ...prevClients]);
  };

  const canManageClients =
    user?.role === 'Admin' || user?.role === 'Super Admin';

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
        <h1 className="font-headline text-3xl font-bold">Clients</h1>
        {canManageClients && (
          <ClientCreator
            isOpen={isCreatorOpen}
            onOpenChange={setIsCreatorOpen}
            onClientCreated={handleClientCreated}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>
            A list of all clients your company is engaged with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.contactPerson}</TableCell>
                    <TableCell>{client.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={<Building className="h-8 w-8" />}
              title="No Clients Found"
              description="You haven't added any clients yet. Add your first client to start managing projects for them."
              action={
                canManageClients
                  ? {
                      label: 'Add Client',
                      onClick: () => setIsCreatorOpen(true),
                    }
                  : undefined
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

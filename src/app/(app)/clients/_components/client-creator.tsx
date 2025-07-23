'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Building, PlusCircle } from 'lucide-react';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addClient } from '@/services/clients.services';
import { useAuth } from '@/contexts/auth-context';
import type { Client } from '@/types/client';

const clientFormSchema = z.object({
  clientName: z
    .string()
    .min(2, 'Client name must be at least 2 characters long.'),
  primaryContactName: z
    .string()
    .min(2, 'Contact person name must be at least 2 characters long.'),
  primaryContactEmail: z.string().email('Please enter a valid email address.'),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

type ClientCreatorProps = {
  onClientCreated: (newClient: Client) => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export default function ClientCreator({
  onClientCreated,
  isOpen,
  onOpenChange,
}: ClientCreatorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      clientName: '',
      primaryContactName: '',
      primaryContactEmail: '',
    },
  });

  const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    if (user?.type !== 'team' || !user.companyId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No company context found. Please sign in again.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const now = Timestamp.now();
      const newClientData: Omit<Client, 'id'> = {
        ...data,
        companyId: user.companyId,
        createdBy: user.uid,
        updatedBy: user.uid,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };
      // To satisfy Firestore, we pass a serverTimestamp for the actual write.
      const newClient = await addClient({
        ...newClientData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Client Added',
        description: `Client "${newClient.clientName}" has been successfully created.`,
      });

      onClientCreated({ ...newClient, ...newClientData });
      form.reset();
      onOpenChange?.(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Creating Client',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Add New Client
          </DialogTitle>
          <DialogDescription>
            Enter the details for your new client. This will allow you to assign
            projects to them.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Acme Corporation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryContactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. contact@acme.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Building className="mr-2 h-4 w-4" />
                )}
                Save Client
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

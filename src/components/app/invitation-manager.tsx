'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Loader2, Send, Mail, Calendar, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { handleCreateInvitation } from '@/app/(app)/settings/invitations/actions';
import type { Invitation } from '@/types/invitation';
import type { UserRole } from '@/types/user';
import { Separator } from '../ui/separator';

const invitationSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  role: z.enum([
    'Admin',
    'Recruiter',
    'Project Manager',
    'Employee',
    'Super Admin',
  ]),
});

type InvitationFormValues = z.infer<typeof invitationSchema>;

type InvitationManagerProps = {
  companyId: string;
  initialInvitations: Invitation[];
};

export default function InvitationManager({
  companyId,
  initialInvitations,
}: InvitationManagerProps) {
  const { toast } = useToast();
  const [invitations, setInvitations] =
    useState<Invitation[]>(initialInvitations);
  const [isSending, setIsSending] = useState(false);

  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: '',
      role: 'Employee',
    },
  });

  const onSubmit: SubmitHandler<InvitationFormValues> = async (data) => {
    setIsSending(true);
    try {
      const result = await handleCreateInvitation(
        companyId,
        data.email,
        data.role as UserRole
      );

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.invitation) {
        setInvitations((prev) => [result.invitation!, ...prev]);
        toast({
          title: 'Invitation Sent',
          description: `An invitation has been sent to ${data.email}.`,
        });
        form.reset();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Sending Invitation',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadgeVariant = (status: Invitation['status']) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'accepted':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Invite New User</CardTitle>
          <CardDescription>
            Send an invitation to a new user to join your company on
            ResourceAlloc.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="new.user@company.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="Project Manager">
                          Project Manager
                        </SelectItem>
                        <SelectItem value="Recruiter">Recruiter</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button type="submit" disabled={isSending}>
                {isSending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Invitation
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Invitation History</CardTitle>
          <CardDescription>
            A log of all invitations sent from your company account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.length > 0 ? (
                invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      {invitation.email}
                    </TableCell>
                    <TableCell>{invitation.role}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invitation.status)}>
                        {invitation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(invitation.expiresAt.toDate(), 'PPP')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No invitations have been sent yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

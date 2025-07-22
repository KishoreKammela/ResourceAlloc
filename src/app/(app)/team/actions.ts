'use server';

import { createInvitation } from '@/services/invitations.services';
import { getUsersByCompany } from '@/services/users.services';
import type { Invitation } from '@/types/invitation';
import type { UserRole } from '@/types/user';

export async function handleCreateInvitation(
  companyId: string,
  email: string,
  role: UserRole
): Promise<{ invitation: Invitation | null; error: string | null }> {
  try {
    // Check if user with this email already exists in the company
    const existingUsers = await getUsersByCompany(companyId);
    if (existingUsers.some((user) => user.email === email)) {
      return {
        invitation: null,
        error: 'A user with this email already exists in your company.',
      };
    }

    const newInvitation = await createInvitation(companyId, email, role);
    return { invitation: newInvitation, error: null };
  } catch (e: any) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      invitation: null,
      error: `Failed to create invitation: ${error}`,
    };
  }
}

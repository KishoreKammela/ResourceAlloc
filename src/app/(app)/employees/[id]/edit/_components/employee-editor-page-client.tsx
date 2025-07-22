'use client';

import { notFound, useRouter } from 'next/navigation';
import { getEmployeeById } from '@/services/employees.services';
import ProfileEditor from '@/components/app/profile-editor';
import { useEffect, useState } from 'react';
import type { Employee } from '@/types/employee';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

type EmployeeEditorPageClientProps = {
  employeeId: string;
};

export default function EmployeeEditorPageClient({
  employeeId,
}: EmployeeEditorPageClientProps) {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (user && user.companyId) {
        const emp = await getEmployeeById(employeeId, user.companyId);
        setEmployee(emp);
      }
      setLoading(false);
    };
    fetchEmployee();
  }, [employeeId, user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!employee) {
    notFound();
  }

  return (
    <div>
      <ProfileEditor employee={employee} />
    </div>
  );
}

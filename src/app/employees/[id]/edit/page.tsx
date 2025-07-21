'use client';

import { notFound } from 'next/navigation';
import { getEmployeeById } from '@/services/employees.services';
import ProfileEditor from '@/components/app/profile-editor';
import { useEffect, useState } from 'react';
import type { Employee } from '@/types/employee';
import { Loader2 } from 'lucide-react';

type EditEmployeePageProps = {
  params: {
    id: string;
  };
};

export default function EditEmployeePage({
  params,
}: EditEmployeePageProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      const emp = await getEmployeeById(params.id);
      setEmployee(emp);
      setLoading(false);
    };
    fetchEmployee();
  }, [params.id]);

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
    <div className="container mx-auto">
      <ProfileEditor employee={employee} />
    </div>
  );
}
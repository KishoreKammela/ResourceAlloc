
'use client';

import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { getEmployees } from '@/services/employees.services';
import EmployeesClientPage from './_lib/components/employees-client-page';
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import type { Employee } from "@/types/employee";
import { Loader2 } from "lucide-react";

export default function EmployeesPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
        const emps = await getEmployees();
        setEmployees(emps);
        setLoading(false);
    }
    fetchEmployees();
  }, []);

  const canAddEmployee = user?.role === 'Admin' || user?.role === 'Super Admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Employees</h1>
        {canAddEmployee && (
            <Button asChild>
            <Link href="/employees/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Employee
            </Link>
            </Button>
        )}
      </div>
      
      <EmployeesClientPage employees={employees} />
    </div>
  )
}

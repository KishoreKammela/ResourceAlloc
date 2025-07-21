'use client';

import { Button } from '@/components/ui/button';
import { UserPlus, Users, GitCompareArrows } from 'lucide-react';
import Link from 'next/link';
import { getEmployees } from '@/services/employees.services';
import EmployeesClientPage from './_lib/components/employees-client-page';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import type { Employee } from '@/types/employee';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EmployeesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      const emps = await getEmployees();
      setEmployees(emps);
      setLoading(false);
    }
    fetchEmployees();
  }, []);

  const canAddEmployee = user?.role === 'Admin' || user?.role === 'Super Admin';

  const handleCompare = () => {
    // For now, just show a toast with the selected IDs.
    // In the next step, this will navigate to a comparison page.
    toast({
      title: 'Comparison Feature',
      description: `Selected employee IDs: ${selectedEmployees.join(', ')}`,
    });
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
        <h1 className="font-headline text-3xl font-bold">Employees</h1>
        <div className="flex items-center gap-2">
          {canAddEmployee && (
            <Button asChild>
              <Link href="/employees/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Employee
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            disabled={selectedEmployees.length < 2}
            onClick={handleCompare}
          >
            <GitCompareArrows className="mr-2 h-4 w-4" />
            Compare ({selectedEmployees.length})
          </Button>
        </div>
      </div>

      <EmployeesClientPage
        employees={employees}
        selectedEmployees={selectedEmployees}
        onSelectionChange={setSelectedEmployees}
      />
    </div>
  );
}

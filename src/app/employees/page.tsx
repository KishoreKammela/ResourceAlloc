
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { getEmployees } from '@/services/employees.services';
import EmployeesClientPage from './_lib/components/employees-client-page';

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Employees</h1>
        <Button asChild>
          <Link href="/employees/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>
      
      <EmployeesClientPage employees={employees} />
    </div>
  )
}

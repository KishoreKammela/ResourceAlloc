
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Employee } from '@/types/employee';

type EmployeesClientPageProps = {
  employees: Employee[];
};

export default function EmployeesClientPage({
  employees,
}: EmployeesClientPageProps) {
  const getAvailabilityBadgeClass = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'text-accent border-accent';
      case 'On Project':
        return 'text-orange-500 border-orange-500';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Roster</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Availability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee: Employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=${employee.name}`}
                        alt={employee.name}
                      />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Link
                      href={`/employees/${employee.id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {employee.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{employee.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employee.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                    {employee.skills.length > 3 && (
                      <Badge variant="outline">
                        +{employee.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getAvailabilityBadgeClass(employee.availability)}
                  >
                    {employee.availability}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {employees.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No employees have been created yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

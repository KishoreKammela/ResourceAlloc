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
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

type EmployeesClientPageProps = {
  employees: Employee[];
  selectedEmployees: string[];
  onSelectionChange: (selected: string[]) => void;
};

export default function EmployeesClientPage({
  employees,
  selectedEmployees,
  onSelectionChange,
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(employees.map((e) => e.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (employeeId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedEmployees, employeeId]);
    } else {
      onSelectionChange(selectedEmployees.filter((id) => id !== employeeId));
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
              <TableHead className="w-12">
                <Checkbox
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  checked={
                    employees.length > 0 &&
                    selectedEmployees.length === employees.length
                  }
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Availability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee: Employee) => (
              <TableRow
                key={employee.id}
                data-state={
                  selectedEmployees.includes(employee.id) ? 'selected' : ''
                }
              >
                <TableCell>
                  <Checkbox
                    onCheckedChange={(checked) =>
                      handleSelectRow(employee.id, !!checked)
                    }
                    checked={selectedEmployees.includes(employee.id)}
                    aria-label={`Select ${employee.name}`}
                  />
                </TableCell>
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
                  colSpan={5}
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

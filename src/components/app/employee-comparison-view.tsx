'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getEmployeeById } from '@/services/employees.services';
import type { Employee } from '@/types/employee';
import { Loader2, Users, ArrowLeft } from 'lucide-react';
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
import { Button } from '../ui/button';

export default function EmployeeComparisonView() {
  const searchParams = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const employeeIds = useMemo(() => {
    const ids = searchParams.get('ids');
    return ids ? ids.split(',') : [];
  }, [searchParams]);

  useEffect(() => {
    async function fetchEmployees() {
      if (employeeIds.length === 0) {
        setError('No employees selected for comparison.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const fetchedEmployees = await Promise.all(
          employeeIds.map((id) => getEmployeeById(id))
        );
        const validEmployees = fetchedEmployees.filter(
          (emp): emp is Employee => emp !== null
        );
        if (validEmployees.length !== employeeIds.length) {
          setError('Some employee profiles could not be loaded.');
        }
        setEmployees(validEmployees);
      } catch (e) {
        setError('Failed to fetch employee data.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, [employeeIds]);

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    employees.forEach((emp) => {
      emp.skills.forEach((skill) => skillSet.add(skill));
    });
    return Array.from(skillSet).sort();
  }, [employees]);

  const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4">Loading comparison data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>{error}</p>
        <Button asChild variant="link">
          <Link href="/employees">Return to Employees</Link>
        </Button>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No valid employee profiles to compare.</p>
        <Button asChild variant="link">
          <Link href="/employees">Return to Employees</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">
            Employee Comparison
          </h1>
          <p className="text-muted-foreground">
            Comparing {employees.length} selected employees side-by-side.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employee List
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="sticky left-0 top-0 z-10 w-48 bg-muted font-semibold">
                Attribute
              </TableHead>
              {employees.map((employee) => (
                <TableHead key={employee.id} className="w-64 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-16 w-16">
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
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Title
              </TableCell>
              {employees.map((employee) => (
                <TableCell key={employee.id} className="text-center">
                  {employee.title}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Availability
              </TableCell>
              {employees.map((employee) => (
                <TableCell key={employee.id} className="text-center">
                  <Badge
                    variant={
                      employee.availability === 'Available'
                        ? 'default'
                        : 'secondary'
                    }
                    className={
                      employee.availability === 'Available'
                        ? 'border-accent bg-accent/10 text-accent'
                        : ''
                    }
                  >
                    {employee.availability}
                  </Badge>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Work Mode
              </TableCell>
              {employees.map((employee) => (
                <TableCell key={employee.id} className="text-center">
                  {employee.workMode}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Location
              </TableCell>
              {employees.map((employee) => (
                <TableCell key={employee.id} className="text-center">
                  {employee.location || 'N/A'}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Salary
              </TableCell>
              {employees.map((employee) => (
                <TableCell key={employee.id} className="text-center">
                  {formatCurrency(employee.compensation?.salary)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Billing Rate
              </TableCell>
              {employees.map((employee) => (
                <TableCell key={employee.id} className="text-center">
                  {formatCurrency(employee.compensation?.billingRate)}/hr
                </TableCell>
              ))}
            </TableRow>

            {/* Spacer row */}
            <TableRow className="bg-muted hover:bg-muted">
              <TableCell
                colSpan={employees.length + 1}
                className="py-3 text-center font-bold"
              >
                Skills
              </TableCell>
            </TableRow>

            {allSkills.map((skill) => (
              <TableRow key={skill}>
                <TableCell className="sticky left-0 z-10 bg-background font-medium">
                  {skill}
                </TableCell>
                {employees.map((employee) => (
                  <TableCell key={employee.id} className="text-center">
                    {employee.skills.includes(skill) ? (
                      <CheckCircle className="mx-auto h-5 w-5 text-accent" />
                    ) : (
                      <XCircle className="mx-auto h-5 w-5 text-muted-foreground/50" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {allSkills.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={employees.length + 1}
                  className="py-4 text-center text-muted-foreground"
                >
                  No skills to compare.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Simple icons for the table
const CheckCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);

const XCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
      clipRule="evenodd"
    />
  </svg>
);

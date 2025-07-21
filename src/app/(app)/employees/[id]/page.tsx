'use client';

import { notFound } from 'next/navigation';
import { getEmployeeById } from '@/services/employees.services';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle,
  Wifi,
  Users,
  Building,
  Pencil,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import type { Employee } from '@/types/employee';
import { Loader2 } from 'lucide-react';

type EmployeeProfilePageProps = {
  params: {
    id: string;
  };
};

export default function EmployeeProfilePage({
  params,
}: EmployeeProfilePageProps) {
  const { user } = useAuth();
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

  const canEdit =
    user?.role === 'Admin' ||
    user?.role === 'Super Admin' ||
    user?.uid === employee.id;

  const getWorkModeIcon = (workMode: string) => {
    switch (workMode) {
      case 'Remote':
        return <Wifi className="mr-2 h-4 w-4" />;
      case 'Hybrid':
        return <Users className="mr-2 h-4 w-4" />;
      case 'On-site':
        return <Building className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">{employee.name}</h1>
          <p className="text-xl text-muted-foreground">{employee.title}</p>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <Button asChild>
              <Link href={`/employees/${employee.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/employees">Back to Employees</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-1">
          <Card>
            <CardContent className="flex flex-col items-center pt-6 text-center">
              <Avatar className="mb-4 h-24 w-24">
                <AvatarImage
                  src={`https://i.pravatar.cc/150?u=${employee.name}`}
                  alt={employee.name}
                />
                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.title}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <CheckCircle
                  className={`mr-2 h-4 w-4 ${employee.availability === 'Available' ? 'text-accent' : 'text-gray-400'}`}
                />
                <span>{employee.availability}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                {getWorkModeIcon(employee.workMode)}
                <span>{employee.workMode}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
              <CardDescription>
                A comprehensive list of the employee&apos;s professional skills.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 text-base"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

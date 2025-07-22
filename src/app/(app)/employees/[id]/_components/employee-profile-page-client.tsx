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
  DollarSign,
  ClipboardList,
  TrendingUp,
  FileText,
  Download,
  Award,
  BarChart,
  BrainCircuit,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import type { Employee } from '@/types/employee';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { calculateProfileCompletion } from '@/lib/utils';

type EmployeeProfilePageClientProps = {
  employeeId: string;
};

export default function EmployeeProfilePageClient({
  employeeId,
}: EmployeeProfilePageClientProps) {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      const emp = await getEmployeeById(employeeId);
      setEmployee(emp);
      setLoading(false);
    };
    fetchEmployee();
  }, [employeeId]);

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

  const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const profileCompletion = calculateProfileCompletion(employee);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">{employee.name}</h1>
          <p className="text-xl text-muted-foreground">{employee.title}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/api/employees/${employee.id}/export`} target="_blank">
              <Download className="mr-2 h-4 w-4" />
              Export to PDF
            </Link>
          </Button>
          {canEdit && (
            <Button asChild>
              <Link href={`/employees/${employee.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          )}
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
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="mr-2 h-5 w-5" /> Profile Strength
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={profileCompletion} />
              <p className="text-center text-sm text-muted-foreground">
                {profileCompletion}% Complete
              </p>
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
              {employee.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{employee.location}</span>
                </div>
              )}
              {employee.yearsOfExperience !== undefined && (
                <div className="flex items-center text-muted-foreground">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>{employee.yearsOfExperience} Years of Experience</span>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compensation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="mr-2 h-4 w-4" />
                <span>
                  Salary: {formatCurrency(employee.compensation?.salary)}
                </span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="mr-2 h-4 w-4" />
                <span>
                  Rate: {formatCurrency(employee.compensation?.billingRate)}/hr
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 md:col-span-2">
          {employee.professionalSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ClipboardList className="mr-2 h-5 w-5" /> About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {employee.professionalSummary}
                </p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BrainCircuit className="mr-2 h-5 w-5" /> Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {employee.skills?.map((skill) => (
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
          {(employee.certifications?.length || 0) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Award className="mr-2 h-5 w-5" /> Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {employee.certifications?.map((cert) => (
                    <Badge
                      key={cert}
                      variant="outline"
                      className="px-3 py-1 text-base"
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {(employee.industryExperience?.length || 0) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Briefcase className="mr-2 h-5 w-5" /> Industry Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {employee.industryExperience?.map((industry) => (
                    <Badge
                      key={industry}
                      variant="outline"
                      className="px-3 py-1 text-base"
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
              <CardDescription>
                Resumes, certificates, and other professional documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center">
                <div className="space-y-2">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Document management is coming soon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { notFound } from 'next/navigation';
import { getResourceById } from '@/services/resources.services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
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
  File,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import type { Resource } from '@/types/resource';
import { Progress } from '@/components/ui/progress';
import { calculateProfileCompletion } from '@/lib/utils';
import ResourceProfileSkeleton from './resource-profile-skeleton';
import { auth } from '@/lib/firebase/config';

export default function ResourceProfilePageClient({
  resourceId,
}: {
  resourceId: string;
}) {
  const { user } = useAuth();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportUrl, setExportUrl] = useState('');

  useEffect(() => {
    const fetchResource = async () => {
      if (user?.type === 'team' && user.companyId) {
        const res = await getResourceById(resourceId, user.companyId);
        setResource(res);
      }
      setLoading(false);
    };
    fetchResource();
  }, [resourceId, user]);

  useEffect(() => {
    const generateExportUrl = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setExportUrl(
            `/api/resources/${resourceId}/export?token=${encodeURIComponent(
              token
            )}`
          );
        } catch (error) {
          console.error('Error getting auth token for export:', error);
        }
      }
    };

    if (resource) {
      generateExportUrl();
    }
  }, [resource, resourceId]);

  if (loading) {
    return <ResourceProfileSkeleton />;
  }

  if (!resource) {
    notFound();
  }

  const canEdit =
    user?.role === 'Admin' ||
    user?.role === 'Super Admin' ||
    (user?.type === 'team' && user.resourceId === resource.id);

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

  const profileCompletion = calculateProfileCompletion(resource);
  const resourceName = `${resource.firstName} ${resource.lastName}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">{resourceName}</h1>
          <p className="text-xl text-muted-foreground">
            {resource.designation}
          </p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <Button
            asChild
            variant="outline"
            className="flex-1 md:flex-none"
            disabled={!exportUrl}
          >
            <Link href={exportUrl} target="_blank">
              <Download className="mr-2 h-4 w-4" />
              Export to PDF
            </Link>
          </Button>
          {canEdit && (
            <Button asChild className="flex-1 md:flex-none">
              <Link href={`/resources/${resource.id}/edit`}>
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
                  src={`https://i.pravatar.cc/150?u=${resourceName}`}
                  alt={resourceName}
                />
                <AvatarFallback>{resource.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{resourceName}</h2>
              <p className="text-muted-foreground">{resource.designation}</p>
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
                  className={`mr-2 h-4 w-4 ${resource.availabilityStatus === 'Available' ? 'text-accent' : 'text-gray-400'}`}
                />
                <span>{resource.availabilityStatus}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                {getWorkModeIcon(resource.workMode)}
                <span>{resource.workMode}</span>
              </div>
              {resource.workLocation && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{resource.workLocation}</span>
                </div>
              )}
              {resource.totalExperienceYears !== undefined && (
                <div className="flex items-center text-muted-foreground">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>
                    {resource.totalExperienceYears} Years of Experience
                  </span>
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
                <span>Salary: {formatCurrency(resource.monthly_salary)}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="mr-2 h-4 w-4" />
                <span>Rate: {formatCurrency(resource.billingRate)}/hr</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 md:col-span-2">
          {/* Professional summary will be added in a future step */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BrainCircuit className="mr-2 h-5 w-5" /> Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {resource.technicalSkills?.map((skill) => (
                  <Badge
                    key={skill.name}
                    variant="secondary"
                    className="px-3 py-1 text-base"
                  >
                    {skill.name} ({skill.level})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          {(resource.certifications?.length || 0) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Award className="mr-2 h-5 w-5" /> Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {resource.certifications?.map((cert) => (
                    <Badge
                      key={cert.name}
                      variant="outline"
                      className="px-3 py-1 text-base"
                    >
                      {cert.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Industry experience will be added in a future step */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(resource.documents?.length || 0) > 0 ? (
                resource.documents?.map((doc) => (
                  <div
                    key={doc.url}
                    className="flex items-center justify-between rounded-md border p-2 pl-4"
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(doc.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="icon">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center">
                  <div className="space-y-2">
                    <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No documents have been uploaded for this resource.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

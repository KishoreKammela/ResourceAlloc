'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getResourceById } from '@/services/resources.services';
import type { Resource, Skill } from '@/types/resource';
import { Loader2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export default function ResourceComparisonClient() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resourceIds = useMemo(() => {
    const ids = searchParams.get('ids');
    return ids ? ids.split(',') : [];
  }, [searchParams]);

  useEffect(() => {
    async function fetchResources() {
      if (user?.type !== 'team' || !user.companyId) {
        setLoading(false);
        return;
      }

      if (resourceIds.length === 0) {
        setError('No resources selected for comparison.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const fetchedResources = await Promise.all(
          resourceIds.map((id) => getResourceById(id, user.companyId!))
        );
        const validResources = fetchedResources.filter(
          (res): res is Resource => res !== null
        );
        if (validResources.length !== resourceIds.length) {
          setError('Some resource profiles could not be loaded.');
        }
        setResources(validResources);
      } catch (e) {
        setError('Failed to fetch resource data.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [resourceIds, user]);

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    resources.forEach((res) => {
      res.technicalSkills?.forEach((skill: Skill) => skillSet.add(skill.name));
    });
    return Array.from(skillSet).sort();
  }, [resources]);

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
          <Link href="/resources">Return to Resources</Link>
        </Button>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No valid resource profiles to compare.</p>
        <Button asChild variant="link">
          <Link href="/resources">Return to Resources</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">
            Resource Comparison
          </h1>
          <p className="text-muted-foreground">
            Comparing {resources.length} selected resources side-by-side.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/resources">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resource List
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
              {resources.map((resource) => {
                const resourceName = `${resource.firstName} ${resource.lastName}`;
                return (
                  <TableHead key={resource.id} className="w-64 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={`https://i.pravatar.cc/150?u=${resourceName}`}
                          alt={resourceName}
                        />
                        <AvatarFallback>
                          {resource.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/resources/${resource.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {resourceName}
                      </Link>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Title
              </TableCell>
              {resources.map((resource) => (
                <TableCell key={resource.id} className="text-center">
                  {resource.designation}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Availability
              </TableCell>
              {resources.map((resource) => (
                <TableCell key={resource.id} className="text-center">
                  <Badge
                    variant={
                      resource.availabilityStatus === 'Available'
                        ? 'default'
                        : 'secondary'
                    }
                    className={
                      resource.availabilityStatus === 'Available'
                        ? 'border-accent bg-accent/10 text-accent'
                        : ''
                    }
                  >
                    {resource.availabilityStatus}
                  </Badge>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Work Mode
              </TableCell>
              {resources.map((resource) => (
                <TableCell key={resource.id} className="text-center">
                  {resource.workMode}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Location
              </TableCell>
              {resources.map((resource) => (
                <TableCell key={resource.id} className="text-center">
                  {resource.workLocation || 'N/A'}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Salary
              </TableCell>
              {resources.map((resource) => (
                <TableCell key={resource.id} className="text-center">
                  {formatCurrency(resource.costRate)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                Billing Rate
              </TableCell>
              {resources.map((resource) => (
                <TableCell key={resource.id} className="text-center">
                  {formatCurrency(resource.billingRate)}/hr
                </TableCell>
              ))}
            </TableRow>

            {/* Spacer row */}
            <TableRow className="bg-muted hover:bg-muted">
              <TableCell
                colSpan={resources.length + 1}
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
                {resources.map((resource) => (
                  <TableCell key={resource.id} className="text-center">
                    {resource.technicalSkills?.some((s) => s.name === skill) ? (
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
                  colSpan={resources.length + 1}
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

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Loader2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { getProjects } from '@/services/projects.services';
import type { Project } from '@/types/project';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import EmptyState from '@/components/app/empty-state';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (user && user.companyId) {
        const projs = await getProjects(user.companyId);
        setProjects(projs);
      }
      setLoading(false);
    }
    fetchProjects();
  }, [user]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'text-blue-600 border-blue-600';
      case 'Completed':
        return 'text-green-600 border-green-600';
      case 'Planning':
        return 'text-gray-600 border-gray-600';
      default:
        return 'text-foreground';
    }
  };

  const canCreateProject =
    user?.role === 'Admin' || user?.role === 'Super Admin';

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
        <h1 className="font-headline text-3xl font-bold">Projects</h1>
        {canCreateProject && (
          <Button asChild>
            <Link href="/projects/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Project
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project: Project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-primary hover:underline"
                      >
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>{project.timeline}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadgeClass(project.status)}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={<Briefcase className="h-8 w-8" />}
              title="No Projects Created"
              description="You haven't created any projects yet. Start by creating a project and assigning talent to it."
              action={
                canCreateProject
                  ? { label: 'Create Project', href: '/projects/new' }
                  : undefined
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

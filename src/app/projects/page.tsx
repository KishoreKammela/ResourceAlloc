
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { getProjects } from '@/services/projects.services';
import type { Project } from '@/types/project';
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";


export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
        const projs = await getProjects();
        setProjects(projs);
        setLoading(false);
    }
    fetchProjects();
  }, []);


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
  }

  const canCreateProject = user?.role === 'Admin' || user?.role === 'Super Admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Projects</h1>
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
                     <Link href={`/projects/${project.id}`} className="hover:underline text-primary">
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
               {projects.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                           No projects have been created yet.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

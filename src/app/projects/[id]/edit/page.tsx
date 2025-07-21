'use client';

import { notFound } from 'next/navigation';
import { getProjectById } from '@/services/projects.services';
import ProjectEditor from '@/components/app/project-editor';
import { getEmployees } from '@/services/employees.services';
import { useEffect, useState } from 'react';
import type { Project } from '@/types/project';
import type { Employee } from '@/types/employee';
import { Loader2 } from 'lucide-react';

type EditProjectPageProps = {
  params: {
    id: string;
  };
};

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [proj, emps] = await Promise.all([
        getProjectById(params.id),
        getEmployees(),
      ]);
      setProject(proj);
      setAllEmployees(emps);
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <ProjectEditor project={project} allEmployees={allEmployees} />
    </div>
  );
}

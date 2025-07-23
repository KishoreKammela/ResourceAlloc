'use client';

import { notFound, useRouter } from 'next/navigation';
import { getProjectById } from '@/services/projects.services';
import ProjectEditor from '@/components/app/project-editor';
import { useEffect, useState } from 'react';
import type { Project } from '@/types/project';
import type { Employee } from '@/types/employee';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

type ProjectEditorPageClientProps = {
  projectId: string;
};

export default function ProjectEditorPageClient({
  projectId,
}: ProjectEditorPageClientProps) {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user && user.companyId) {
        const [proj, emps] = await Promise.all([
          getProjectById(projectId, user.companyId),
          getEmployees(user.companyId),
        ]);
        setProject(proj);
        setAllEmployees(emps);
      }
      setLoading(false);
    }
    fetchData();
  }, [projectId, user]);

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
    <div>
      <ProjectEditor project={project} allEmployees={allEmployees} />
    </div>
  );
}

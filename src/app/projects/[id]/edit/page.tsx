import { notFound } from 'next/navigation';
import { getProjectById } from '@/services/projects.services';
import ProjectEditor from '@/components/app/project-editor';
import { getEmployees } from '@/services/employees.services';

type EditProjectPageProps = {
  params: {
    id: string;
  };
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const project = await getProjectById(params.id);
  const allEmployees = await getEmployees();

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <ProjectEditor project={project} allEmployees={allEmployees} />
    </div>
  );
}

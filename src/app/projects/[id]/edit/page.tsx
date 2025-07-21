
import { notFound } from 'next/navigation';
import { getProjectById } from '@/app/services/projects';
import ProjectEditor from '@/components/app/project-editor';
import { getEmployees } from '@/app/services/employees';

type EditProjectPageProps = {
    params: {
        id: string;
    }
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
    const project = getProjectById(params.id);
    const allEmployees = getEmployees();

    if (!project) {
        notFound();
    }

    return (
        <div className="container mx-auto">
            <ProjectEditor project={project} allEmployees={allEmployees} />
        </div>
    );
}

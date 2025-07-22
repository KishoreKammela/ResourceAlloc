import ProjectEditorPageClient from './_components/project-editor-page-client';

type EditProjectPageProps = {
  params: {
    id: string;
  };
};

export default function EditProjectPage({ params }: EditProjectPageProps) {
  return <ProjectEditorPageClient projectId={params.id} />;
}

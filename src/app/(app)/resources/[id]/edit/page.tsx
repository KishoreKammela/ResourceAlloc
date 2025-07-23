import ResourceEditorPageClient from './_components/resource-editor-page-client';

type EditResourcePageProps = {
  params: {
    id: string;
  };
};

export default function EditResourcePage({ params }: EditResourcePageProps) {
  return <ResourceEditorPageClient resourceId={params.id} />;
}

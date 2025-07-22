import ProjectDetailPageClient from './_components/project-detail-page-client';

type ProjectDetailPageProps = {
  params: {
    id: string;
  };
};

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return <ProjectDetailPageClient projectId={params.id} />;
}

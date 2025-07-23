import ResourceProfilePageClient from './_components/resource-profile-page-client';

type ResourceProfilePageProps = {
  params: {
    id: string;
  };
};

export default function ResourceProfilePage({
  params,
}: ResourceProfilePageProps) {
  return <ResourceProfilePageClient resourceId={params.id} />;
}

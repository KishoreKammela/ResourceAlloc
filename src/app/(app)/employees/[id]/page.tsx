import EmployeeProfilePageClient from './_components/employee-profile-page-client';

type EmployeeProfilePageProps = {
  params: {
    id: string;
  };
};

export default function EmployeeProfilePage({
  params,
}: EmployeeProfilePageProps) {
  return <EmployeeProfilePageClient employeeId={params.id} />;
}

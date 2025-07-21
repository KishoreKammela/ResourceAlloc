import { notFound } from 'next/navigation';
import { getEmployeeById } from '@/services/employees.services';
import ProfileEditor from '@/components/app/profile-editor';

type EditEmployeePageProps = {
  params: {
    id: string;
  };
};

export default async function EditEmployeePage({
  params,
}: EditEmployeePageProps) {
  const employee = await getEmployeeById(params.id);

  if (!employee) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <ProfileEditor employee={employee} />
    </div>
  );
}

import EmployeeEditorPageClient from './_components/employee-editor-page-client';

type EditEmployeePageProps = {
  params: {
    id: string;
  };
};

export default function EditEmployeePage({ params }: EditEmployeePageProps) {
  return <EmployeeEditorPageClient employeeId={params.id} />;
}

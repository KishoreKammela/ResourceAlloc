import { notFound } from 'next/navigation';
import { getEmployeeById } from '@/app/services/employees';
import ProfileEditor from '@/components/app/profile-editor';

type EditEmployeePageProps = {
    params: {
        id: string;
    }
}

export default function EditEmployeePage({ params }: EditEmployeePageProps) {
    const employee = getEmployeeById(params.id);

    if (!employee) {
        notFound();
    }

    return (
        <div className="container mx-auto">
            <ProfileEditor employee={employee} />
        </div>
    );
}

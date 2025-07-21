export type Employee = {
    id: string;
    name: string;
    title: string;
    skills: string[];
    availability: 'Available' | 'On Project';
    workMode: 'Remote' | 'Hybrid' | 'On-site';
    email?: string;
};

export type UpdatableEmployeeData = Partial<Omit<Employee, 'id'>>;

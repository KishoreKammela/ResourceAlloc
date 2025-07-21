import type { Employee } from './employee';

export type Project = {
    id: string;
    name: string;
    client: string;
    timeline: string;
    status: 'In Progress' | 'Completed' | 'Planning';
    description: string;
    requiredSkills: string[];
    team: Employee[];
};

export type UpdatableProjectData = Partial<Omit<Project, 'id'>>;

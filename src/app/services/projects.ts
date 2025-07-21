
// This is a mock data service.
// In a real application, you would fetch this data from a database.
import { v4 as uuidv4 } from 'uuid';
import { getEmployeeById, type Employee } from './employees';

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

const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform Revamp",
    client: "Future Gadget Labs",
    timeline: "Q3 2024 - Q1 2025",
    status: "In Progress",
    description: "A complete overhaul of the existing e-commerce platform to improve user experience, performance, and scalability. This includes a new design, a more robust backend, and integration with new payment gateways.",
    requiredSkills: ["React", "Node.js", "TypeScript", "AWS", "SQL", "Figma"],
    team: [getEmployeeById("1")!, getEmployeeById("3")!, getEmployeeById("6")!],
  },
  {
    id: "2",
    name: "Mobile Banking App",
    client: "Global Bank Corp",
    timeline: "Q2 2024 - Q4 2024",
    status: "In Progress",
    description: "Development of a new mobile banking application for iOS and Android, offering features like fund transfers, bill payments, and account management.",
    requiredSkills: ["React Native", "TypeScript", "CI/CD", "Cybersecurity"],
    team: [getEmployeeById("2")!, getEmployeeById("4")!],
  },
  {
    id: "3",
    name: "AI-Powered Logistics Optimizer",
    client: "ShipItFast Inc.",
    timeline: "Q1 2024 - Q3 2024",
    status: "Completed",
    description: "An AI-driven platform to optimize delivery routes, predict shipping times, and manage fleet maintenance, aiming to reduce costs and improve efficiency.",
    requiredSkills: ["Python", "Machine Learning", "TensorFlow", "Docker", "Kubernetes"],
    team: [getEmployeeById("5")!, getEmployeeById("4")!],
  },
  {
    id: "4",
    name: "Cloud Infrastructure Migration",
    client: "Innovate Solutions",
    timeline: "Q4 2024 - Q2 2025",
    status: "Planning",
    description: "Migrating the client's entire on-premise server infrastructure to a modern, scalable cloud solution on AWS, ensuring minimal downtime and improved performance.",
    requiredSkills: ["AWS", "Terraform", "CI/CD", "DevOps", "System Architecture"],
    team: [],
  },
];


export function getProjects(): Project[] {
    return mockProjects;
}

export function getProjectById(id: string): Project | undefined {
    return mockProjects.find(p => p.id === id);
}


export function addProject(projectData: Omit<Project, 'id' | 'status' | 'timeline' | 'description'>): Project {
    const newProject: Project = {
        id: uuidv4(),
        status: 'Planning', // Default status
        timeline: 'TBD', // Default timeline
        description: 'No description provided.', // Default description
        ...projectData,
    };
    mockProjects.push(newProject);
    return newProject;
}

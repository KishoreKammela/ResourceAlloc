// This is a mock data service.
// In a real application, you would fetch this data from a database.

import { v4 as uuidv4 } from 'uuid';

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


let mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.j@corp.com",
    title: "Senior Software Engineer",
    skills: ["React", "Node.js", "TypeScript", "AWS", "SQL"],
    availability: "Available",
    workMode: "Remote",
  },
  {
    id: "2",
    name: "Bob Williams",
    email: "bob.w@corp.com",
    title: "Project Manager",
    skills: ["Agile", "Scrum", "JIRA", "Budgeting", "Risk Management"],
    availability: "On Project",
    workMode: "Hybrid",
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie.b@corp.com",
    title: "UI/UX Designer",
    skills: ["Figma", "Sketch", "User Research", "Prototyping", "Adobe XD"],
    availability: "Available",
    workMode: "On-site",
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana.p@corp.com",
    title: "DevOps Engineer",
    skills: ["Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins"],
    availability: "Available",
    workMode: "Remote",
  },
  {
    id: "5",
    name: "Ethan Hunt",
    email: "ethan.h@corp.com",
    title: "Data Scientist",
    skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "SQL"],
    availability: "Available",
    workMode: "Hybrid",
  },
  {
    id: "6",
    name: "Fiona Glenanne",
    email: "fiona.g@corp.com",
    title: "Frontend Developer",
    skills: ["HTML", "CSS", "JavaScript", "React", "Vue.js"],
    availability: "On Project",
    workMode: "Remote",
  },
  {
    id: "7",
    name: "George Costanza",
    email: "george.c@corp.com",
    title: "QA Engineer",
    skills: ["Selenium", "Cypress", "JIRA", "Automated Testing", "Manual Testing"],
    availability: "Available",
    workMode: "On-site",
  }
];

export function getEmployees(): Employee[] {
    // Return a copy to avoid mutation issues
    return [...mockEmployees];
}

export function getEmployeeById(id: string): Employee | undefined {
    return mockEmployees.find(emp => emp.id === id);
}

export function addEmployee(employeeData: Omit<Employee, 'id' | 'availability' | 'workMode' | 'title'>): Employee {
    const newEmployee: Employee = {
        id: uuidv4(),
        title: "New Hire", // Default title
        availability: 'Available', // Default availability
        workMode: 'Remote', // Default work mode
        ...employeeData,
    };
    mockEmployees.push(newEmployee);
    return newEmployee;
}

export function updateEmployee(id: string, data: UpdatableEmployeeData): Employee | undefined {
    const employeeIndex = mockEmployees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
        return undefined;
    }
    const updatedEmployee = {
        ...mockEmployees[employeeIndex],
        ...data,
    };
    mockEmployees[employeeIndex] = updatedEmployee;
    return updatedEmployee;
}


export function deleteEmployee(id: string): boolean {
    const initialLength = mockEmployees.length;
    mockEmployees = mockEmployees.filter(emp => emp.id !== id);
    return mockEmployees.length < initialLength;
}

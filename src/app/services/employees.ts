// This is a mock data service.
// In a real application, you would fetch this data from a database.

export type Employee = {
    id: string;
    name: string;
    title: string;
    skills: string[];
    availability: 'Available' | 'On Project';
    workMode: 'Remote' | 'Hybrid' | 'On-site';
};

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Alice Johnson",
    title: "Senior Software Engineer",
    skills: ["React", "Node.js", "TypeScript", "AWS", "SQL"],
    availability: "Available",
    workMode: "Remote",
  },
  {
    id: "2",
    name: "Bob Williams",
    title: "Project Manager",
    skills: ["Agile", "Scrum", "JIRA", "Budgeting", "Risk Management"],
    availability: "On Project",
    workMode: "Hybrid",
  },
  {
    id: "3",
    name: "Charlie Brown",
    title: "UI/UX Designer",
    skills: ["Figma", "Sketch", "User Research", "Prototyping", "Adobe XD"],
    availability: "Available",
    workMode: "On-site",
  },
  {
    id: "4",
    name: "Diana Prince",
    title: "DevOps Engineer",
    skills: ["Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins"],
    availability: "Available",
    workMode: "Remote",
  },
  {
    id: "5",
    name: "Ethan Hunt",
    title: "Data Scientist",
    skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "SQL"],
    availability: "Available",
    workMode: "Hybrid",
  },
  {
    id: "6",
    name: "Fiona Glenanne",
    title: "Frontend Developer",
    skills: ["HTML", "CSS", "JavaScript", "React", "Vue.js"],
    availability: "On Project",
    workMode: "Remote",
  },
  {
    id: "7",
    name: "George Costanza",
    title: "QA Engineer",
    skills: ["Selenium", "Cypress", "JIRA", "Automated Testing", "Manual Testing"],
    availability: "Available",
    workMode: "On-site",
  }
];

export function getEmployees(): Employee[] {
    return mockEmployees;
}

export function getEmployeeById(id: string): Employee | undefined {
    return mockEmployees.find(emp => emp.id === id);
}

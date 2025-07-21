import Dashboard from '@/components/app/dashboard';
import { getEmployees } from '@/services/employees.services';
import { getProjects } from '@/services/projects.services';
import type { Employee } from '@/types/employee';
import type { Project } from '@/types/project';

type SkillsData = {
  name: string;
  value: number;
}

export default async function Home() {
  const employees = await getEmployees();
  const projects = await getProjects();

  const totalEmployees = employees.length;
  const projectsInProgress = projects.filter(p => p.status === 'In Progress').length;
  const availableEmployees = employees.filter(e => e.availability === 'Available').length;

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees.toString(),
      icon: "Users",
    },
    {
      title: "Projects In Progress",
      value: projectsInProgress.toString(),
      icon: "Briefcase",
    },
    {
      title: "Available for Projects",
      value: availableEmployees.toString(),
      icon: "UserCheck",
    },
  ];

  const skillsCount = employees
    .flatMap(e => e.skills)
    .reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topSkills: SkillsData[] = Object.entries(skillsCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7)
    .map(([name, value]) => ({ name, value }));

  const recentProjects = projects.slice(0, 4);


  return (
    <div className="space-y-8">
      <Dashboard 
        stats={stats}
        skillsData={topSkills}
        recentProjects={recentProjects}
      />
    </div>
  );
}

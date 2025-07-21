import SkillGapAnalyzer from '@/components/app/skill-gap-analyzer';
import { getEmployees } from '@/services/employees.services';
import { getProjects } from '@/services/projects.services';

export default async function AnalysisPage() {
  const employees = await getEmployees();
  const projects = await getProjects();

  const requiredSkills = [
    ...new Set(projects.flatMap((p) => p.requiredSkills)),
  ];
  const availableSkills = [...new Set(employees.flatMap((e) => e.skills))];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Skill Gap Analysis</h1>
      </div>
      <SkillGapAnalyzer
        requiredSkills={requiredSkills}
        availableSkills={availableSkills}
      />
    </div>
  );
}

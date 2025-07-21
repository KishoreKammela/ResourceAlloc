'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import SkillGapAnalyzer from '@/components/app/skill-gap-analyzer';
import { getEmployees } from '@/services/employees.services';
import { getProjects } from '@/services/projects.services';

export default function AnalysisPage() {
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [employees, projects] = await Promise.all([
        getEmployees(),
        getProjects(),
      ]);

      setRequiredSkills([
        ...new Set(projects.flatMap((p) => p.requiredSkills)),
      ]);
      setAvailableSkills([...new Set(employees.flatMap((e) => e.skills))]);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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

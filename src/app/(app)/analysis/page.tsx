'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import SkillGapAnalyzer from '@/components/app/skill-gap-analyzer';
import { getResources } from '@/services/resources.services';
import { getProjects } from '@/services/projects.services';
import { useAuth } from '@/contexts/auth-context';

export default function AnalysisPage() {
  const { user } = useAuth();
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user || !user.companyId) {
        setLoading(false);
        return;
      }

      const [resources, projects] = await Promise.all([
        getResources(user.companyId),
        getProjects(user.companyId),
      ]);

      setRequiredSkills([
        ...new Set(projects.flatMap((p) => p.requiredSkills)),
      ]);
      setAvailableSkills([...new Set(resources.flatMap((e) => e.skills))]);
      setLoading(false);
    }

    fetchData();
  }, [user]);

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

'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import Dashboard from '@/components/app/dashboard';
import { getResources } from '@/services/resources.services';
import { getProjects } from '@/services/projects.services';
import type { Resource } from '@/types/resource';
import type { Project } from '@/types/project';
import { useAuth } from '@/contexts/auth-context';
import WelcomeModal from '@/components/app/welcome-modal';
import { updateTeamMemberProfile } from '@/services/users.services';

type SkillsData = {
  name: string;
  value: number;
};

type Stats = {
  title: string;
  value: string;
  icon: string;
};

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats[]>([]);
  const [skillsData, setSkillsData] = useState<SkillsData[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user || user.type !== 'team' || !user.companyId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const [resources, projects] = await Promise.all([
        getResources(user.companyId),
        getProjects(user.companyId),
      ]);

      const totalResources = resources.length;
      const projectsInProgress = projects.filter(
        (p) => p.projectStatus === 'Active'
      ).length;
      const availableResources = resources.filter(
        (e) => e.availabilityStatus === 'Available'
      ).length;

      setStats([
        {
          title: 'Total Resources',
          value: totalResources.toString(),
          icon: 'Users',
        },
        {
          title: 'Projects In Progress',
          value: projectsInProgress.toString(),
          icon: 'Briefcase',
        },
        {
          title: 'Available for Projects',
          value: availableResources.toString(),
          icon: 'UserCheck',
        },
      ]);

      const skillsCount = resources
        .flatMap((e) => e.technicalSkills?.map((s) => s.name) || [])
        .reduce(
          (acc, skill) => {
            if (skill) {
              acc[skill] = (acc[skill] || 0) + 1;
            }
            return acc;
          },
          {} as Record<string, number>
        );

      const topSkills: SkillsData[] = Object.entries(skillsCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 7)
        .map(([name, value]) => ({ name, value }));
      setSkillsData(topSkills);

      setRecentProjects(projects.slice(0, 4));

      if (user && user.type === 'team' && !user.onboardingCompleted) {
        setShowWelcomeModal(true);
      }

      setLoading(false);
    }

    fetchData();
  }, [user]);

  const handleWelcomeComplete = async () => {
    if (user && user.type === 'team') {
      await updateTeamMemberProfile(user.uid, { onboardingCompleted: true });
      await refreshUser(); // Refresh user state in context
      setShowWelcomeModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user?.type === 'platform') {
    return (
      <div>
        <h1 className="font-headline text-3xl font-bold">
          Platform Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome, {user.firstName}. The platform administration panel is under
          construction.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeComplete}
        userName={user?.firstName || 'there'}
      />
      <Dashboard
        stats={stats}
        skillsData={skillsData}
        recentProjects={recentProjects}
      />
    </div>
  );
}

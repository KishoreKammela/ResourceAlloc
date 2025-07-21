'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import Dashboard from '@/components/app/dashboard';
import { getEmployees } from '@/services/employees.services';
import { getProjects } from '@/services/projects.services';
import type { Employee } from '@/types/employee';
import type { Project } from '@/types/project';
import { useAuth } from '@/contexts/auth-context';
import WelcomeModal from '@/components/app/welcome-modal';
import { updateUserProfile } from '@/services/users.services';

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
      // Wait until the user object is fully loaded to prevent race conditions
      if (!user) {
        return;
      }

      setLoading(true);
      const [employees, projects] = await Promise.all([
        getEmployees(),
        getProjects(),
      ]);

      const totalEmployees = employees.length;
      const projectsInProgress = projects.filter(
        (p) => p.status === 'In Progress'
      ).length;
      const availableEmployees = employees.filter(
        (e) => e.availability === 'Available'
      ).length;

      setStats([
        {
          title: 'Total Employees',
          value: totalEmployees.toString(),
          icon: 'Users',
        },
        {
          title: 'Projects In Progress',
          value: projectsInProgress.toString(),
          icon: 'Briefcase',
        },
        {
          title: 'Available for Projects',
          value: availableEmployees.toString(),
          icon: 'UserCheck',
        },
      ]);

      const skillsCount = employees
        .flatMap((e) => e.skills)
        .reduce(
          (acc, skill) => {
            acc[skill] = (acc[skill] || 0) + 1;
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

      if (user && !user.onboardingCompleted) {
        setShowWelcomeModal(true);
      }

      setLoading(false);
    }

    fetchData();
  }, [user]);

  const handleWelcomeComplete = async () => {
    if (user) {
      await updateUserProfile(user.uid, { onboardingCompleted: true });
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

  return (
    <div className="space-y-8">
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeComplete}
        userName={user?.name || 'there'}
      />
      <Dashboard
        stats={stats}
        skillsData={skillsData}
        recentProjects={recentProjects}
      />
    </div>
  );
}

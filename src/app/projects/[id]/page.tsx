'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/services/projects.services';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Users,
  Briefcase,
  Target,
  FolderKanban,
  Users2,
  Pencil,
  Bot,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { generateProjectReport } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { GenerateProjectReportOutput } from '@/ai/flows/generate-project-report';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ReportDisplay from '@/components/app/report-display';
import type { Project } from '@/types/project';
import { useAuth } from '@/contexts/auth-context';

type ProjectDetailPageProps = {
  params: {
    id: string;
  };
};

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [report, setReport] = useState<GenerateProjectReportOutput | null>(
    null
  );
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      const fetchedProject = await getProjectById(params.id);
      setProject(fetchedProject);
      setIsLoading(false);
    }
    fetchProject();
  }, [params.id]);

  const canManageProject =
    user?.role === 'Admin' || user?.role === 'Super Admin';

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  const onGenerateReport = async () => {
    setIsReportLoading(true);
    setReport(null);
    try {
      const result = await generateProjectReport({ projectId: project.id });
      if (result.error) {
        throw new Error(result.error);
      }
      setReport(result.report);
      setIsReportDialogOpen(true);
      toast({
        title: 'Report Generated',
        description: 'The AI-powered project report is ready.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsReportLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Planning':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">{project.name}</h1>
          <p className="text-xl text-muted-foreground">{project.client}</p>
        </div>
        <div className="flex gap-2">
          {canManageProject && (
            <>
              <Button onClick={onGenerateReport} disabled={isReportLoading}>
                {isReportLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="mr-2 h-4 w-4" />
                )}
                Generate AI Report
              </Button>
              <Button asChild>
                <Link href={`/projects/${project.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Project
                </Link>
              </Button>
            </>
          )}
          <Button asChild variant="outline">
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FolderKanban className="mr-2 h-5 w-5" /> Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{project.description}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Target className="mr-2 h-5 w-5" /> Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 text-base"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                <Badge
                  variant="outline"
                  className={getStatusBadgeClass(project.status)}
                >
                  {project.status}
                </Badge>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{project.timeline}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users2 className="mr-2 h-5 w-5" /> Assigned Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.team.length > 0 ? (
                project.team.map((member) => (
                  <Link
                    href={`/employees/${member.id}`}
                    key={member.id}
                    className="group flex items-center gap-3"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=${member.name}`}
                        alt={member.name}
                      />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold group-hover:underline">
                        {member.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.title}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No team members assigned yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              AI-Generated Project Report
            </DialogTitle>
          </DialogHeader>
          {report && <ReportDisplay report={report} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

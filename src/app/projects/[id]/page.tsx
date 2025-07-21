
import { notFound } from 'next/navigation';
import { getProjectById } from '@/services/projects.services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Briefcase, Target, FolderKanban, Users2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type ProjectDetailPageProps = {
    params: {
        id: string;
    }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const project = await getProjectById(params.id);

    if (!project) {
        notFound();
    }

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Completed': return 'bg-green-100 text-green-800 border-green-300';
            case 'Planning': return 'bg-gray-100 text-gray-800 border-gray-300';
            default: return 'bg-secondary text-secondary-foreground';
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">{project.name}</h1>
                    <p className="text-xl text-muted-foreground">{project.client}</p>
                </div>
                 <div className="flex gap-2">
                    <Button asChild>
                        <Link href={`/projects/${project.id}/edit`}>
                           <Pencil className="mr-2 h-4 w-4" />
                           Edit Project
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/projects">
                            Back to Projects
                        </Link>
                    </Button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center"><FolderKanban className="mr-2 h-5 w-5"/> Project Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{project.description}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center"><Target className="mr-2 h-5 w-5"/> Required Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {project.requiredSkills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-base py-1 px-3">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-1 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                           <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Badge variant="outline" className={getStatusBadgeClass(project.status)}>{project.status}</Badge>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                               <Calendar className="h-4 w-4 mr-2" />
                               <span>{project.timeline}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center"><Users2 className="mr-2 h-5 w-5" /> Assigned Team</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {project.team.length > 0 ? project.team.map(member => (
                                <Link href={`/employees/${member.id}`} key={member.id} className="flex items-center gap-3 group">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.name}`} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold group-hover:underline">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.title}</p>
                                    </div>
                                </Link>
                            )) : (
                                <p className="text-sm text-muted-foreground">No team members assigned yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

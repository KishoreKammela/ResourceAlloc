
import { notFound } from 'next/navigation';
import { getEmployeeById } from '@/app/services/employees';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, MapPin, CheckCircle, Wifi, Users, Building } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type EmployeeProfilePageProps = {
    params: {
        id: string;
    }
}

export default function EmployeeProfilePage({ params }: EmployeeProfilePageProps) {
    const employee = getEmployeeById(params.id);

    if (!employee) {
        notFound();
    }

    const getWorkModeIcon = (workMode: string) => {
        switch (workMode) {
            case 'Remote': return <Wifi className="h-4 w-4 mr-2" />;
            case 'Hybrid': return <Users className="h-4 w-4 mr-2" />;
            case 'On-site': return <Building className="h-4 w-4 mr-2" />;
            default: return null;
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
             <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">{employee.name}</h1>
                    <p className="text-xl text-muted-foreground">{employee.title}</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/employees">
                        Back to Employees
                    </Link>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-8">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.name}`} alt={employee.name} />
                                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-semibold">{employee.name}</h2>
                            <p className="text-muted-foreground">{employee.title}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                           <div className="flex items-center text-muted-foreground">
                                <CheckCircle className={`h-4 w-4 mr-2 ${employee.availability === 'Available' ? 'text-accent' : 'text-gray-400'}`} />
                                <span>{employee.availability}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                {getWorkModeIcon(employee.workMode)}
                                <span>{employee.workMode}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Skills</CardTitle>
                             <CardDescription>A comprehensive list of the employee's professional skills.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {employee.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-base py-1 px-3">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

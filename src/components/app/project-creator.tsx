'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  Plus,
  X,
  Search,
  User,
  Trash2,
  Lightbulb,
  Star,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { findCandidates } from '@/app/actions';
import { addProject } from '@/services/projects.services';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import type { SuggestCandidatesOutput } from '@/ai/flows/suggest-candidates';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { Employee } from '@/types/employee';
import { getClients } from '@/services/clients.services';
import { useAuth } from '@/contexts/auth-context';
import type { Client } from '@/types/client';
import type { Project } from '@/types/project';

const projectFormSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters long.'),
  clientId: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type Candidate = SuggestCandidatesOutput['candidates'][0];
type CandidatesResult = { candidates: Candidate[] };

export default function ProjectCreator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isFindingCandidates, setIsFindingCandidates] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [candidatesResult, setCandidatesResult] =
    useState<CandidatesResult | null>(null);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    'React',
    'Node.js',
    'TypeScript',
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Employee[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (user && user.companyId) {
        const [employees, clients] = await Promise.all([
          getEmployees(user.companyId),
          getClients(user.companyId),
        ]);
        setAllEmployees(employees);
        setClients(clients);
      }
    }
    fetchData();
  }, [user]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: '', clientId: 'no-client' },
  });

  const handleFindCandidates = async () => {
    if (!user?.companyId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not determine your company.',
      });
      return;
    }

    const isValid = await form.trigger();
    if (!isValid) return;

    setIsFindingCandidates(true);
    setCandidatesResult(null);
    setSelectedTeam([]);

    if (requiredSkills.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Skills Specified',
        description:
          'Please add at least one required skill to find candidates.',
      });
      setIsFindingCandidates(false);
      return;
    }

    try {
      const result = await findCandidates({
        requiredSkills,
        companyId: user.companyId,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setCandidatesResult(result as CandidatesResult);

      toast({
        title: 'Candidates Found',
        description: "We've found suitable candidates for your project.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Finding Candidates',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsFindingCandidates(false);
    }
  };

  const saveProject = async (team: Employee[]) => {
    if (!user || !user.companyId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Cannot save project without a company context.',
      });
      return false;
    }
    setIsCreatingProject(true);
    try {
      const { name, clientId } = form.getValues();
      const selectedClient =
        clientId === 'no-client'
          ? undefined
          : clients.find((c) => c.id === clientId);

      const projectData: Omit<Project, 'id'> = {
        name,
        companyId: user.companyId,
        requiredSkills,
        team: team,
        status: 'Planning',
        timeline: 'TBD',
        description: 'No description provided.',
        ...(selectedClient && {
          clientId: selectedClient.id,
          clientName: selectedClient.name,
        }),
      };

      const newProject = await addProject(projectData);

      toast({
        title: 'Project Created',
        description: `Project "${newProject.name}" has been successfully created.`,
      });

      router.push('/projects');
      return true;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Saving Project',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
      return false;
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleCreateProject = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;
    await saveProject([]); // Save with empty team
  };

  const handleCreateProjectWithTeam = async () => {
    await saveProject(selectedTeam);
  };

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !requiredSkills.includes(trimmedSkill)) {
      setRequiredSkills((prev) => [...prev, trimmedSkill]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setRequiredSkills((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleAddNewSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const resetFlow = () => {
    form.reset();
    setCandidatesResult(null);
    setRequiredSkills(['React', 'Node.js', 'TypeScript']);
    setSelectedTeam([]);
    setIsFindingCandidates(false);
    setIsCreatingProject(false);
  };

  const toggleCandidateSelection = (candidate: Candidate) => {
    setSelectedTeam((prev) => {
      const isSelected = prev.some((c) => c.id === candidate.employeeId);
      if (isSelected) {
        return prev.filter((c) => c.id !== candidate.employeeId);
      } else {
        const employeeData = allEmployees.find(
          (e) => e.id === candidate.employeeId
        );
        if (employeeData) {
          return [...prev, employeeData];
        }
        return prev;
      }
    });
  };

  return (
    <Card className="mx-auto w-full max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Create Project & Find Talent
        </CardTitle>
        <CardDescription>
          Define your project and its required skills to find the best
          candidates.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFindCandidates();
          }}
        >
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. E-commerce Platform"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Assign to a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no-client">None</SelectItem>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Required Skills</FormLabel>
              <div className="flex min-h-[80px] flex-wrap gap-2 rounded-md border p-4">
                {requiredSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="default"
                    className="flex items-center gap-2 border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/20"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="rounded-full p-0.5 hover:bg-black/10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {requiredSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add skills needed for this project.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. AWS, Figma..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewSkill();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddNewSkill}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCreateProject}
              disabled={isFindingCandidates || isCreatingProject}
            >
              {isCreatingProject && !isFindingCandidates ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create Project
            </Button>
            <Button
              type="submit"
              disabled={
                isFindingCandidates || isCreatingProject || !!candidatesResult
              }
            >
              {isFindingCandidates ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Find Candidates
            </Button>
          </CardFooter>
        </form>
      </Form>

      <AnimatePresence>
        {candidatesResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Separator className="my-6" />
            <CardContent className="space-y-6">
              <h3 className="font-headline text-lg font-semibold">
                Suggested Candidates
              </h3>

              {candidatesResult.candidates.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {candidatesResult.candidates.map((candidate, index) => {
                    const isSelected = selectedTeam.some(
                      (c) => c.id === candidate.employeeId
                    );
                    return (
                      <Card
                        key={index}
                        className={`flex flex-col ${isSelected ? 'border-primary' : ''}`}
                      >
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={`https://i.pravatar.cc/150?u=${candidate.name}`}
                              alt={candidate.name}
                            />
                            <AvatarFallback>
                              {candidate.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">
                              {candidate.name}
                            </CardTitle>
                            <CardDescription>{candidate.title}</CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                          <div>
                            <h4 className="mb-2 flex items-center text-sm font-semibold">
                              <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />{' '}
                              Justification
                            </h4>
                            <p className="text-sm italic text-muted-foreground">
                              &quot;{candidate.justification}&quot;
                            </p>
                          </div>
                          <div>
                            <h4 className="mb-2 flex items-center text-sm font-semibold">
                              <Star className="mr-2 h-4 w-4 text-amber-500" />{' '}
                              Matching Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {candidate.matchingSkills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            variant={isSelected ? 'secondary' : 'default'}
                            onClick={() => toggleCandidateSelection(candidate)}
                          >
                            {isSelected ? (
                              <UserMinus className="mr-2 h-4 w-4" />
                            ) : (
                              <UserPlus className="mr-2 h-4 w-4" />
                            )}
                            {isSelected
                              ? 'Remove from Project'
                              : 'Assign to Project'}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No suitable candidates found with the specified skills.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={resetFlow}
                disabled={isCreatingProject}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              <Button
                type="button"
                onClick={handleCreateProjectWithTeam}
                disabled={isCreatingProject || selectedTeam.length === 0}
              >
                {isCreatingProject ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Create Project & Assign Team
              </Button>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

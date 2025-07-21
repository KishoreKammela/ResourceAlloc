
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, X, Search, User, Trash2, Lightbulb, Star, UserPlus, UserMinus } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { findCandidates, createProject } from '@/app/actions';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import type { SuggestCandidatesOutput } from '@/ai/flows/suggest-candidates';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { Employee } from '@/types/employee';
import { getEmployees } from '@/services/employees.services';


const projectFormSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters long.'),
  client: z.string().min(2, 'Client name must be at least 2 characters long.'),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type Candidate = SuggestCandidatesOutput['candidates'][0];
type CandidatesResult = { candidates: Candidate[] };


export default function ProjectCreator() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [candidatesResult, setCandidatesResult] = useState<CandidatesResult | null>(null);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React', 'Node.js', 'TypeScript']);
  const [newSkill, setNewSkill] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Employee[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      const employees = await getEmployees();
      setAllEmployees(employees);
    }
    fetchEmployees();
  }, []);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: '', client: '' },
  });

  const handleFindCandidates: SubmitHandler<ProjectFormValues> = async (data) => {
    setIsLoading(true);
    setCandidatesResult(null);
    setSelectedTeam([]);

    if (requiredSkills.length === 0) {
        toast({
            variant: 'destructive',
            title: 'No Skills Specified',
            description: 'Please add at least one required skill to find candidates.',
        });
        setIsLoading(false);
        return;
    }

    try {
      const result = await findCandidates(requiredSkills);

      if (result.error) {
        throw new Error(result.error);
      }

      setCandidatesResult(result as CandidatesResult);

      toast({
        title: 'Candidates Found',
        description: 'We\'ve found suitable candidates for your project.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Finding Candidates',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !requiredSkills.includes(trimmedSkill)) {
      setRequiredSkills(prev => [...prev, trimmedSkill]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setRequiredSkills(prev => prev.filter(skill => skill !== skillToRemove));
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
    setIsLoading(false);
    setIsSaving(false);
  }

  const toggleCandidateSelection = (candidate: Candidate) => {
    setSelectedTeam(prev => {
        const isSelected = prev.some(c => c.id === candidate.employeeId);
        if (isSelected) {
            return prev.filter(c => c.id !== candidate.employeeId);
        } else {
            const employeeData = allEmployees.find(e => e.id === candidate.employeeId);
            if (employeeData) {
              return [...prev, employeeData];
            }
            return prev;
        }
    })
  }

  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
        const { name, client } = form.getValues();
        const result = await createProject({
            name,
            client,
            requiredSkills,
            team: selectedTeam,
            status: 'Planning',
            timeline: 'TBD',
            description: 'No description provided.',
        });

        if (result.error) {
            throw new Error(result.error);
        }

        toast({
            title: 'Project Created',
            description: `Project "${result.project?.name}" has been successfully created.`,
        });

        router.push('/projects');

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error Saving Project',
            description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        });
    } finally {
        setIsSaving(false);
    }
  };


  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Project & Find Talent</CardTitle>
        <CardDescription>Define your project and its required skills to find the best candidates.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFindCandidates)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. E-commerce Platform" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Future Gadget Labs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-2">
                <FormLabel>Required Skills</FormLabel>
                <div className="p-4 border rounded-md min-h-[80px] flex flex-wrap gap-2">
                  {requiredSkills.map(skill => (
                    <Badge key={skill} variant="default" className="text-sm py-1 px-3 flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="rounded-full hover:bg-black/10 p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                   {requiredSkills.length === 0 && <p className="text-sm text-muted-foreground">Add skills needed for this project.</p>}
                </div>
            </div>

            <div className="flex gap-2">
                <Input 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. AWS, Figma..."
                    onKeyDown={(e) => {if(e.key === 'Enter'){ e.preventDefault(); handleAddNewSkill()}}}
                />
                <Button type="button" variant="outline" onClick={handleAddNewSkill}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add Skill
                </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading || !!candidatesResult}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
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
              <h3 className="text-lg font-headline font-semibold">Suggested Candidates</h3>
              
              {candidatesResult.candidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidatesResult.candidates.map((candidate, index) => {
                        const isSelected = selectedTeam.some(c => c.id === candidate.employeeId);
                        return (
                            <Card key={index} className={`flex flex-col ${isSelected ? 'border-primary' : ''}`}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${candidate.name}`} alt={candidate.name} />
                                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-xl">{candidate.name}</CardTitle>
                                        <CardDescription>{candidate.title}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center"><Lightbulb className="w-4 h-4 mr-2 text-yellow-500"/> Justification</h4>
                                        <p className="text-sm text-muted-foreground italic">"{candidate.justification}"</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center"><Star className="w-4 h-4 mr-2 text-amber-500"/> Matching Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {candidate.matchingSkills.map(skill => (
                                                <Badge key={skill} variant="secondary">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant={isSelected ? "secondary" : "default"} onClick={() => toggleCandidateSelection(candidate)}>
                                        {isSelected ? <UserMinus className="mr-2 h-4 w-4"/> : <UserPlus className="mr-2 h-4 w-4"/>}
                                        {isSelected ? 'Remove from Project' : 'Assign to Project'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No suitable candidates found with the specified skills.</p>
              )}
          </CardContent>
           <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={resetFlow} disabled={isSaving}>
                <Trash2 className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              <Button onClick={handleSaveProject} disabled={isSaving || selectedTeam.length === 0}>
                 {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Create Project & Assign Team
              </Button>
           </CardFooter>
        </motion.div>
      )}
      </AnimatePresence>
    </Card>
  );
}

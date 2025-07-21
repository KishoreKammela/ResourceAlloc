'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  Plus,
  X,
  User,
  Save,
  ArrowLeft,
  BadgePlus,
  UserPlus,
  UserMinus,
  Trash2,
} from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleUpdateProject, handleDeleteProject } from '@/app/actions';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import type { Employee } from '@/types/employee';
import type { Project } from '@/types/project';
import Link from 'next/link';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const projectFormSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters long.'),
  client: z.string().min(2, 'Client name must be at least 2 characters long.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long.'),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectEditor({
  project,
  allEmployees,
}: {
  project: Project;
  allEmployees: Employee[];
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(
    project.requiredSkills
  );
  const [newSkill, setNewSkill] = useState('');
  const [team, setTeam] = useState<Employee[]>(project.team);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project.name,
      client: project.client,
      description: project.description,
    },
  });

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    setIsSaving(true);
    try {
      const result = await handleUpdateProject(project.id, {
        ...data,
        requiredSkills,
        team,
      });
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: 'Project Updated',
        description: `The project "${result.project?.name}&quot; has been successfully updated.`,
      });

      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Updating Project',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await handleDeleteProject(project.id);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: 'Project Deleted',
        description: `The project "${project.name}&quot; has been deleted.`,
      });
      router.push('/projects');
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Deleting Project',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsDeleting(false);
    }
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

  const addTeamMember = (employee: Employee) => {
    if (!team.some((member) => member.id === employee.id)) {
      setTeam((prev) => [...prev, employee]);
    }
    setPopoverOpen(false);
  };

  const removeTeamMember = (employeeId: string) => {
    setTeam((prev) => prev.filter((member) => member.id !== employeeId));
  };

  const availableEmployees = allEmployees.filter(
    (emp) => !team.some((member) => member.id === emp.id)
  );

  return (
    <Card className="mx-auto max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Project</CardTitle>
        <CardDescription>
          Update the details for &quot;{project.name}&quot;.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a brief overview of the project."
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            <div className="space-y-4">
              <h3 className="font-headline text-lg font-semibold">
                Manage Required Skills
              </h3>
              <div>
                <FormLabel>Current Skills</FormLabel>
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
                      No skills assigned. Add some below.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <FormLabel>Add New Skill</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Public Speaking"
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
                    <BadgePlus className="mr-2 h-4 w-4" />
                    Add Skill
                  </Button>
                </div>
              </div>
            </div>

            <Separator />
            <div className="space-y-4">
              <h3 className="font-headline text-lg font-semibold">
                Manage Team
              </h3>
              <div>
                <FormLabel>Current Team Members</FormLabel>
                <div className="min-h-[80px] space-y-3 rounded-md border p-4">
                  {team.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`https://i.pravatar.cc/150?u=${member.name}`}
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.title}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTeamMember(member.id)}
                      >
                        <UserMinus className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {team.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No team members assigned.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <FormLabel>Add Team Member</FormLabel>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={popoverOpen}
                      className="w-full justify-start"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add an employee...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search employees..." />
                      <CommandList>
                        <CommandEmpty>No employees found.</CommandEmpty>
                        <CommandGroup>
                          {availableEmployees.map((employee) => (
                            <CommandItem
                              key={employee.id}
                              onSelect={() => addTeamMember(employee)}
                              className="flex items-center justify-between"
                            >
                              <span>
                                {employee.name} -{' '}
                                <span className="text-muted-foreground">
                                  {employee.title}
                                </span>
                              </span>
                              <Plus className="h-4 w-4" />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/projects/${project.id}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isSaving || isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the project &quot;{project.name}&quot;.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} disabled={isDeleting}>
                      {isDeleting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Button type="submit" disabled={isSaving || isDeleting}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

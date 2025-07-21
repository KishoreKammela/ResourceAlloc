"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, X, User, Trash2, BadgePlus, Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleUpdateEmployee } from '@/app/actions';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import type { Employee } from '@/app/services/employees';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Link from 'next/link';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  email: z.string().email('Please enter a valid email address.'),
  title: z.string().min(2, 'Title must be at least 2 characters long.'),
  availability: z.enum(['Available', 'On Project']),
  workMode: z.enum(['Remote', 'Hybrid', 'On-site']),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileEditor({ employee }: { employee: Employee }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [finalSkills, setFinalSkills] = useState<string[]>(employee.skills);
  const [newSkill, setNewSkill] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email || '',
      title: employee.title,
      availability: employee.availability,
      workMode: employee.workMode,
    },
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsSaving(true);
    try {
      const result = await handleUpdateEmployee(employee.id, { ...data, skills: finalSkills });
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: 'Profile Updated',
        description: `The profile for ${result.employee?.name} has been successfully updated.`,
      });

      router.push(`/employees/${employee.id}`);
      router.refresh(); // Refresh to show updated data
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !finalSkills.includes(trimmedSkill)) {
      setFinalSkills(prev => [...prev, trimmedSkill]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFinalSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };
  
  const handleAddNewSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Employee Profile</CardTitle>
        <CardDescription>Update the details for {employee.name}.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. jane.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Availability</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select availability" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Available">Available</SelectItem>
                                    <SelectItem value="On Project">On Project</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="workMode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Work Mode</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select work mode" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    <SelectItem value="On-site">On-site</SelectItem>
                                </SelectContent>
                            </Select>
                             <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Separator />
            <div className="space-y-4">
                <h3 className="text-lg font-headline font-semibold">Manage Skills</h3>
                <div>
                  <FormLabel>Current Skills</FormLabel>
                  <div className="p-4 border rounded-md min-h-[80px] flex flex-wrap gap-2">
                    {finalSkills.map(skill => (
                      <Badge key={skill} variant="default" className="text-sm py-1 px-3 flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="rounded-full hover:bg-black/10 p-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {finalSkills.length === 0 && <p className="text-sm text-muted-foreground">No skills assigned. Add some below.</p>}
                  </div>
                </div>
                 <div>
                    <FormLabel>Add New Skill</FormLabel>
                    <div className="flex gap-2">
                      <Input 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="e.g. Public Speaking"
                        onKeyDown={(e) => {if(e.key === 'Enter'){ e.preventDefault(); handleAddNewSkill()}}}
                      />
                      <Button type="button" variant="outline" onClick={handleAddNewSkill}>
                        <BadgePlus className="mr-2 h-4 w-4"/>
                        Add Skill
                      </Button>
                    </div>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
                <Link href={`/employees/${employee.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancel
                </Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
               {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

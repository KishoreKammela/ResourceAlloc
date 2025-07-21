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
  Trash2,
  BadgePlus,
  Save,
  ArrowLeft,
  DollarSign,
  MapPin,
  FileUp,
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
import { handleUpdateEmployee, handleDeleteEmployee } from '@/app/actions';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import Link from 'next/link';
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
import type { Employee } from '@/types/employee';
import { Textarea } from '../ui/textarea';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  email: z.string().email('Please enter a valid email address.'),
  title: z.string().min(2, 'Title must be at least 2 characters long.'),
  availability: z.enum(['Available', 'On Project']),
  workMode: z.enum(['Remote', 'Hybrid', 'On-site']),
  professionalSummary: z.string().optional(),
  location: z.string().optional(),
  compensationSalary: z.coerce.number().optional(),
  compensationBillingRate: z.coerce.number().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileEditor({ employee }: { employee: Employee }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      professionalSummary: employee.professionalSummary || '',
      location: employee.location || '',
      compensationSalary: employee.compensation?.salary,
      compensationBillingRate: employee.compensation?.billingRate,
    },
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsSaving(true);
    try {
      const { compensationSalary, compensationBillingRate, ...restOfData } =
        data;

      const result = await handleUpdateEmployee(employee.id, {
        ...restOfData,
        skills: finalSkills,
        compensation: {
          salary: compensationSalary,
          billingRate: compensationBillingRate,
        },
      });
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
        title: 'Error Updating Profile',
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
      const result = await handleDeleteEmployee(employee.id);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: 'Employee Deleted',
        description: `The profile for ${employee.name} has been deleted.`,
      });
      router.push('/employees');
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Deleting Profile',
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
    if (trimmedSkill && !finalSkills.includes(trimmedSkill)) {
      setFinalSkills((prev) => [...prev, trimmedSkill]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFinalSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleAddNewSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  return (
    <Card className="mx-auto max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Edit Employee Profile
        </CardTitle>
        <CardDescription>
          Update the details for {employee.name}.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <h3 className="font-headline text-lg font-semibold">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      <Input
                        placeholder="e.g. jane.doe@example.com"
                        {...field}
                      />
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
                    <Input
                      placeholder="e.g. Senior Software Engineer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. San Francisco, CA"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
            <h3 className="font-headline text-lg font-semibold">
              Professional Details
            </h3>
            <FormField
              control={form.control}
              name="professionalSummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of professional experience, career objectives, and highlights."
                      {...field}
                      value={field.value || ''}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="compensationSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Salary (USD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="e.g. 120000"
                          {...field}
                          value={field.value || ''}
                          className="pl-8"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="compensationBillingRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Rate (USD/hr)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="e.g. 150"
                          {...field}
                          value={field.value || ''}
                          className="pl-8"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            <div className="space-y-4">
              <h3 className="font-headline text-lg font-semibold">
                Manage Skills
              </h3>
              <div>
                <FormLabel>Current Skills</FormLabel>
                <div className="flex min-h-[80px] flex-wrap gap-2 rounded-md border p-4">
                  {finalSkills.map((skill) => (
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
                  {finalSkills.length === 0 && (
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
                Manage Documents
              </h3>
              <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                  The ability to upload and manage documents is coming soon.
                  This section will allow you to add resumes, certifications,
                  and other files.
                </p>
                <Button type="button" disabled>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload Documents
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/employees/${employee.id}`}>
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
                    Delete Employee
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the employee profile for {employee.name}.
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

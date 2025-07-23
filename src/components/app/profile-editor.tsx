'use client';

import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  X,
  Trash2,
  BadgePlus,
  Save,
  ArrowLeft,
  DollarSign,
  FileUp,
  Award,
  Briefcase,
  Download,
  File,
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
import { updateResource, deleteResource } from '@/services/resources.services';
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
import type { Resource, ResourceDocument, Skill } from '@/types/resource';
import { Textarea } from '../ui/textarea';
import { uploadFile } from '@/lib/firebase/storage';
import { Timestamp } from 'firebase/firestore';

const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  designation: z.string().min(2, 'Title must be at least 2 characters long.'),
  availabilityStatus: z.enum([
    'Available',
    'Partially Available',
    'Unavailable',
    'On Leave',
  ]),
  workMode: z.enum(['Remote', 'Hybrid', 'On-site']),
  workLocation: z.string().optional(),
  billingRate: z.coerce.number().optional(),
  totalExperienceYears: z.coerce.number().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileEditor({ resource }: { resource: Resource }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [technicalSkills, setTechnicalSkills] = useState<Skill[]>(
    resource.technicalSkills || []
  );
  const [newSkill, setNewSkill] = useState('');
  // Certifications and Industries will be handled in a future step
  const [documents, setDocuments] = useState<ResourceDocument[]>(
    resource.documents || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resourceName = `${resource.firstName} ${resource.lastName}`;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: resource.firstName,
      lastName: resource.lastName,
      email: resource.email,
      designation: resource.designation,
      availabilityStatus: resource.availabilityStatus,
      workMode: resource.workMode,
      workLocation: resource.workLocation || '',
      billingRate: resource.billingRate,
      totalExperienceYears: resource.totalExperienceYears,
    },
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsSaving(true);
    try {
      const result = await updateResource(resource.id, {
        ...data,
        technicalSkills,
        documents,
      });
      if (!result) {
        throw new Error('Failed to update profile.');
      }

      toast({
        title: 'Profile Updated',
        description: `The profile for ${resourceName} has been successfully updated.`,
      });

      router.push(`/resources/${resource.id}`);
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
      const success = await deleteResource(resource.id);
      if (!success) {
        throw new Error('Failed to delete resource');
      }
      toast({
        title: 'Resource Deleted',
        description: `The profile for ${resourceName} has been deleted.`,
      });
      router.push('/resources');
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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadPath = `documents/${resource.companyId}/${resource.id}`;
      const downloadURL = await uploadFile(file, uploadPath);

      const newDocument: ResourceDocument = {
        name: file.name,
        url: downloadURL,
        type: file.type,
        size: file.size,
        uploadedAt: Timestamp.now(),
      };

      setDocuments((prev) => [...prev, newDocument]);
      toast({
        title: 'Document Uploaded',
        description: `${file.name} has been successfully added.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'There was a problem uploading your document.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeDocument = (urlToRemove: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.url !== urlToRemove));
  };

  const addSkill = (skillName: string) => {
    const trimmedValue = skillName.trim();
    if (trimmedValue && !technicalSkills.some((s) => s.name === trimmedValue)) {
      setTechnicalSkills((prev) => [
        ...prev,
        { name: trimmedValue, level: 'Intermediate' }, // Default level
      ]);
    }
  };

  const removeSkill = (skillName: string) => {
    setTechnicalSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Edit Resource Profile
        </CardTitle>
        <CardDescription>
          Update the details for {resourceName}.
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
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jane" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation (Title)</FormLabel>
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
              name="workLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Location</FormLabel>
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
                name="availabilityStatus"
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
                        <SelectItem value="Partially Available">
                          Partially Available
                        </SelectItem>
                        <SelectItem value="Unavailable">Unavailable</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="totalExperienceYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 5"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billingRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard Billing Rate (USD/hr)</FormLabel>
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
                  {technicalSkills.map((skill) => (
                    <Badge
                      key={skill.name}
                      variant="default"
                      className="flex items-center gap-2 border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/20"
                    >
                      {skill.name}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.name)}
                        className="rounded-full p-0.5 hover:bg-black/10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {technicalSkills.length === 0 && (
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
                        addSkill(newSkill);
                        setNewSkill('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      addSkill(newSkill);
                      setNewSkill('');
                    }}
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
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.url}
                    className="flex items-center justify-between rounded-md border p-2 pl-4"
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(doc.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDocument(doc.url)}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                  Upload resumes, certifications, and other files.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileUp className="mr-2 h-4 w-4" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/resources/${resource.id}`}>
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
                    Delete Resource
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the resource profile for {resourceName}.
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

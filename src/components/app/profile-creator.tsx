'use client';

import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  User,
  X,
  BadgePlus,
  ArrowLeft,
  Upload,
  Sparkles,
  Lightbulb,
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
import { createEmployee, analyzeResume } from '@/app/actions';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAuth } from '@/contexts/auth-context';
import { updateUserProfile } from '@/services/users.services';
import { Progress } from '../ui/progress';
import { fileToDataUri } from '@/lib/utils';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  email: z.string().email('Please enter a valid email address.'),
  title: z.string().min(2, 'Title must be at least 2 characters long.'),
  availability: z.enum(['Available', 'On Project']),
  workMode: z.enum(['Remote', 'Hybrid', 'On-site']),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ProfileCreatorProps = {
  isOnboarding?: boolean;
};

type ResumeAnalysisResult = {
  extractedSkills: string[];
  suggestedSkills: string[];
};

const steps = [
  {
    id: 1,
    name: 'Basic Information',
    fields: ['name', 'email', 'title', 'availability', 'workMode'],
  },
  { id: 2, name: 'Skills' },
];

export default function ProfileCreator({
  isOnboarding = false,
}: ProfileCreatorProps) {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [analysisResult, setAnalysisResult] =
    useState<ResumeAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      title: user?.role || '',
      availability: 'Available',
      workMode: 'Remote',
    },
  });

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleAddNewSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const dataUri = await fileToDataUri(file);
      const result = await analyzeResume(dataUri);

      if (result.error) {
        throw new Error(result.error);
      }

      setAnalysisResult(result);
      toast({
        title: 'Resume Analyzed',
        description: 'AI has extracted and suggested skills from the resume.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Analyzing Resume',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsAnalyzing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processForm: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!user?.uid) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Could not find user information. Please try again.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await createEmployee({
        ...data,
        skills,
        status: 'Approved',
        uid: user.uid,
      });

      if (result.error || !result.employee) {
        throw new Error(result.error || 'Failed to create employee profile.');
      }

      // Safe to access result.employee now
      const createdEmployee = result.employee;

      if (isOnboarding) {
        await updateUserProfile(user.uid, {
          onboardingCompleted: true,
          employeeId: createdEmployee?.employee?.id,
        });
        await refreshUser();
      }

      toast({
        title: 'Profile Created',
        description: `A new profile for ${createdEmployee?.employee?.name} has been successfully created.`,
      });

      router.push(isOnboarding ? '/dashboard' : '/employees');
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Saving Profile',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  type FieldName = keyof ProfileFormValues;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    } else {
      await form.handleSubmit(processForm)();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <Card className="mx-auto max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {isOnboarding
            ? "Welcome! Let's set up your profile."
            : 'Create Employee Profile'}
        </CardTitle>
        <CardDescription>
          {isOnboarding
            ? 'Please fill in your professional details to get started.'
            : 'Manually enter the details for a new employee.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isOnboarding && (
          <div className="mb-8 space-y-2">
            <Progress value={((currentStep + 1) / steps.length) * 100} />
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}:{' '}
              {steps[currentStep].name}
            </p>
          </div>
        )}

        <Form {...form}>
          <form>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Jane Doe"
                                {...field}
                                disabled={isOnboarding}
                              />
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
                                disabled={isOnboarding}
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
                                <SelectItem value="Available">
                                  Available
                                </SelectItem>
                                <SelectItem value="On Project">
                                  On Project
                                </SelectItem>
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
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-headline text-lg font-semibold">
                        Skills
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Add skills manually or upload a resume to let our AI do
                        the work.
                      </p>
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isAnalyzing}
                          className="w-full"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="mr-2 h-4 w-4" />
                          )}
                          {isAnalyzing
                            ? 'Analyzing Resume...'
                            : 'Upload Resume for AI Analysis'}
                        </Button>
                      </CardContent>
                    </Card>

                    {analysisResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 rounded-lg border bg-muted/30 p-4"
                      >
                        <h4 className="flex items-center font-semibold">
                          <Sparkles className="mr-2 h-5 w-5 text-primary" /> AI
                          Skill Suggestions
                        </h4>
                        <div>
                          <p className="mb-2 flex items-center text-sm font-medium">
                            <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                            Extracted from Resume
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.extractedSkills.map((skill) => (
                              <Button
                                key={skill}
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => addSkill(skill)}
                                className="bg-background"
                              >
                                {skill}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 flex items-center text-sm font-medium">
                            <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                            Suggested by AI
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.suggestedSkills.map((skill) => (
                              <Button
                                key={skill}
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => addSkill(skill)}
                                className="bg-background"
                              >
                                {skill}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <Separator />

                    <div>
                      <FormLabel>Current Skills</FormLabel>
                      <div className="flex min-h-[80px] flex-wrap gap-2 rounded-md border p-4">
                        {skills.map((skill) => (
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
                        {skills.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            Upload a resume or add skills manually below.
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <FormLabel>Add Custom Skill</FormLabel>
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
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={prev}
          disabled={currentStep === 0 || isSaving}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
        <Button type="button" onClick={next} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : currentStep === steps.length - 1 ? (
            <>
              <User className="mr-2 h-4 w-4" />
              Save Profile
            </>
          ) : (
            'Next Step'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

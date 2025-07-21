"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Upload, User, X, BadgePlus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { fileToDataUri } from '@/lib/utils';
import { analyzeResume, createEmployee } from '@/app/actions';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { AnimatePresence, motion } from "framer-motion"


const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  email: z.string().email('Please enter a valid email address.'),
  resume: z.custom<FileList>().refine(files => files?.length > 0, 'A resume file is required.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type AnalysisResult = {
  extractedSkills: string[];
  suggestedSkills: string[];
};

export default function ProfileCreator() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [finalSkills, setFinalSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [fileName, setFileName] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setFinalSkills([]);

    try {
      const file = data.resume[0];
      const resumeDataUri = await fileToDataUri(file);
      const result = await analyzeResume(resumeDataUri);

      if (result.error) {
        throw new Error(result.error);
      }

      setAnalysisResult(result);
      setFinalSkills(result.extractedSkills);

      toast({
        title: 'Analysis Complete',
        description: 'We have analyzed the resume. Please review the skills below.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !finalSkills.includes(skill)) {
      setFinalSkills(prev => [...prev, skill]);
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

  const resetFlow = () => {
    form.reset();
    setAnalysisResult(null);
    setFinalSkills([]);
    setIsLoading(false);
    setIsSaving(false);
    setFileName('');
  }

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
        const { name, email } = form.getValues();
        const result = await createEmployee({ 
            name, 
            email, 
            skills: finalSkills,
            title: "New Hire",
            availability: 'Available',
            workMode: 'Remote',
        });

        if (result.error) {
            throw new Error(result.error);
        }

        toast({
            title: 'Profile Created',
            description: `A new profile for ${result.employee?.name} has been successfully created.`,
        });

        router.push('/employees');

    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Error Saving Profile',
            description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Employee Profile</CardTitle>
        <CardDescription>Start by uploading a resume. Our AI will help populate the skills.</CardDescription>
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
                      <Input placeholder="e.g. Jane Doe" {...field} disabled={!!analysisResult} />
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
                      <Input placeholder="e.g. jane.doe@example.com" {...field} disabled={!!analysisResult} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="resume"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Resume</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById('resume-upload')?.click()} disabled={!!analysisResult}>
                        <Upload className="mr-2 h-4 w-4"/>
                        {fileName || 'Upload Resume'}
                       </Button>
                      <Input
                        id="resume-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        {...rest}
                        onChange={(e) => {
                          onChange(e.target.files);
                          if(e.target.files && e.target.files.length > 0){
                            setFileName(e.target.files[0].name);
                          }
                        }}
                        disabled={!!analysisResult}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            {!analysisResult && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <User className="mr-2 h-4 w-4" />}
                Analyze and Create Profile
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
      
      <AnimatePresence>
      {analysisResult && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
          <Separator className="my-6" />
          <CardContent className="space-y-6">
              <h3 className="text-lg font-headline font-semibold">Review Your Skills</h3>
              
              <div>
                <h4 className="font-semibold mb-2">Extracted Skills</h4>
                <div className="p-4 border rounded-md min-h-[80px] flex flex-wrap gap-2">
                  {finalSkills.map(skill => (
                    <Badge key={skill} variant="default" className="text-sm py-1 px-3 flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="rounded-full hover:bg-black/10 p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                   {finalSkills.length === 0 && <p className="text-sm text-muted-foreground">No skills extracted. You can add them manually.</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-muted-foreground">Suggested Skills</h4>
                <p className="text-sm text-muted-foreground mb-2">Click to add AI-powered suggestions to your profile.</p>
                <div className="p-4 border rounded-md min-h-[80px] flex flex-wrap gap-2 bg-muted/50">
                   {analysisResult.suggestedSkills.filter(s => !finalSkills.includes(s)).map(skill => (
                    <Badge key={skill} variant="outline" className="text-sm py-1 px-3 cursor-pointer hover:bg-accent hover:text-accent-foreground" onClick={() => addSkill(skill)}>
                      <Plus className="mr-2 h-3 w-3"/>
                      {skill}
                    </Badge>
                  ))}
                  {analysisResult.suggestedSkills.filter(s => !finalSkills.includes(s)).length === 0 && <p className="text-sm text-muted-foreground">No new suggestions.</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-muted-foreground">Add Custom Skill</h4>
                 <div className="flex gap-2">
                    <Input 
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="e.g. Public Speaking"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNewSkill()}
                    />
                    <Button type="button" variant="outline" onClick={handleAddNewSkill}>
                      <BadgePlus className="mr-2 h-4 w-4"/>
                      Add Skill
                    </Button>
                  </div>
              </div>
          </CardContent>
           <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={resetFlow} disabled={isSaving}>
                <Trash2 className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                 {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <User className="mr-2 h-4 w-4" />}
                Save Profile
              </Button>
           </CardFooter>
        </motion.div>
      )}
      </AnimatePresence>
    </Card>
  );
}

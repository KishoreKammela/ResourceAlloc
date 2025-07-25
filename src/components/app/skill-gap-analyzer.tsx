'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { handleSkillGapAnalysis } from '@/app/actions';
import type { SkillGapAnalysisOutput } from '@/ai/flows/skill-gap-analysis';
import { useToast } from '@/hooks/use-toast';
import {
  BrainCircuit,
  Loader2,
  Lightbulb,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Separator } from '../ui/separator';

type SkillGapAnalyzerProps = {
  requiredSkills: string[];
  availableSkills: string[];
};

export default function SkillGapAnalyzer({
  requiredSkills,
  availableSkills,
}: SkillGapAnalyzerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SkillGapAnalysisOutput | null>(null);
  const { toast } = useToast();

  const handleAnalyzeClick = async () => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await handleSkillGapAnalysis(
        requiredSkills,
        availableSkills
      );
      if (result.error) {
        throw new Error(result.error);
      }
      setAnalysisResult(result.analysis);
      toast({
        title: 'Analysis Complete',
        description: 'The skill gap analysis has been successfully performed.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Performing Analysis',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Current Skill Landscape</CardTitle>
          <CardDescription>
            An overview of skills required by projects versus skills available
            in your team.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold">
              Required Skills ({requiredSkills.length})
            </h3>
            <div className="flex min-h-[120px] flex-wrap gap-2 rounded-md border p-4">
              {requiredSkills.length > 0 ? (
                requiredSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-base">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No required skills found in current projects.
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">
              Available Skills ({availableSkills.length})
            </h3>
            <div className="flex min-h-[120px] flex-wrap gap-2 rounded-md border p-4">
              {availableSkills.length > 0 ? (
                availableSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-base">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No skills found in employee profiles.
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleAnalyzeClick}
            disabled={isLoading || requiredSkills.length === 0}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Analyzing...' : 'Perform AI Gap Analysis'}
          </Button>
        </CardFooter>
      </Card>

      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator />
                <div>
                  <h3 className="mb-2 flex items-center text-lg font-semibold">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" /> AI
                    Summary
                  </h3>
                  <p className="italic text-muted-foreground">
                    &quot;{analysisResult.analysisSummary}&quot;
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 flex items-center text-lg font-semibold">
                      <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />{' '}
                      Missing Skills
                    </h3>
                    <div className="flex min-h-[80px] flex-wrap gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-4">
                      {analysisResult.missingSkills.length > 0 ? (
                        analysisResult.missingSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="destructive"
                            className="text-base"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="mr-2 h-5 w-5" />
                          <p className="font-medium">
                            No skill gaps found. All required skills are
                            covered!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center text-lg font-semibold">
                      <GraduationCap className="mr-2 h-5 w-5 text-accent" />{' '}
                      Training Suggestions
                    </h3>
                    <div className="space-y-4">
                      {analysisResult.trainingSuggestions.length > 0 ? (
                        analysisResult.trainingSuggestions.map((item) => (
                          <div
                            key={item.skill}
                            className="rounded-r-md border-l-4 border-accent bg-accent/10 p-3"
                          >
                            <p className="font-semibold">{item.skill}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.suggestion}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center text-muted-foreground">
                          <CheckCircle className="mr-2 h-5 w-5" />
                          <p>No specific training suggestions at this time.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

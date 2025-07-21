'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing skill gaps between project requirements and available employee skills.
 *
 * - performSkillGapAnalysis - A function that takes required and available skills and returns an analysis.
 * - SkillGapAnalysisInput - The input type for the performSkillGapAnalysis function.
 * - SkillGapAnalysisOutput - The return type for the performSkillGapAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SkillGapAnalysisInputSchema = z.object({
  requiredSkills: z
    .array(z.string())
    .describe('A list of skills required by all projects.'),
  availableSkills: z
    .array(z.string())
    .describe('A list of skills available from all employees.'),
});
export type SkillGapAnalysisInput = z.infer<typeof SkillGapAnalysisInputSchema>;

const SkillGapAnalysisOutputSchema = z.object({
  missingSkills: z
    .array(z.string())
    .describe(
      'A list of skills that are required by projects but are not available in the employee pool.'
    ),
  analysisSummary: z
    .string()
    .describe(
      'A brief, insightful summary of the overall skill landscape, including strengths and key weaknesses.'
    ),
  trainingSuggestions: z
    .array(
      z.object({
        skill: z
          .string()
          .describe('The skill that training is being suggested for.'),
        suggestion: z
          .string()
          .describe(
            'A brief, actionable training suggestion to help bridge this specific skill gap.'
          ),
      })
    )
    .describe(
      'A list of targeted training suggestions to address the identified skill gaps.'
    ),
});
export type SkillGapAnalysisOutput = z.infer<
  typeof SkillGapAnalysisOutputSchema
>;

export async function performSkillGapAnalysis(
  input: SkillGapAnalysisInput
): Promise<SkillGapAnalysisOutput> {
  return skillGapAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillGapAnalysisPrompt',
  input: { schema: SkillGapAnalysisInputSchema },
  output: { schema: SkillGapAnalysisOutputSchema },
  prompt: `You are an expert HR strategist and talent development consultant.

Your task is to analyze the gap between the skills required for our company's projects and the skills currently available in our employee pool.

Based on the provided lists, identify the skills that are missing. 
Provide a concise, high-level summary of our situation.
Then, for each significant skill gap, provide a concrete, actionable training suggestion. For example, instead of "Train in React," suggest "Develop a workshop on Advanced React Hooks and State Management."

Required Skills: {{#each requiredSkills}} {{this}} {{/each}}
Available Skills: {{#each availableSkills}} {{this}} {{/each}}`,
});

const skillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'skillGapAnalysisFlow',
    inputSchema: SkillGapAnalysisInputSchema,
    outputSchema: SkillGapAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

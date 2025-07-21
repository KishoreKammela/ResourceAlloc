'use server';
/**
 * @fileOverview An AI agent for extracting skills from a resume.
 *
 * - extractSkillsFromResume - A function that extracts skills from a resume.
 * - ExtractSkillsFromResumeInput - The input type for the extractSkillsFromResume function.
 * - ExtractSkillsFromResumeOutput - The return type for the extractSkillsFromResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSkillsFromResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractSkillsFromResumeInput = z.infer<
  typeof ExtractSkillsFromResumeInputSchema
>;

const ExtractSkillsFromResumeOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('The skills extracted from the resume.'),
});
export type ExtractSkillsFromResumeOutput = z.infer<
  typeof ExtractSkillsFromResumeOutputSchema
>;

export async function extractSkillsFromResume(
  input: ExtractSkillsFromResumeInput
): Promise<ExtractSkillsFromResumeOutput> {
  return extractSkillsFromResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSkillsFromResumePrompt',
  input: {schema: ExtractSkillsFromResumeInputSchema},
  output: {schema: ExtractSkillsFromResumeOutputSchema},
  prompt: `You are an expert HR assistant specializing in extracting skills from resumes.

  Extract all the skills from the resume.

  Resume: {{media url=resumeDataUri}}`,
});

const extractSkillsFromResumeFlow = ai.defineFlow(
  {
    name: 'extractSkillsFromResumeFlow',
    inputSchema: ExtractSkillsFromResumeInputSchema,
    outputSchema: ExtractSkillsFromResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

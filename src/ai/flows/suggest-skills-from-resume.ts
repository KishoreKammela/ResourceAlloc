'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest inferred skills, competencies, and domain expertise from a resume.
 *
 * - suggestSkillsFromResume - A function that takes a resume as input and returns suggested skills.
 * - SuggestSkillsFromResumeInput - The input type for the suggestSkillsFromResume function.
 * - SuggestSkillsFromResumeOutput - The return type for the suggestSkillsFromResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSkillsFromResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestSkillsFromResumeInput = z.infer<typeof SuggestSkillsFromResumeInputSchema>;

const SuggestSkillsFromResumeOutputSchema = z.object({
  suggestedSkills: z
    .array(z.string())
    .describe('An array of suggested skills, competencies, and domain expertise extracted from the resume.'),
});
export type SuggestSkillsFromResumeOutput = z.infer<typeof SuggestSkillsFromResumeOutputSchema>;

export async function suggestSkillsFromResume(input: SuggestSkillsFromResumeInput): Promise<SuggestSkillsFromResumeOutput> {
  return suggestSkillsFromResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillsFromResumePrompt',
  input: {schema: SuggestSkillsFromResumeInputSchema},
  output: {schema: SuggestSkillsFromResumeOutputSchema},
  prompt: `You are an expert HR assistant specializing in extracting skills from resumes.

You will use this information to identify skills, competencies, and domain expertise mentioned or implied in the resume.

Return a list of skills that would be appropriate to add to the employee's profile.

Resume: {{media url=resumeDataUri}}`,
});

const suggestSkillsFromResumeFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFromResumeFlow',
    inputSchema: SuggestSkillsFromResumeInputSchema,
    outputSchema: SuggestSkillsFromResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

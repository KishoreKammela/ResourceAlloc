'use server';

/**
 * @fileOverview A Genkit flow for suggesting candidates for a project based on required skills.
 *
 * - suggestCandidates - A function that suggests candidates.
 * - SuggestCandidatesInput - The input type for the suggestCandidates function.
 * - SuggestCandidatesOutput - The return type for the suggestCandidates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getEmployees } from '@/services/employees.services';
import type { Employee } from '@/types/employee';

const SuggestCandidatesInputSchema = z.object({
  requiredSkills: z
    .array(z.string())
    .describe('A list of skills required for the project.'),
  companyId: z
    .string()
    .describe('The ID of the company to search for employees within.'),
});
export type SuggestCandidatesInput = z.infer<
  typeof SuggestCandidatesInputSchema
>;

const CandidateSchema = z.object({
  employeeId: z.string().describe('The unique ID of the employee.'),
  name: z.string().describe('The full name of the employee.'),
  title: z.string().describe("The employee's job title."),
  justification: z
    .string()
    .describe(
      'A brief justification for why this employee is a good fit for the project, based on their skills and role in the team.'
    ),
  matchingSkills: z
    .array(z.string())
    .describe(
      "A list of the employee's skills that match the project's requirements."
    ),
});

const SuggestCandidatesOutputSchema = z.object({
  candidates: z
    .array(CandidateSchema)
    .describe('A list of suitable candidates for the project.'),
});
export type SuggestCandidatesOutput = z.infer<
  typeof SuggestCandidatesOutputSchema
>;

// Tool to get all available employees
const getAllEmployeesTool = ai.defineTool(
  {
    name: 'getAllEmployees',
    description: 'Get a list of all employees and their skills for a company.',
    inputSchema: z.object({ companyId: z.string() }),
    outputSchema: z.array(z.custom<Employee>()),
  },
  async ({ companyId }) => {
    return await getEmployees(companyId);
  }
);

export async function suggestCandidates(
  input: SuggestCandidatesInput
): Promise<SuggestCandidatesOutput> {
  return suggestCandidatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCandidatesPrompt',
  input: { schema: SuggestCandidatesInputSchema },
  output: { schema: SuggestCandidatesOutputSchema },
  tools: [getAllEmployeesTool],
  prompt: `You are an expert HR strategist specializing in building effective project teams.
  
  A new project has the following skill requirements: {{#each requiredSkills}} {{this}} {{/each}}.

  Your task is to assemble a balanced and effective team from the company's list of employees. Use the provided tool to get the list of all employees for company ID: {{companyId}}.

  Analyze the list and suggest a team of up to 5 members. Your suggestions should not just be based on individual skill matches, but also on creating a well-rounded team. Consider a good mix of roles (e.g., senior and junior developers, designers, etc.) based on their titles.

  For each suggested candidate, provide their employeeId, name, title, a brief justification explaining their fit within the team structure, and list their skills that match the project requirements.`,
});

const suggestCandidatesFlow = ai.defineFlow(
  {
    name: 'suggestCandidatesFlow',
    inputSchema: SuggestCandidatesInputSchema,
    outputSchema: SuggestCandidatesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

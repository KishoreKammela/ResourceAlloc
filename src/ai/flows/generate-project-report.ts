'use server';

/**
 * @fileOverview A Genkit flow for generating an AI-powered project status report.
 *
 * - generateProjectReport - A function that generates the report.
 * - GenerateProjectReportInput - The input type for the function.
 * - GenerateProjectReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getProjectById } from '@/services/projects.services';
import type { Project } from '@/types/project';

const GenerateProjectReportInputSchema = z.object({
  projectId: z.string().describe('The ID of the project to generate a report for.'),
});
export type GenerateProjectReportInput = z.infer<typeof GenerateProjectReportInputSchema>;

const GenerateProjectReportOutputSchema = z.object({
  summary: z.string().describe("A high-level summary of the project's current status, progress, and outlook."),
  achievements: z.array(z.string()).describe("A list of key achievements or milestones that have been recently met."),
  risks: z.array(z.string()).describe("A list of potential risks, blockers, or concerns that may impact the project's timeline or success."),
});
export type GenerateProjectReportOutput = z.infer<typeof GenerateProjectReportOutputSchema>;

// Tool to get project details
const getProjectByIdTool = ai.defineTool(
    {
        name: 'getProjectById',
        description: 'Get the full details of a project by its ID, including assigned team members.',
        inputSchema: z.object({ id: z.string() }),
        outputSchema: z.custom<Project>(),
    },
    async ({ id }) => {
        const project = await getProjectById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        return project;
    }
);

export async function generateProjectReport(input: GenerateProjectReportInput): Promise<GenerateProjectReportOutput> {
  return generateProjectReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectReportPrompt',
  input: {schema: GenerateProjectReportInputSchema},
  output: {schema: GenerateProjectReportOutputSchema},
  tools: [getProjectByIdTool],
  prompt: `You are an expert Project Manager. Your task is to generate a concise and insightful status report for a project.
  
  First, use the provided tool to get the complete details for the project with ID: {{projectId}}.

  Then, based on the project's status, description, timeline, and assigned team, generate a report covering the following areas:
  - summary: A brief overview of the project's health. Is it on track? What's the general sentiment?
  - achievements: List a few key accomplishments. This could be based on the project's current status (e.g., if 'In Progress', mention the work being done).
  - risks: Analyze the project description and timeline to identify potential risks. For example, a tight timeline or complex requirements could be a risk.
  
  Your tone should be professional, clear, and objective.`,
});

const generateProjectReportFlow = ai.defineFlow(
  {
    name: 'generateProjectReportFlow',
    inputSchema: GenerateProjectReportInputSchema,
    outputSchema: GenerateProjectReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

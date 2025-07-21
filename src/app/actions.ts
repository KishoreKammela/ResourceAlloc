
'use server';

import { extractSkillsFromResume } from '@/ai/flows/extract-skills-from-resume';
import { suggestSkillsFromResume } from '@/ai/flows/suggest-skills-from-resume';
import { suggestCandidates, type SuggestCandidatesOutput } from '@/ai/flows/suggest-candidates';
import { performSkillGapAnalysis, type SkillGapAnalysisOutput } from '@/ai/flows/skill-gap-analysis';
import { generateProjectReport as genkitGenerateProjectReport, type GenerateProjectReportInput, type GenerateProjectReportOutput } from '@/ai/flows/generate-project-report';

import { addEmployee, updateEmployee, deleteEmployee } from '@/services/employees.services';
import { addProject, updateProject, deleteProject } from '@/services/projects.services';

import type { Employee, UpdatableEmployeeData } from '@/types/employee';
import type { Project, UpdatableProjectData } from '@/types/project';


// Employee Actions
export async function analyzeResume(resumeDataUri: string) {
  try {
    // We run them in parallel to speed up the process
    const [extractedResult, suggestedResult] = await Promise.all([
      extractSkillsFromResume({ resumeDataUri }),
      suggestSkillsFromResume({ resumeDataUri }),
    ]);

    return {
      extractedSkills: extractedResult.skills || [],
      suggestedSkills: suggestedResult.suggestedSkills || [],
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      extractedSkills: [],
      suggestedSkills: [],
      error: `Failed to analyze resume: ${error}`,
    };
  }
}

export async function createEmployee(employeeData: Omit<Employee, 'id'>) {
    try {
        const newEmployee = await addEmployee(employeeData);
        return {
            employee: newEmployee,
            error: null
        }
    } catch(e: any) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            employee: null,
            error: `Failed to create employee: ${error}`
        }
    }
}

export async function handleUpdateEmployee(employeeId: string, employeeData: UpdatableEmployeeData) {
    try {
        const updated = await updateEmployee(employeeId, employeeData);
        if (!updated) {
            throw new Error('Employee not found');
        }
        return {
            employee: updated,
            error: null
        }
    } catch(e: any) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            employee: null,
            error: `Failed to update employee: ${error}`
        }
    }
}

export async function handleDeleteEmployee(employeeId: string) {
    try {
        const success = await deleteEmployee(employeeId);
        if (!success) {
            throw new Error('Employee not found or could not be deleted.');
        }
        return {
            success: true,
            error: null
        }
    } catch(e: any) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            success: false,
            error: `Failed to delete employee: ${error}`
        }
    }
}

// Project Actions
export async function createProject(projectData: Omit<Project, 'id'>) {
    try {
        const newProject = await addProject(projectData);
        return {
            project: newProject,
            error: null
        }
    } catch(e: any) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            project: null,
            error: `Failed to create project: ${error}`
        }
    }
}

export async function handleUpdateProject(projectId: string, projectData: UpdatableProjectData) {
    try {
        const updated = await updateProject(projectId, projectData);
        if (!updated) {
            throw new Error('Project not found');
        }
        return {
            project: updated,
            error: null
        }
    } catch(e: any) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            project: null,
            error: `Failed to update project: ${error}`
        }
    }
}

export async function handleDeleteProject(projectId: string) {
    try {
        const success = await deleteProject(projectId);
        if (!success) {
            throw new Error('Project not found or could not be deleted.');
        }
        return {
            success: true,
            error: null
        }
    } catch(e: any) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            success: false,
            error: `Failed to delete project: ${error}`
        }
    }
}

// AI-powered actions
export async function findCandidates(requiredSkills: string[]): Promise<{ candidates: SuggestCandidatesOutput['candidates'], error: string | null }> {
    try {
        const result = await suggestCandidates({ requiredSkills });
        return {
            candidates: result.candidates,
            error: null,
        }
    } catch (e: any) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            candidates: [],
            error: `Failed to find candidates: ${error}`
        }
    }
}

export async function handleSkillGapAnalysis(requiredSkills: string[], availableSkills: string[]): Promise<{ analysis: SkillGapAnalysisOutput | null, error: string | null }> {
    try {
        const result = await performSkillGapAnalysis({ requiredSkills, availableSkills });
        return {
            analysis: result,
            error: null,
        }
    } catch(e: any) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            analysis: null,
            error: `Failed to perform analysis: ${error}`
        }
    }
}


export async function generateProjectReport(input: GenerateProjectReportInput): Promise<{ report: GenerateProjectReportOutput | null; error: string | null; }> {
    try {
        const report = await genkitGenerateProjectReport(input);
        return { report, error: null };
    } catch (e: any) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            report: null,
            error: `Failed to generate report: ${error}`,
        };
    }
}

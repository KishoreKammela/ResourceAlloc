'use server';

import { extractSkillsFromResume } from '@/ai/flows/extract-skills-from-resume';
import { suggestSkillsFromResume } from '@/ai/flows/suggest-skills-from-resume';
import { suggestCandidates } from '@/ai/flows/suggest-candidates';
import { addEmployee, type Employee } from './services/employees';
import { addProject, type Project } from './services/projects';

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

export async function findCandidates(requiredSkills: string[]) {
    try {
        const result = await suggestCandidates({ requiredSkills });
        return {
            candidates: result.candidates || [],
            error: null
        }
    } catch(e: any) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            candidates: [],
            error: `Failed to find candidates: ${error}`
        }
    }
}

export async function createEmployee(employeeData: Omit<Employee, 'id' | 'availability' | 'workMode' | 'title'>) {
    try {
        const newEmployee = addEmployee(employeeData);
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

export async function createProject(projectData: Omit<Project, 'id' | 'status' | 'timeline' | 'description'>) {
    try {
        const newProject = addProject(projectData);
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

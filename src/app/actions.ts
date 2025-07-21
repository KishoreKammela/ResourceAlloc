
'use server';

import { extractSkillsFromResume } from '@/ai/flows/extract-skills-from-resume';
import { suggestSkillsFromResume } from '@/ai/flows/suggest-skills-from-resume';
import { suggestCandidates } from '@/ai/flows/suggest-candidates';
import { performSkillGapAnalysis } from '@/ai/flows/skill-gap-analysis';
import { addEmployee, updateEmployee, deleteEmployee } from '@/services/employees.services';
import { addProject, updateProject, deleteProject } from '@/services/projects.services';
import type { Employee, UpdatableEmployeeData } from '@/types/employee';
import type { Project, UpdatableProjectData } from '@/types/project';

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

export async function handleSkillGapAnalysis(requiredSkills: string[], availableSkills: string[]) {
    try {
        const result = await performSkillGapAnalysis({ requiredSkills, availableSkills });
        return {
            analysis: result,
            error: null,
        };
    } catch (e: any) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            analysis: null,
            error: `Failed to perform skill gap analysis: ${error}`,
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

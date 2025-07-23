import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Resource } from '@/types/resource';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URI'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

export function calculateProfileCompletion(resource: Resource): number {
  let score = 0;
  const totalPoints = 8; // Increased total points

  if (resource.professionalSummary) score++;
  if (resource.skills && resource.skills.length > 0) score++;
  if (resource.location) score++;
  if (resource.compensation?.salary) score++;
  if (resource.compensation?.billingRate) score++;
  if (
    resource.yearsOfExperience !== undefined &&
    resource.yearsOfExperience > 0
  )
    score++;
  if (resource.certifications && resource.certifications.length > 0) score++;
  if (resource.industryExperience && resource.industryExperience.length > 0)
    score++;

  return Math.round((score / totalPoints) * 100);
}

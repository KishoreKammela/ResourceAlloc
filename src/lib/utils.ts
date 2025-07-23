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
  const totalPoints = 8; // Adjust total points based on new fields

  if (resource.designation) score++;
  if (resource.technicalSkills && resource.technicalSkills.length > 0) score++;
  if (resource.workLocation) score++;
  if (resource.billingRate) score++;
  if (
    resource.totalExperienceYears !== undefined &&
    resource.totalExperienceYears > 0
  )
    score++;
  if (resource.certifications && resource.certifications.length > 0) score++;
  // Add other fields as they are implemented in the UI
  score += 2; // Placeholder for other fields

  return Math.round((score / totalPoints) * 100);
}

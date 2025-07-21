import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Employee } from '@/types/employee';

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

export function calculateProfileCompletion(employee: Employee): number {
  let score = 0;
  const totalPoints = 5;

  if (employee.professionalSummary) score++;
  if (employee.skills && employee.skills.length > 0) score++;
  if (employee.location) score++;
  if (employee.compensation?.salary) score++;
  if (employee.compensation?.billingRate) score++;

  return Math.round((score / totalPoints) * 100);
}

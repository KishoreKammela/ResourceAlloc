import { config } from 'dotenv';
config();

import '@/ai/flows/extract-skills-from-resume.ts';
import '@/ai/flows/suggest-skills-from-resume.ts';
import '@/ai/flows/suggest-candidates.ts';
import '@/ai/flows/skill-gap-analysis.ts';
import '@/ai/flows/generate-project-report.ts';

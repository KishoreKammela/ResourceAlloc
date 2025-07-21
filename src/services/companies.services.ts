import { db } from '@/lib/firebase/config';
import type { Company } from '@/types/company';
import { collection, addDoc } from 'firebase/firestore';

const companiesCollection = collection(db, 'companies');

export async function addCompany(
  companyData: Omit<Company, 'id'>
): Promise<Company> {
  const docRef = await addDoc(companiesCollection, companyData);
  return { id: docRef.id, ...companyData };
}

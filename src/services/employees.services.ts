import { db } from '@/lib/firebase/config';
import type { Employee, UpdatableEmployeeData } from '@/types/employee';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';

const employeesCollection = collection(db, 'employees');

export async function getEmployees(): Promise<Employee[]> {
  try {
    const snapshot = await getDocs(employeesCollection);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Employee
    );
  } catch (error) {
    console.error('Error fetching employees: ', error);
    return [];
  }
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    const docRef = doc(db, 'employees', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Employee;
    }
    return null;
  } catch (error) {
    console.error('Error fetching employee by ID: ', error);
    return null;
  }
}

export async function addEmployee(
  employeeData: Omit<Employee, 'id'>
): Promise<{ employee: Employee | null; error: string | null }> {
  try {
    // Check if an employee record already exists for this UID
    if (employeeData.uid) {
      const q = query(
        employeesCollection,
        where('uid', '==', employeeData.uid),
        limit(1)
      );
      const existing = await getDocs(q);
      if (!existing.empty) {
        // This should ideally not happen in the onboarding flow, but is a safeguard.
        console.warn(
          'An employee profile already exists for this user. Skipping creation.'
        );
        const existingDoc = existing.docs[0];
        return {
          employee: { id: existingDoc.id, ...existingDoc.data() } as Employee,
          error: null,
        };
      }
    }

    const newEmployeeData = {
      ...employeeData,
      status: 'Approved' as const, // Default status for new employees
    };
    const docRef = await addDoc(employeesCollection, newEmployeeData);
    return {
      employee: { id: docRef.id, ...newEmployeeData },
      error: null,
    };
  } catch (e: any) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      employee: null,
      error: `Failed to create employee record: ${error}`,
    };
  }
}

export async function updateEmployee(
  id: string,
  data: UpdatableEmployeeData
): Promise<Employee | null> {
  const docRef = doc(db, 'employees', id);
  await updateDoc(docRef, data);
  return await getEmployeeById(id);
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'employees', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error('Error deleting employee: ', e);
    return false;
  }
}

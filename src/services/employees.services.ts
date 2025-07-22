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

export async function getEmployees(companyId: string): Promise<Employee[]> {
  try {
    const q = query(employeesCollection, where('companyId', '==', companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Employee
    );
  } catch (error) {
    console.error('Error fetching employees: ', error);
    return [];
  }
}

export async function getEmployeeById(
  id: string,
  companyId: string
): Promise<Employee | null> {
  try {
    const docRef = doc(db, 'employees', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const employee = { id: docSnap.id, ...docSnap.data() } as Employee;
      // Security check: ensure the employee belongs to the correct company
      if (employee.companyId === companyId) {
        return employee;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching employee by ID: ', error);
    return null;
  }
}

export async function addEmployee(
  employeeData: Omit<Employee, 'id'>
): Promise<Employee> {
  // Ensure companyId is present
  if (!employeeData.companyId) {
    throw new Error('Company ID is required to create an employee.');
  }
  const docRef = await addDoc(employeesCollection, employeeData);
  return { id: docRef.id, ...employeeData };
}

export async function updateEmployee(
  id: string,
  data: UpdatableEmployeeData
): Promise<Employee | null> {
  const docRef = doc(db, 'employees', id);
  await updateDoc(docRef, data);
  // We don't know the companyId here, so the caller must handle re-fetching.
  const updatedDoc = await getDoc(docRef);
  return updatedDoc.exists()
    ? ({ id: updatedDoc.id, ...updatedDoc.data() } as Employee)
    : null;
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

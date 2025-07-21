
import { db } from '@/lib/firebase/config';
import type { Employee, UpdatableEmployeeData } from '@/types/employee';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const employeesCollection = collection(db, 'employees');

export async function getEmployees(): Promise<Employee[]> {
    try {
        const snapshot = await getDocs(employeesCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
    } catch (error) {
        console.error("Error fetching employees: ", error);
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
        console.error("Error fetching employee by ID: ", error);
        return null;
    }
}

export async function addEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    const docRef = await addDoc(employeesCollection, employeeData);
    return { id: docRef.id, ...employeeData };
}

export async function updateEmployee(id: string, data: UpdatableEmployeeData): Promise<Employee | null> {
    const docRef = doc(db, 'employees', id);
    await updateDoc(docRef, data);
    return await getEmployeeById(id);
}

export async function deleteEmployee(id: string): Promise<boolean> {
    try {
        const docRef = doc(db, 'employees', id);
        await deleteDoc(docRef);
        return true;
    } catch(e) {
        console.error("Error deleting employee: ", e);
        return false;
    }
}

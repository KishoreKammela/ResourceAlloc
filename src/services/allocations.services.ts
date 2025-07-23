import { db } from '@/lib/firebase/config';
import type { Allocation, UpdatableAllocationData } from '@/types/allocation';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';

const allocationsCollection = collection(db, 'allocations');

/**
 * Creates a new allocation record in Firestore.
 */
export async function createAllocation(
  allocationData: Omit<Allocation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Allocation> {
  const timestamp = serverTimestamp();
  const docRef = await addDoc(allocationsCollection, {
    ...allocationData,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return {
    id: docRef.id,
    ...allocationData,
    createdAt: Timestamp.now(), // Use client-side timestamp for immediate use
    updatedAt: Timestamp.now(),
  };
}

/**
 * Gets all allocations for a specific project.
 */
export async function getAllocationsForProject(
  projectId: string,
  companyId: string
): Promise<Allocation[]> {
  const q = query(
    allocationsCollection,
    where('companyId', '==', companyId),
    where('projectId', '==', projectId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Allocation
  );
}

/**
 * Gets all allocations for a specific resource.
 */
export async function getAllocationsForResource(
  resourceId: string,
  companyId: string
): Promise<Allocation[]> {
  const q = query(
    allocationsCollection,
    where('companyId', '==', companyId),
    where('resourceId', '==', resourceId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Allocation
  );
}

/**
 * Updates an allocation record.
 */
export async function updateAllocation(
  id: string,
  data: UpdatableAllocationData
): Promise<Allocation | null> {
  const docRef = doc(db, 'allocations', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  const updatedDoc = await getDoc(docRef);
  return updatedDoc.exists()
    ? ({ id: updatedDoc.id, ...updatedDoc.data() } as Allocation)
    : null;
}

/**
 * Deletes an allocation record.
 */
export async function deleteAllocation(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'allocations', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting allocation: ', error);
    return false;
  }
}

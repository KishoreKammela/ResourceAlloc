import { db } from '@/lib/firebase/config';
import type { Resource, UpdatableResourceData } from '@/types/resource';
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

const resourcesCollection = collection(db, 'resources');

export async function getResources(companyId: string): Promise<Resource[]> {
  try {
    const q = query(resourcesCollection, where('companyId', '==', companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Resource
    );
  } catch (error) {
    console.error('Error fetching resources: ', error);
    return [];
  }
}

export async function getResourceById(
  id: string,
  companyId: string
): Promise<Resource | null> {
  try {
    const docRef = doc(db, 'resources', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const resource = { id: docSnap.id, ...docSnap.data() } as Resource;
      // Security check: ensure the resource belongs to the correct company
      if (resource.companyId === companyId) {
        return resource;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching resource by ID: ', error);
    return null;
  }
}

export async function addResource(
  resourceData: Omit<Resource, 'id'>
): Promise<Resource> {
  // Ensure companyId is present
  if (!resourceData.companyId) {
    throw new Error('Company ID is required to create an resource.');
  }
  const docRef = await addDoc(resourcesCollection, resourceData);
  return { id: docRef.id, ...resourceData };
}

export async function updateResource(
  id: string,
  data: UpdatableResourceData
): Promise<Resource | null> {
  const docRef = doc(db, 'resources', id);
  await updateDoc(docRef, data);
  // We don't know the companyId here, so the caller must handle re-fetching.
  const updatedDoc = await getDoc(docRef);
  return updatedDoc.exists()
    ? ({ id: updatedDoc.id, ...updatedDoc.data() } as Resource)
    : null;
}

export async function deleteResource(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'resources', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error('Error deleting resource: ', e);
    return false;
  }
}

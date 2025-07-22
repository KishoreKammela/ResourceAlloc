import { db } from '@/lib/firebase/config';
import type { Project, UpdatableProjectData } from '@/types/project';
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
} from 'firebase/firestore';

const projectsCollection = collection(db, 'projects');

export async function getProjects(companyId: string): Promise<Project[]> {
  const q = query(projectsCollection, where('companyId', '==', companyId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project);
}

export async function getProjectById(
  id: string,
  companyId: string
): Promise<Project | null> {
  const docRef = doc(db, 'projects', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const project = { id: docSnap.id, ...docSnap.data() } as Project;
    // Security check
    if (project.companyId === companyId) {
      return project;
    }
  }
  return null;
}

export async function addProject(
  projectData: Omit<Project, 'id'>
): Promise<Project> {
  if (!projectData.companyId) {
    throw new Error('Company ID is required to create a project.');
  }
  const docRef = await addDoc(projectsCollection, projectData);
  return { id: docRef.id, ...projectData };
}

export async function updateProject(
  id: string,
  data: UpdatableProjectData
): Promise<Project | null> {
  const docRef = doc(db, 'projects', id);
  // Firestore does not store 'undefined' values, so we clean the objects in the team array
  const cleanedData = {
    ...data,
    team: data.team
      ? data.team.map((member) => JSON.parse(JSON.stringify(member)))
      : [],
  };
  await updateDoc(docRef, cleanedData);
  const updatedDoc = await getDoc(docRef);
  return updatedDoc.exists()
    ? ({ id: updatedDoc.id, ...updatedDoc.data() } as Project)
    : null;
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'projects', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error('Error deleting project: ', e);
    return false;
  }
}

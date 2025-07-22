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
} from 'firebase/firestore';

const projectsCollection = collection(db, 'projects');

export async function getProjects(): Promise<Project[]> {
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const docRef = doc(db, 'projects', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Project;
  }
  return null;
}

export async function addProject(
  projectData: Omit<Project, 'id'>
): Promise<Project> {
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
  return await getProjectById(id);
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

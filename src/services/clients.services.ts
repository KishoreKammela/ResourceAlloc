import { db } from '@/lib/firebase/config';
import type { Client } from '@/types/client';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

const clientsCollection = collection(db, 'clients');

export async function addClient(
  clientData: Omit<Client, 'id'>
): Promise<Client> {
  if (!clientData.companyId) {
    throw new Error('Company ID is required to create a client.');
  }
  const docRef = await addDoc(clientsCollection, clientData);
  return { id: docRef.id, ...clientData };
}

export async function getClients(companyId: string): Promise<Client[]> {
  try {
    const q = query(
      clientsCollection,
      where('companyId', '==', companyId),
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Client
    );
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

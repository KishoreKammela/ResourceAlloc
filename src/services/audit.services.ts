import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const auditCollection = collection(db, 'audit_logs');

type AuditLog = {
  event: 'user_created' | 'user_logout' | 'user_deleted' | 'profile_updated';
  userId: string;
  details: string;
  timestamp?: any;
  companyId?: string; // Optional for system-level vs company-level events
};

export async function addAuditLog(logData: Omit<AuditLog, 'timestamp'>) {
  try {
    await addDoc(auditCollection, {
      ...logData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding audit log:', error);
    // In a real application, you might want more robust error handling here,
    // like sending an alert to an admin.
  }
}

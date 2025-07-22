import { initializeApp, getApps, App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

let adminApp: App;

export async function initAdminApp() {
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return;
  }
  if (!serviceAccount) {
    throw new Error('Firebase service account key is not set');
  }
  adminApp = initializeApp({
    credential: credential.cert(serviceAccount),
  });
}

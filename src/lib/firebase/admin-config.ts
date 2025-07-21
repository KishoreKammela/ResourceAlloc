import * as admin from 'firebase-admin';

export async function initAdmin() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccount) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.'
    );
  }

  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }
}

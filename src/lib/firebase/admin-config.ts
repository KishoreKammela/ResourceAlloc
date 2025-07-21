import * as admin from 'firebase-admin';

export async function initAdmin() {
  if (!admin.apps.length) {
    try {
      const serviceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      if (
        !serviceAccount.projectId ||
        !serviceAccount.clientEmail ||
        !serviceAccount.privateKey
      ) {
        throw new Error(
          'Firebase admin environment variables are not fully set.'
        );
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }
}

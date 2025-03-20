import admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(path.resolve(process.cwd(), 'utils/serviceAccountKey.json')),
  });
}

export const db = admin.firestore();
export default admin;

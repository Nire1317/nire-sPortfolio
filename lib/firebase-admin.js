import admin from 'firebase-admin';

let db = null;

if (!admin.apps.length) {
  try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey) {
      // Strip outer double/single quotes if they exist (common when copying from json)
      if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || 
          (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
        privateKey = privateKey.slice(1, -1);
      }
      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    // Only initialize if credentials are provided
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    } else {
      console.warn('Firebase Admin: Missing credentials. Firestore operations will fail.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

// Retrieve Firestore DB reference if app was successfully initialized
if (admin.apps.length > 0) {
  try {
    db = admin.firestore();
  } catch (error) {
    console.error('Firebase Admin: Failed to initialize Firestore client:', error);
  }
}

export { db, admin };

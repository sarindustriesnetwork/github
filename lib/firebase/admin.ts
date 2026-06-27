import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function normalizePrivateKey(value?: string) {
  return value ? value.replace(/\\n/g, "\n") : undefined;
}

export function getFirebaseProjectId() {
  return process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || "";
}

export function isFirebaseConfigured() {
  return Boolean(getFirebaseProjectId());
}

export function getFirebaseAdminApp(): App | null {
  const projectId = getFirebaseProjectId();
  if (!projectId) return null;
  if (getApps().length > 0) return getApps()[0];

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey
      }),
      projectId
    });
  }

  return initializeApp({ projectId });
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseAdminApp();
  return app ? getFirestore(app) : null;
}

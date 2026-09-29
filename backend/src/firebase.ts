import "dotenv/config";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId =
  process.env.FIREBASE_PROJECT_ID || "demo-worknoon-refund";

if (!getApps().length) {
  initializeApp({
    projectId,
  });
}

export const db = getFirestore();
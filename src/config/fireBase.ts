import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from './index.js';

export const firebase = {
  app() {
    if (getApps().length === 0) {
      if (
        !config.firebase.projectId ||
        !config.firebase.clientEmail ||
        !config.firebase.privateKey
      ) {
        throw new Error('Firebase credentials are not configured');
      }

      return initializeApp({
        credential: cert({
          projectId: config.firebase.projectId,
          clientEmail: config.firebase.clientEmail,
          privateKey: (config.firebase.privateKey as string).replace(
            /\\n/g,
            '\n'
          ),
        }),
      });
    }

    return getApp();
  },

  db() {
    this.app();
    return getFirestore();
  },
};

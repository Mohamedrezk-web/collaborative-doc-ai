// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const serviceKey = require('./service_key.json');
let app: App;

if (getApps().length == 0) {
  app = initializeApp({
    credential: cert(serviceKey),
    databaseURL:
      'https://notion-ai-clone-2928d-default-rtdb.europe-west1.firebasedatabase.app',
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };

// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB8Mh1ENxjcANywzHOamMuhH0FT3FGUVcw',
  authDomain: 'notion-ai-clone-2928d.firebaseapp.com',
  projectId: 'notion-ai-clone-2928d',
  storageBucket: 'notion-ai-clone-2928d.firebasestorage.app',
  messagingSenderId: '923252410134',
  appId: '1:923252410134:web:e1405c8cde03d931fab237',
};

// Initialize Firebase
const app = getApps().length == 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };

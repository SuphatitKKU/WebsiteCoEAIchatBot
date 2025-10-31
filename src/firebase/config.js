// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFunctions } from 'firebase/functions'; // ← เพิ่มบรรทัดนี้

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo7pLpmv04Eyk3K-fBZtUvKIZLCcqot1o",
  authDomain: "codme-cb7b4.firebaseapp.com",
  projectId: "codme-cb7b4",
  storageBucket: "codme-cb7b4.firebasestorage.app",
  messagingSenderId: "167915856115",
  appId: "1:167915856115:web:96cc761a1524122ab6d786",
  measurementId: "G-QK16ETLM16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const functions = getFunctions(app); // ← เพิ่มบรรทัดนี้

// Export services
export { db, storage, auth, googleProvider, functions }; // ← เพิ่ม functions ในการ export
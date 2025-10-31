// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - แทนที่ด้วยค่าจริงจาก Firebase Console
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

// Initialize Firestore
const db = getFirestore(app);

export { db };
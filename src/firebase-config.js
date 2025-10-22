import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDG_tVTvqgY38ipDSSG2UYsk_ydH6Adq5w",
  authDomain: "clinica---gestao.firebaseapp.com",
  projectId: "clinica---gestao",
  storageBucket: "clinica---gestao.firebasestorage.app",
  messagingSenderId: "339449915295",
  appId: "1:339449915295:web:9bbf3c381ea72f08ffbfaa",
  measurementId: "G-12484N9KFT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
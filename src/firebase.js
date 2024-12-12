// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZuujmFub6feGZjLdVXOlK99oF6Kh-2Jw",
  authDomain: "edi-app-9b765.firebaseapp.com",
  projectId: "edi-app-9b765",
  storageBucket: "edi-app-9b765.firebasestorage.app",
  messagingSenderId: "645504511280",
  appId: "1:645504511280:web:5bf2404329aa906d2d6cf5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
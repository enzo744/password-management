// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration 
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gestione-campi.firebaseapp.com",
  projectId: "gestione-campi",
  storageBucket: "gestione-campi.appspot.com",
  messagingSenderId: "760760248337",
  appId: "1:760760248337:web:a9852b6fa3871ec42ea9b0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
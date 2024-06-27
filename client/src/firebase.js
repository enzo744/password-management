// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "password-manager-a7635.firebaseapp.com",
  projectId: "password-manager-a7635",
  storageBucket: "password-manager-a7635.appspot.com",
  messagingSenderId: "743472967042",
  appId: "1:743472967042:web:61dd66eeb76efbf0faf39b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
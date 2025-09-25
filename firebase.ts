// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUzcdHMO-NK56bV56P2DS70IyCxwR4cW8",
  authDomain: "minimal-habit-tracker-b8125.firebaseapp.com",
  projectId: "minimal-habit-tracker-b8125",
  storageBucket: "minimal-habit-tracker-b8125.firebasestorage.app",
  messagingSenderId: "1035601014761",
  appId: "1:1035601014761:web:aefb66d8b5ccf03ae72578",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);




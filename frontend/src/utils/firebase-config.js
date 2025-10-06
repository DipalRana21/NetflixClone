// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVMbL6gTrZ-ywx6amStnUU3pD-jmhOj3A",
  authDomain: "netflix-clone-6609c.firebaseapp.com",
  projectId: "netflix-clone-6609c",
  storageBucket: "netflix-clone-6609c.firebasestorage.app",
  messagingSenderId: "979248746607",
  appId: "1:979248746607:web:492012a9e05a6c68a37d9a",
  measurementId: "G-DYQVR5MGY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const firebaseAuth = getAuth(app);

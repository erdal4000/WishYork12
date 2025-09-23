// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBglVv6PZ3CFkG9tKl31OviA-OMH4c7aNg",
  authDomain: "studio-1428452108-7875b.firebaseapp.com",
  projectId: "studio-1428452108-7875b",
  storageBucket: "studio-1428452108-7875b.firebasestorage.app",
  messagingSenderId: "169653722398",
  appId: "1:169653722398:web:30ad74db5c8408ee35bd0f"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

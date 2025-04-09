// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoBlsTXr2RGQEjPcxl-5Tmg0OGKJc89w4",
  authDomain: "attendance-app-8a96e.firebaseapp.com",
  projectId: "attendance-app-8a96e",
  storageBucket: "attendance-app-8a96e.firebasestorage.app",
  messagingSenderId: "674573692500",
  appId: "1:674573692500:web:db884842566c5e2ba187c1",
  measurementId: "G-VN24FWDBJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const analytics = getAnalytics(app);

// Export the auth, provider, and db objects for use in other files
export { auth, provider, db };
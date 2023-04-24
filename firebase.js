import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP-fg2mNH9zacDvIfx5zViyo3mMum11Zo",
  authDomain: "whatzapp-84c91.firebaseapp.com",
  projectId: "whatzapp-84c91",
  storageBucket: "whatzapp-84c91.appspot.com",
  messagingSenderId: "280499524090",
  appId: "1:280499524090:web:4505daf3f1ce82b7385443",
  databaseURL: "https://whatzapp.europe-west3.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {app, db, auth, provider};
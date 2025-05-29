import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbG1dTHZuIEumPqWAbHa7ghrt7DT6mdnA",
  authDomain: "spacexapi-3f42e.firebaseapp.com",
  projectId: "spacexapi-3f42e",
  storageBucket: "spacexapi-3f42e.firebasestorage.app",
  messagingSenderId: "837175148091",
  appId: "1:837175148091:web:74af895a7e0562156ca61e",
  measurementId: "G-HD9QQEY4K3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbG1dTHZuIEumPqWAbHa7ghrt7DT6mdnA",
  authDomain: "spacexapi-3f42e.firebaseapp.com",
  projectId: "spacexapi-3f42e",
  storageBucket: "spacexapi-3f42e.firebasestorage.app",
  messagingSenderId: "837175148091",
  appId: "1:837175148091:web:74af895a7e0562156ca61e",
  measurementId: "G-HD9QQEY4K3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
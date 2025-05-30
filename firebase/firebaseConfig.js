// filepath: /workspaces/SpaceX2.0/firebase/firebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDbG1dTHZuIEumPqWAbHa7ghrt7DT6mdnA",
  authDomain: "spacexapi-3f42e.firebaseapp.com",
  projectId: "spacexapi-3f42e",
  storageBucket: "spacexapi-3f42e.firebasestorage.app",
  messagingSenderId: "837175148091",
  appId: "1:837175148091:web:74af895a7e0562156ca61e",
  measurementId: "G-HD9QQEY4K3"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };
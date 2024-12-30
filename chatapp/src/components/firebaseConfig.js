// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD7zpIK13BbmCjN8TfwwF4k90qPJoRyvJs",
    authDomain: "chatterbox-cc56d.firebaseapp.com",
    projectId: "chatterbox-cc56d",
    storageBucket: "chatterbox-cc56d.firebasestorage.app",
    messagingSenderId: "91887160628",
    appId: "1:91887160628:web:c407d71911a63fef07e961",
    measurementId: "G-QWKDQ1RMF5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

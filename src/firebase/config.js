// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq-7DELBmQCRCeNax1Ew8-Ah36TBhGzec",
  authDomain: "messaging-fe061.firebaseapp.com",
  projectId: "messaging-fe061",
  storageBucket: "messaging-fe061.firebasestorage.app",
  messagingSenderId: "854510898415",
  appId: "1:854510898415:web:d3781a45798e6ade111f1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const firestore = getFirestore(app);

export {app, auth, firestore}
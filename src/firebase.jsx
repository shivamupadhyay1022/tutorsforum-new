// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqVAV-Ee73slfJFXMKiaEW_zwz0miyupk",
  authDomain: "sci-tutorsforum.firebaseapp.com",
  databaseURL: "https://sci-tutorsforum-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sci-tutorsforum",
  storageBucket: "sci-tutorsforum.appspot.com",
  messagingSenderId: "754539837111",
  appId: "1:754539837111:web:08d25e93caa187fa3a7f32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getDatabase(app);
export const googleprovider = new GoogleAuthProvider();

export default app;
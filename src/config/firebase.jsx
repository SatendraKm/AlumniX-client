import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
} from "firebase/auth";

// Your Firebase configuration object, which you can get from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebase = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;

// Set up the authentication module
export const auth = firebase ? getAuth(firebase) : null;
export const googleProvider = firebase ? new GoogleAuthProvider() : null;
export const facebookProvider = firebase ? new FacebookAuthProvider() : null;
export const twitterProvider = firebase ? new TwitterAuthProvider() : null;
export const appleProvider = firebase ? new OAuthProvider("apple.com") : null;

export default firebase;

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeY99x3_ygSRc9dgQrYlRoGkd-Hp7FZFc",
  authDomain: "anomalycoaching.firebaseapp.com",
  projectId: "anomalycoaching",
  storageBucket: "anomalycoaching.firebasestorage.app",
  messagingSenderId: "1197981818",
  appId: "1:1197981818:web:65320408caf1aa7dfc3bc3",
  measurementId: "G-RLYHS6YYBM",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
export const db = getFirestore(app);
// Initialize analytics (optional)
export const analytics = getAnalytics(app);


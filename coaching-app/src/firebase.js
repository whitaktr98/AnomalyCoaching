import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAeY99x3_ygSRc9dgQrYlRoGkd-Hp7FZFc",
  authDomain: "anomalycoaching.firebaseapp.com",
  projectId: "anomalycoaching",
  storageBucket: "anomalycoaching.firebasestorage.app",
  messagingSenderId: "1197981818",
  appId: "1:1197981818:web:65320408caf1aa7dfc3bc3",
  measurementId: "G-RLYHS6YYBM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 🔒 Initialize secondary app for isolated user creation (e.g., clients)
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

// Export everything
export { app, auth, db, storage, secondaryAuth };
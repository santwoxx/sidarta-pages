import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVwgk6c1rHsXzZAyGz0ZTR2Rm5X4hUYc8",
  authDomain: "sidarta-pages.firebaseapp.com",
  projectId: "sidarta-pages",
  storageBucket: "sidarta-pages.firebasestorage.app",
  messagingSenderId: "549415425620",
  appId: "1:549415425620:web:92fb5c1fa5652c38187fc1",
  measurementId: "G-Y5RVGC9DKE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut };

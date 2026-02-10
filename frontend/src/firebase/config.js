// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"; // ✅ ADD THESE IMPORTS

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-jyr4gFTNewVusbJDwlCbltzoyilrUL4",
  authDomain: "mindbloom-57a36.firebaseapp.com",
  projectId: "mindbloom-57a36",
  storageBucket: "mindbloom-57a36.firebasestorage.app",
  messagingSenderId: "1000957641172",
  appId: "1:1000957641172:web:9a3afb8bb7b3644f955641",
  measurementId: "G-4YHCP9KGC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
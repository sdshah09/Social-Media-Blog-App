// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics"; // Optional, remove if not used

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgva2t4m-5emPAc_1IEsEl5mG5o4ReiYg",
  authDomain: "gqlreactnode-5cd95.firebaseapp.com",
  projectId: "gqlreactnode-5cd95",
  storageBucket: "gqlreactnode-5cd95.appspot.com",
  appId: "1:932193521312:web:c15af9f48d48f1de2603c5",
  measurementId: "G-8Q131GCM4S" // Optional, remove if not used
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Optional, remove if not used

const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { auth, googleAuthProvider };

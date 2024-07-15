// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import * as firebase from 'firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgva2t4m-5emPAc_1IEsEl5mG5o4ReiYg",
  authDomain: "gqlreactnode-5cd95.firebaseapp.com",
  projectId: "gqlreactnode-5cd95",
  storageBucket: "gqlreactnode-5cd95.appspot.com",
//   messagingSenderId: "932193521312",
  appId: "1:932193521312:web:c15af9f48d48f1de2603c5",
  measurementId: "G-8Q131GCM4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth =  firebase.auth();
export const googleAuthProvider = new firebase.auth.googleAuthProvider();
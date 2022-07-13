// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASbTv2JQeuKMiGR3ESOzZmn9kUvzlQROg",
  authDomain: "house-marketplace-app-f240b.firebaseapp.com",
  projectId: "house-marketplace-app-f240b",
  storageBucket: "house-marketplace-app-f240b.appspot.com",
  messagingSenderId: "812347389720",
  appId: "1:812347389720:web:8c8af0a3bcaf734bbf906d",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();

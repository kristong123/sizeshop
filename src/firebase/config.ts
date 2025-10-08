// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlhaZOy4ybjTv1zz9CU0zNpEtbyxD_vSU",
  authDomain: "sizeshop-790f0.firebaseapp.com",
  projectId: "sizeshop-790f0",
  storageBucket: "sizeshop-790f0.firebasestorage.app",
  messagingSenderId: "416353299767",
  appId: "1:416353299767:web:861e7cd29a3f5ab857feb2",
  measurementId: "G-R92GGR43F1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
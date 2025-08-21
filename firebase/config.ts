// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// DO NOT import getAnalytics for React Native

export const firebaseConfig = {
  apiKey: "AIzaSyAl51wzIZVsVU9dBPEeDrxSzZ1Xgi4jo38",
  authDomain: "unbudget-161b3.firebaseapp.com",
  projectId: "unbudget-161b3",
  storageBucket: "unbudget-161b3.appspot.com",
  messagingSenderId: "370898316467",
  appId: "1:370898316467:web:493c1382bf377f3735d4c6",
  measurementId: "G-QWMG5B8Q7V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;


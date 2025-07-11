
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCvzbZ41QJLhKmlJ9TvtJTymLEZv0vm9Ss",
  authDomain: "cubeai-erp.firebaseapp.com",
  projectId: "cubeai-erp",
  storageBucket: "cubeai-erp.firebasestorage.app",
  messagingSenderId: "186085541361",
  appId: "1:186085541361:web:c0663ccf17e64b2dd03050",
  measurementId: "G-EVWFG90Q17"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
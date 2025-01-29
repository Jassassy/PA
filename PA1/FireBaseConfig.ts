import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1B72ZHSloF9fa_ypeGE6GuiK-CBrRBok",
  authDomain: "programmingassignment-fe516.firebaseapp.com",
  projectId: "programmingassignment-fe516",
  storageBucket: "programmingassignment-fe516.firebasestorage.app",
  messagingSenderId: "655215955872",
  appId: "1:655215955872:web:32123bd954d1545a845ec5",
  measurementId: "G-4KGB0E5CPY"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
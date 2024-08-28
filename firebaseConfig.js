// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8xgcSyvgqyPZa4y9riKzqsX_Boj-JG9g",
  authDomain: "orctal-6dce9.firebaseapp.com",
  projectId: "orctal-6dce9",
  storageBucket: "orctal-6dce9.appspot.com",
  messagingSenderId: "1035932984195",
  appId: "1:1035932984195:web:1fff2b516a9e61e467ccb6",
  measurementId: "G-QGNLBRCNYJ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

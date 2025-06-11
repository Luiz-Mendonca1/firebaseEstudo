
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsxCNtJU4MLz-WAAFdtxEV3tasqSqyXkw",
  authDomain: "aprendizado-96f08.firebaseapp.com",
  projectId: "aprendizado-96f08",
  storageBucket: "aprendizado-96f08.firebasestorage.app",
  messagingSenderId: "748531709338",
  appId: "1:748531709338:web:1da627cf5dfae9234c3623",
  measurementId: "G-LQJTBPS7V1"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);


export { db };
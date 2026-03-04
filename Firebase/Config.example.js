import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, doc, query, onSnapshot, orderBy, updateDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "MY_API_KEY",
  authDomain: "MY_AUTH_DOMAIN",
  projectId: "MY_PROJECT_ID",
  storageBucket: "MY_STORAGE_BUCKET",
  messagingSenderId: "MY_MESSAGING_SENDER_ID",
  appId: "MY_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, deleteDoc, doc, query, onSnapshot, orderBy, updateDoc };


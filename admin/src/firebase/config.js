import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDVHF2pcGnrpWvl6e7wsdnytbzxRcN-qgk",
  authDomain: "real-time-user-admin-cha-236e7.firebaseapp.com",
  projectId: "real-time-user-admin-cha-236e7",
  storageBucket: "real-time-user-admin-cha-236e7.appspot.com",
  messagingSenderId: "139972576489",
  appId: "1:139972576489:web:f45252da55ff5ef8ffdc78",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

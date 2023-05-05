import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export const sendMessage = async (data) => {
  const collectionRef = collection(db, "messages");
  await addDoc(collectionRef, { ...data, createdAt: serverTimestamp() });
};

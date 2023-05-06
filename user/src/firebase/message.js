import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "./config";
import { ref, uploadString } from "firebase/storage";

export const sendMessage = async (data) => {
  const collectionRef = collection(db, "messages");
  await addDoc(collectionRef, { ...data, createdAt: serverTimestamp() });
};

export const sendImage = async (
  img,
  id,
  fileExtension,
  conversationId,
  receiverId
) => {
  const imageRef = ref(
    storage,
    "images/" + Date.now() + id + "." + fileExtension
  );

  const response = await uploadString(imageRef, img, "data_url");
  await sendMessage({
    conversationId,
    file: response.metadata.fullPath,
    receiverId,
  });
};

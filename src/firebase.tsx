import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  setDoc,
  doc,
  DocumentSnapshot,
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

import FirebaseConfig from "./utils/FirebaseConfig";
import { useNavigate } from "react-router-dom";

const firebaseConfig = FirebaseConfig;

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw new Error("Wrong password or email not registed")
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent, please check the spam box!");
  } catch (err) {
    console.error(err);
    alert(err);
  }
};

const logout = (navigate: any) => {
  signOut(auth)
    .then(() => {
      navigate("/login");
    })
    .catch((error) => alert(error));
};

const addDocument = async (collectionToAdd: string, data: any) => {
  try {
    const docRef = await addDoc(
      collection(db, collectionToAdd),
      JSON.parse(JSON.stringify(data))
    );
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

const addDocumentWithId = async (
  collectionToAdd: string,
  id: string,
  data: any
) => {
  try {
    const docRef = doc(db, collectionToAdd, id);
    await setDoc(docRef, JSON.parse(JSON.stringify(data)));
    return id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

const updateDocument = async (
  collectionToUpdate: string,
  id: string,
  data: any
) => {
  try {
    const docRef = doc(db, collectionToUpdate, id);
    await updateDoc(docRef, JSON.parse(JSON.stringify(data)));
    return id;
  } catch (error) {
    console.error("Error updating document: ", error);
    return null;
  }
};

const deleteDocumentWithId = async (
  collectionToDelete: string,
  id: string
) => {
  try {
    const docRef = doc(db, collectionToDelete, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting document: ", error);
    return null;
  }
};


function getCollectionRef(collectionName: string) {
  return collection(db, collectionName);
}

function getDocRefWithId(collectionToSearch: string, id: string) {
  return doc(collection(db, collectionToSearch), id)
}

export {
  auth,
  db,
  logInWithEmailAndPassword,
  sendPasswordReset,
  logout,
  addDocument,
  addDocumentWithId,
  updateDocument,
  deleteDocumentWithId,
  getDocRefWithId,
  getCollectionRef,
};
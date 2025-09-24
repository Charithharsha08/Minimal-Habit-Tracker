import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { UserData } from "@/types/userData";

export const userColRef = collection(db, "userData");

// Add new user
export const addNewUser = async (user: UserData) => {
  // use email as the doc ID to simplify lookups
  const userDocRef = doc(db, "userData", auth.currentUser!.uid);
  await setDoc(userDocRef, user);
  return userDocRef.id;
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<UserData | null> => {
  try {
   const userDocRef = doc(db, "userData", auth.currentUser!.uid);
   const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) return null;

    return { id: snapshot.id, ...(snapshot.data() as UserData) };
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

// Update user
export const updateUser = async (id: string, user: UserData) => {
  const userDocRef = doc(db, "userData", id);
  const { id: _id, ...userData } = user; 
  return await updateDoc(userDocRef, userData);
};


export const getUserByUid = async (uid: string): Promise<UserData | null> => {
  if (!uid) return null; // safety check

  try {
    const userDocRef = doc(db, "userData", uid);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) return null;

    return { id: snapshot.id, ...(snapshot.data() as UserData) };
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    return null;
  }
};

import { auth } from "@/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth"

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const logout = () => {
  return signOut(auth)
}


export const register = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  if (userCredential.user) {
    await updateProfile(userCredential.user, {
      displayName: name,
    });
  }

  return userCredential.user;
};

import { db } from "@/firebase";
import { Habit } from "@/types/habit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const habitColRef = collection(db, "habits");
export const completeHabitColRef = collection(db, "completedHabits");

export const createHabit = async (habit: Habit) => {
  console.log("habit", habit);
  const docRef = await addDoc(habitColRef, habit);
  return docRef.id;
};

export const getHabitCollectionRef = () => {
  return habitColRef;
};

export const updateHabit = async (id: string, habit: any) => {
  const docRef = doc(db, "habits", id);
  const { id: _id, ...habitData } = habit;
  return await updateDoc(docRef, habitData);
};

export const deleteHabit = async (id: string) => {
  const docRef = doc(db, "habits", id);
  return await deleteDoc(docRef);
};

export const getHabitById = async (id: string) => {
  const habitDocRef = doc(db, "habits", id);
  const snapshot = await getDoc(habitDocRef);
  const habit = snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as any)
    : null;
  return habit;
};

export const getAllHabits = async () => {
  const snapshot = await getDocs(habitColRef);
  const habitList = snapshot.docs.map((habitRef) => ({
    id: habitRef.id,
    ...habitRef.data(),
  })) as any[];
  return habitList;
};

export const saveCompletedHabit = async (habitId: string) => {
  const docRef = await addDoc(completeHabitColRef, {
    habitId,
    completedAt: new Date(),
  });
  return docRef.id;
};

export const getCompletedHabits = async () => {
  const snapshot = await getDocs(completeHabitColRef);
  const completedHabitList = snapshot.docs.map((habitRef) => ({
    id: habitRef.id,
    ...habitRef.data(),
  })) as any[];
  return completedHabitList;
};

export const getCompletedHabitsByHabitId = async (habitId: string) => {
  const snapshot = await getDocs(completeHabitColRef);
  const completedHabitList = snapshot.docs
    .map((habitRef) => ({
      id: habitRef.id,
      ...habitRef.data(),
    }))
    .filter((ch) => ch.id === habitId ) as any[];
  return completedHabitList;
};

export const deleteCompletedHabit = async (id: string) => {
  const docRef = doc(db, "completedHabits", id);
  return await deleteDoc(docRef);
};

export const isHabitCompletedForPeriod = (
  habit: Habit,
  completedAt: Date
): boolean => {
  const now = new Date();

  if (habit.frequency === "Daily") {
    return now.toDateString() === new Date(completedAt).toDateString();
  }

  if (habit.frequency === "Weekly") {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return (
      new Date(completedAt) >= startOfWeek && new Date(completedAt) <= endOfWeek
    );
  }

  if (habit.frequency === "Monthly") {
    return (
      now.getFullYear() === new Date(completedAt).getFullYear() &&
      now.getMonth() === new Date(completedAt).getMonth()
    );
  }

  return false;
};


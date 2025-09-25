import { db, auth } from "@/firebase";
import { CompletedHabit, Habit } from "@/types/habit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

export const habitColRef = collection(db, "habits");
export const completeHabitColRef = collection(db, "completedHabits");

export const createHabit = async (habit: Partial<Habit>) => {
  // Ensure ownerId exists and createdAt is a Firestore Timestamp
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Not authenticated");

  const habitWithOwner = {
    ...habit,
    ownerId: habit.ownerId ?? currentUser.uid,
    createdAt: habit.createdAt ? habit.createdAt : new Date(),
  };

  const docRef = await addDoc(habitColRef, habitWithOwner as any);
  return docRef.id;
};


export const getAllHabitsByOwner = (ownerId: string) => {
  // ✅ Return query instead of fetching
  return query(habitColRef, where("ownerId", "==", ownerId));
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

export const saveCompletedHabit = async (habitId: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Not authenticated");

  // Fetch completions for this habit
  const existing = await getCompletedHabitsByHabitId(habitId, currentUser.uid);

  // Grab the habit details (mainly for frequency)
  const habitDoc = await getHabitById(habitId);
  if (!habitDoc) throw new Error("Habit not found");

  // ✅ Check if already completed for current period
  const alreadyCompleted = existing.some((c) =>
    isHabitCompletedForPeriod(habitDoc, c.completedAt)
  );

  if (alreadyCompleted) {
    console.log("Habit already completed for this period.");
    return null; // 🚫 Don't save duplicate
  }

  // Save new completion
  const docRef = await addDoc(completeHabitColRef, {
    habitId,
    ownerId: currentUser.uid,
    completedAt: new Date(),
  });

  return docRef.id;
};


export const getCompletedHabits = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const q = query(completeHabitColRef, where("ownerId", "==", user.uid));
  const snapshot = await getDocs(q);

  const completedHabitList = snapshot.docs.map((d) => {
    const data = d.data() as any;
    let completedAt: Date | null = null;

    // Robust conversion for Firestore Timestamp | Date | number | string
    const raw = data.completedAt;
    if (raw?.toDate) {
      completedAt = raw.toDate();
    } else if (raw instanceof Date) {
      completedAt = raw;
    } else if (typeof raw === "number") {
      completedAt = new Date(raw);
    } else if (typeof raw === "string") {
      const parsed = new Date(raw);
      completedAt = isNaN(parsed.getTime()) ? null : parsed;
    }

    return {
      id: d.id,
      habitId: data.habitId,
      ownerId: data.ownerId,
      completedAt: completedAt ?? new Date(0), // fallback to epoch if somehow missing
    } as CompletedHabit;
  });

  return completedHabitList;
};


export const getCompletedHabitsByHabitId = async (
  habitId: string,
  userId: string
) => {
  const q = query(
    completeHabitColRef,
    where("habitId", "==", habitId),
    where("ownerId", "==", userId)
  );
  const snapshot = await getDocs(q);

  const completedHabitList = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      // ✅ Normalize Firestore Timestamp → JS Date
      completedAt: data.completedAt?.toDate
        ? data.completedAt.toDate()
        : data.completedAt,
    } as CompletedHabit;
  });

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

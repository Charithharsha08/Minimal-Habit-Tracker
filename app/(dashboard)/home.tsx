import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Habit, CompletedHabit } from "@/types/habit";
import ProcessingHabitCard from "@/components/ProcessingHabitCard";
import { auth, db } from "@/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  getCompletedHabitsByHabitId,
  saveCompletedHabit,
  isHabitCompletedForPeriod,
  getAllHabitsByOwner,
} from "@/services/habitService";

const Home = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabitIds, setCompletedHabitIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No user logged in");
      setHabits([]);
      return;
    }

    setLoading(true);

    // const q = query(collection(db, "habits"), where("ownerId", "==", user.uid));

    const q = getAllHabitsByOwner(user.uid);

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const list: Habit[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Habit),
          }));

          const todayHabits: Habit[] = [];
          const completedIds: string[] = [];

          for (let habit of list) {
            // Add habit to todayHabits (you can filter by frequency if needed)
            todayHabits.push(habit);

            // Check completion status
            let completedList: CompletedHabit[] = [];
            if (currentUser?.uid) {
              completedList = await getCompletedHabitsByHabitId(habit.id!, currentUser.uid);
              console.log("completedList length", completedList.length);
            }

            const completedToday = completedList.some((c) =>
              isHabitCompletedForPeriod(habit, c.completedAt)
            );

            console.log("completedToday", completedToday);
            
            if (completedToday) {
              completedIds.push(habit.id!);
            }
          }

          setHabits(todayHabits);
          setCompletedHabitIds(completedIds);
        } catch (error) {
          console.error("Failed to process habits:", error);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching habits:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleComplete = async (habitId: string) => {
    await saveCompletedHabit(habitId);
    setCompletedHabitIds((prev) => [...prev, habitId]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-5">
      <Text className="text-2xl font-bold mb-4">Today's Habits</Text>
      {habits.length === 0 ? (
        <Text className="text-gray-400 text-center mt-10">
          No habits to do today!
        </Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <ProcessingHabitCard
              habit={item}
              isCompleted={completedHabitIds.includes(item.id!)}
              onComplete={handleComplete}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Home;

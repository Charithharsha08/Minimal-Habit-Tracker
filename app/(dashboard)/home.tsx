import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Habit, CompletedHabit } from "@/types/habit";
import ProcessingHabitCard from "@/components/ProcessingHabitCard";
import { auth } from "@/firebase";
import {
  getAllHabitsByOwner,
  getCompletedHabitsByHabitId,
  saveCompletedHabit,
  isHabitCompletedForPeriod,
} from "@/services/habitService";

const Home = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabitIds, setCompletedHabitIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // <-- loading state
  const currentUser = auth.currentUser;
  console.log("Current user:", currentUser?.uid);
  

  useEffect(() => {
    if (!currentUser) return;

    const loadHabits = async () => {
      setLoading(true);
      try {
        const allHabits = await getAllHabitsByOwner(currentUser.uid);
        const todayHabits: Habit[] = [];

        for (let habit of allHabits) {
          if (habit.frequency === "Daily") todayHabits.push(habit);
          else todayHabits.push(habit); // weekly/monthly as possible

          const completedList: CompletedHabit[] =
            await getCompletedHabitsByHabitId(habit.id!);
          const completedToday = completedList.some((c) =>
            isHabitCompletedForPeriod(habit, c.completedAt)
          );
          if (completedToday)
            setCompletedHabitIds((prev) => [...prev, habit.id!]);
        }

        setHabits(todayHabits);
      } catch (error) {
        console.error("Failed to load habits:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, [currentUser]);

  const handleComplete = async (habitId: string) => {
    await saveCompletedHabit(habitId);
    setCompletedHabitIds((prev) => [...prev, habitId]);
  };

  if (loading) {
    // Show loading spinner while habits are being fetched
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

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Habit, CompletedHabit } from "@/types/habit";
import ProcessingHabitCard from "@/components/ProcessingHabitCard";
import { auth } from "@/firebase";
import { onSnapshot } from "firebase/firestore";
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
  const [refreshing, setRefreshing] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No user logged in");
      setHabits([]);
      return;
    }

    setLoading(true);

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

          const now = new Date();
          const isSunday = now.getDay() === 0;
          const isFirstDayOfMonth = now.getDate() === 1;

          for (let habit of list) {
            let shouldAdd = false;

            if (habit.frequency === "Daily") shouldAdd = true;
            else if (habit.frequency === "Weekly" && isSunday) shouldAdd = true;
            else if (habit.frequency === "Monthly" && isFirstDayOfMonth)
              shouldAdd = true;

            if (shouldAdd) {
              todayHabits.push(habit);

              let completedList: CompletedHabit[] = [];
              if (currentUser?.uid) {
                completedList = await getCompletedHabitsByHabitId(
                  habit.id!,
                  currentUser.uid
                );
              }

              const completedToday = completedList.some((c) =>
                isHabitCompletedForPeriod(habit, c.completedAt)
              );

              if (completedToday) {
                completedIds.push(habit.id!);
              }
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

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // quick refresh animation
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-3 text-gray-600">Loading your habits...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 px-5 pt-10">
      <Text className="text-3xl font-bold text-gray-900 mb-2">
        Today’s Habits
      </Text>
      <Text className="text-gray-500 mb-6">
        Stay consistent, one step at a time 🚀
      </Text>

      {habits.length === 0 ? (
        <Text className="text-gray-400 text-center mt-16 text-lg">
          No habits scheduled for today ✨
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default Home;

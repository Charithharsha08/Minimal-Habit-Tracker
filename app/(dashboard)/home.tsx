import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

import {
  getAllHabits,
  getCompletedHabits,
  saveCompletedHabit,
  isHabitCompletedForPeriod,
} from "@/services/habitService";
import { CompletedHabit, Habit } from "@/types/habit";

const HabitScreen = () => {
  const router = useRouter();
  const [habits, setHabits] = useState<
    (Habit & { done?: boolean; locked?: boolean })[]
  >([]);

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = async () => {
    const data: Habit[] = await getAllHabits();
    const completed: CompletedHabit[] = await getCompletedHabits();

    const merged = data.map((habit) => {
      const completion = completed.find(
        (c) =>
          c.habitId === habit.id &&
          isHabitCompletedForPeriod(habit, c.completedAt)
      );

      return {
        ...habit,
        done: !!completion,
        locked: !!completion,
      };
    });

    setHabits(merged);
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit || habit.locked) return;

    await saveCompletedHabit(id);

    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: true, locked: true } : h))
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="w-full py-4 bg-blue-600 items-center">
        <Text className="text-white text-xl font-semibold">Habits</Text>
      </View>

      {/* Habits List */}
      <ScrollView className="px-4 pt-4">
        {habits.length === 0 ? (
          <Text className="text-gray-500 text-center mt-10">
            No habits available
          </Text>
        ) : (
          habits.map((habit) => (
            <View
              key={habit.id}
              className={`p-4 mb-4 rounded-2xl shadow ${
                habit.done ? "bg-green-200" : "bg-white"
              }`}
            >
              <Text
                className={`text-lg font-semibold ${
                  habit.done ? "line-through text-gray-600" : "text-gray-800"
                }`}
              >
                {habit.title}
              </Text>
              {habit.description && (
                <Text className="text-gray-600 mt-1">{habit.description}</Text>
              )}

              {/* Actions */}
              <View className="flex-row justify-end mt-3 space-x-4">
                <TouchableOpacity
                  disabled={habit.locked}
                  onPress={() => toggleHabit(habit.id!)}
                  className={`px-3 py-1 rounded-lg ${
                    habit.done ? "bg-gray-400" : "bg-green-500"
                  }`}
                >
                  <Text className="text-white font-medium">
                    {habit.done ? "Done" : "Mark Done"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      
    </View>
  );
};

export default HabitScreen;

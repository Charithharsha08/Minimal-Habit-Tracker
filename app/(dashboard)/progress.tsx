import { View, Text } from "react-native";
import React, { use, useEffect } from "react";
import { getCompletedHabits } from "@/services/habitService";

const Progress = () => {

  useEffect(() => {
    fetchCompletedHabits();
  }, [])


  const fetchCompletedHabits = async () => {
    const response = await getCompletedHabits();
    console.log(response);
  }

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-6">Your Progress</Text>

      {/* Streak */}
      <View className="bg-red-100 p-5 rounded-xl mb-5">
        <Text className="text-xl font-bold text-red-600">🔥 5 Day Streak</Text>
        <Text className="text-gray-600">Keep it up!</Text>
      </View>

      {/* Completed Habits */}
      <View className="bg-green-100 p-5 rounded-xl mb-5">
        <Text className="text-lg font-bold text-green-700">
          12 Habits Completed
        </Text>
        <Text className="text-gray-600">This month</Text>
      </View>

      {/* Placeholder for chart/history */}
      <View className="border border-dashed border-gray-300 p-10 rounded-xl">
        <Text className="text-gray-500 text-center">
          📊 Progress chart will go here
        </Text>
      </View>
    </View>
  );
};

export default Progress;

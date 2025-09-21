import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Habit } from "@/types/habit";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onComplete: (habitId: string) => void;
}

const ProcessingHabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  onComplete,
}) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow mb-4 flex-row justify-between items-center">
      <View className="flex-1 pr-2">
        <Text
          className={`text-lg font-semibold ${isCompleted ? "line-through text-gray-400" : "text-gray-900"}`}
        >
          {habit.title}
        </Text>
        {habit.description && (
          <Text className="text-sm text-gray-500">{habit.description}</Text>
        )}
        <Text className="text-xs text-gray-400 mt-1">
          {habit.frequency} Habit
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => onComplete(habit.id!)}
        disabled={isCompleted}
        className={`px-4 py-2 rounded-full ${isCompleted ? "bg-gray-300" : "bg-blue-500"}`}
      >
        <Text
          className={`text-white font-semibold ${isCompleted ? "text-gray-600" : ""}`}
        >
          {isCompleted ? "Done" : "Complete"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProcessingHabitCard;

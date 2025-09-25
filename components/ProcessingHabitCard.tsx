import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Habit } from "@/types/habit";
import { CheckCircle2 } from "lucide-react-native";

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
    <View className="bg-white p-5 rounded-2xl shadow-md mb-4 flex-row justify-between items-center">
      {/* Habit Info */}
      <View className="flex-1 pr-3">
        <Text
          className={`text-lg font-semibold ${
            isCompleted ? "line-through text-gray-400" : "text-gray-900"
          }`}
        >
          {habit.title}
        </Text>
        {habit.description && (
          <Text className="text-sm text-gray-500">{habit.description}</Text>
        )}
        <Text className="text-xs text-gray-400 mt-1">
          {habit.frequency} habit
        </Text>
      </View>

      {/* Complete Button */}
      <TouchableOpacity
        onPress={() => onComplete(habit.id!)}
        disabled={isCompleted}
        className={`flex-row items-center px-4 py-2 rounded-full ${
          isCompleted ? "bg-gray-200" : "bg-blue-600"
        }`}
      >
        <CheckCircle2
          size={18}
          color={isCompleted ? "#9ca3af" : "#fff"}
          style={{ marginRight: 6 }} 
        />
        <Text
          className={`font-semibold ${
            isCompleted ? "text-gray-500" : "text-white"
          }`}
        >
          {isCompleted ? "Done" : "Complete"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProcessingHabitCard;

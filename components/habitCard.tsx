import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Habit } from "@/types/habit";

type HabitCardProps = {
  data: Habit;
  onEdit?: (habit: Habit) => void;
  onDelete?: (id: string) => void;
};

const HabitCard: React.FC<HabitCardProps> = ({ data, onEdit, onDelete }) => {
  return (
    <View className="bg-white p-5 rounded-2xl mb-4 shadow-md flex-row justify-between items-center">
      {/* Left side: Habit info */}
      <View className="flex-1 pr-3">
        <Text className="text-lg font-semibold text-gray-900">
          {data.title}
        </Text>
        {data.description ? (
          <Text className="text-sm text-gray-600 mt-1">{data.description}</Text>
        ) : null}
        <Text className="text-xs text-gray-400 mt-1">
          {data.frequency} Habit
        </Text>
      </View>

      {/* Right side: Action buttons */}
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => onEdit && onEdit(data)}
          className="p-3 rounded-full mr-2 bg-blue-600"
        >
          <Entypo name="edit" size={18} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete && onDelete(data.id!)}
          className="p-3 rounded-full bg-red-500"
        >
          <Entypo name="trash" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HabitCard;

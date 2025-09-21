import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Habit } from "@/types/habit";

type HabitCardProps = {
  data: Habit;
  onEdit?: (habit: Habit) => void;
  onDelete?: (id: string) => void;
 // onComplete?: (id: string) => void;
};

const HabitCard: React.FC<HabitCardProps> = ({
  data,
  onEdit,
  onDelete,
 // onComplete,
}) => {
  return (
    <View className="bg-white p-4 rounded-xl mb-4 shadow-sm flex-row justify-between items-center">
      <View style={{ flex: 1 }}>
        <Text className="text-lg font-bold">{data.title}</Text>
        {data.description ? (
          <Text className="text-gray-600">{data.description}</Text>
        ) : null}
        <Text className="text-gray-500 mt-1">{data.frequency}</Text>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginLeft: 12 }}
      >
        {/* <TouchableOpacity
          onPress={() => onComplete && onComplete(data.id!)}
          className="p-2 rounded-full mr-2 bg-green-500"
        >
          <Entypo name="check" size={20} color="white" />
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => onEdit && onEdit(data)}
          className="p-2 rounded-full mr-2 bg-blue-600"
        >
          <Entypo name="edit" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete && onDelete(data.id!)}
          className="p-2 rounded-full bg-red-600"
        >
          <Entypo name="trash" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HabitCard;

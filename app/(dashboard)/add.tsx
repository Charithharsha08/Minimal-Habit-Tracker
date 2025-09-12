import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";

const Add = () => {
  const [habit, setHabit] = useState("");
  const [goal, setGoal] = useState("");

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-6">Add New Habit</Text>

      {/* Habit Name */}
      <Text className="text-gray-600 mb-2">Habit Name</Text>
      <TextInput
        className="border border-gray-300 rounded-xl p-3 mb-5"
        placeholder="e.g. Drink Water"
        value={habit}
        onChangeText={setHabit}
      />

      {/* Goal */}
      <Text className="text-gray-600 mb-2">Goal (optional)</Text>
      <TextInput
        className="border border-gray-300 rounded-xl p-3 mb-5"
        placeholder="e.g. 2 times/day"
        value={goal}
        onChangeText={setGoal}
      />

      {/* Save Button */}
      <Pressable className="bg-red-500 p-4 rounded-xl mt-5">
        <Text className="text-white text-center font-bold text-lg">
          Save Habit
        </Text>
      </Pressable>
    </View>
  );
};

export default Add;

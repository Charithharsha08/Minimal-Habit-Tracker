import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { createHabit } from "@/services/habitService";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";

const Add = () => {
  const [habit, setHabit] = useState("");
  const [goal, setGoal] = useState("");
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Monthly">(
    "Daily"
);

  const handleAddHabit = () => {
   try {
     if (!habit.trim()) {
       alert("Please enter a habit name.");
       return;
     }

     const newHabit = {
       title: habit,
       goal: goal || null,
       frequency,
       createdAt: new Date(),
     };

     createHabit(newHabit)
       .then(() => {
         alert("Habit added successfully!");
         setHabit("");
         setGoal("");
         setFrequency("Daily");
       })
       .catch((error) => {
         console.error("Error adding habit: ", error);
         alert("Failed to add habit. Please try again.");
       });
   } catch (error) {
     console.error("Unexpected error: ", error);
     alert("An unexpected error occurred. Please try again.");
   }
  };

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

      {/* Frequency Dropdown */}
      <Text className="text-gray-600 mb-2">Frequency</Text>
      <View className="border border-gray-300 rounded-xl mb-5">
        <Picker
          selectedValue={frequency}
          onValueChange={(itemValue) =>
            setFrequency(itemValue as "Daily" | "Weekly" | "Monthly")
          }
        >
          <Picker.Item label="Daily" value="Daily" />
          <Picker.Item label="Weekly" value="Weekly" />
          <Picker.Item label="Monthly" value="Monthly" />
        </Picker>
      </View>

      {/* Save Button */}
      <Pressable
        className="bg-red-500 p-4 rounded-xl mt-5"
        onPress={handleAddHabit}
      >
        <Text className="text-white text-center font-bold text-lg">
          Save Habit
        </Text>
      </Pressable>

      {/* Floating Add Button */}
      <Pressable
        className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg"
        onPress={() => {
          router.push("/(dashboard)/habit/new");
        }}
      >
        <Entypo name="add-to-list" size={28} color={"white"} />
      </Pressable>
      
    </View>
  );
};

export default Add;

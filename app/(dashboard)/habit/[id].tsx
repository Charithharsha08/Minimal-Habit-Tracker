import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { createHabit } from "@/services/habitService";

const HabitFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Monthly">(
    "Daily"
  );
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title) {
      alert("Please enter a habit name");
      return;
    }

    try {
      if (isNew) {
        await createHabit({
          title,
          description,
          frequency,
          createdAt: new Date(),
        });
        alert("Habit created successfully");
        router.back();
      }
    } catch (error) {
      console.error("Error saving habit:", error);
      alert("Error saving habit");
    }
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold mb-5">
        {isNew ? "Add Habit" : "Edit Habit"}
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Habit name"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
      />

      {/* Frequency Picker */}
      <Text className="text-gray-600 mb-2">Frequency</Text>
      <View className="border border-gray-300 rounded-lg mb-5">
        <Picker
          selectedValue={frequency}
          onValueChange={(val) => setFrequency(val)}
        >
          <Picker.Item label="Daily" value="Daily" />
          <Picker.Item label="Weekly" value="Weekly" />
          <Picker.Item label="Monthly" value="Monthly" />
        </Picker>
      </View>

      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4 items-center"
        onPress={handleSubmit}
      >
        <Text className="text-white font-bold">
          {isNew ? "Add Habit" : "Update Habit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HabitFormScreen;

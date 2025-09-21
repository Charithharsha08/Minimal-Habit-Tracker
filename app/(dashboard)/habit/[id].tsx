import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { createHabit, getHabitById, updateHabit } from "@/services/habitService";
import { ArrowLeft } from "lucide-react-native";

const HabitFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Monthly">(
    "Daily"
  );
  const router = useRouter();

  React.useEffect(() => {
    if (!isNew) {
      getHabitById(id as string).then((habit) => {
        if (habit) {
          setTitle(habit.title);
          setDescription(habit.description || "");
          setFrequency(habit.frequency);
        }
      });
    }
  }, []);

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
      } else {

       await updateHabit(id as string, {
          title,
          description,
          frequency,
        });
        alert("Habit updated successfully");

      }
    } catch (error) {

      console.error("Error saving habit:", error);

      if (isNew) alert("Error creating habit");
      else alert("Error updating habit");

    }finally {
      router.back();
    }
  };

  return (
    <View className="flex-1 p-5 bg-white">

      <TouchableOpacity
        className="absolute top-5 left-5 z-10 p-2 mb-5"
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="black" />
      </TouchableOpacity>

      <Text className="text-2xl font-bold mb-5 text-center">
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
        className="bg-red-500 p-4 rounded-xl mt-5 items-center"
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

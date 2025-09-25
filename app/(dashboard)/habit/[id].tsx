import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  createHabit,
  getHabitById,
  updateHabit,
} from "@/services/habitService";

type Freq = "Daily" | "Weekly" | "Monthly";

const HabitFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Freq>("Daily");

  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    if (!isNew) {
      getHabitById(id as string).then((habit) => {
        if (!mounted || !habit) return;
        setTitle(habit.title);
        setDescription(habit.description || "");
        setFrequency(habit.frequency as Freq);
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Missing info", "Please enter a habit name");
      return;
    }

    try {
      if (isNew) {
        await createHabit({
          title: title.trim(),
          description: description.trim(),
          frequency,
          createdAt: new Date(),
        });
        Alert.alert("✅ Success", "Habit created successfully!");
      } else {
        await updateHabit(id as string, {
          title: title.trim(),
          description: description.trim(),
          frequency,
        });
        Alert.alert("✅ Success", "Habit updated successfully!");
      }
      router.back();
    } catch (err) {
      console.error("Error saving habit:", err);
      Alert.alert(
        "❌ Error",
        isNew ? "Error creating habit" : "Error updating habit"
      );
    }
  };

  const freqOptions = [
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with back button */}
      <View className="flex-row items-center bg-white px-5 py-4 shadow-md">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 flex-1 text-center mr-8">
          {isNew ? "Add Habit" : "Edit Habit"}
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        {/* Habit Name */}
        <View className="bg-white rounded-2xl shadow-md p-4 mb-5">
          <Text className="text-gray-500 mb-2 font-semibold">Habit Name</Text>
          <TextInput
            className="border border-gray-300 rounded-xl p-3 bg-gray-50"
            placeholder="Enter habit name"
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="sentences"
          />
        </View>

        {/* Description */}
        <View className="bg-white rounded-2xl shadow-md p-4 mb-5">
          <Text className="text-gray-500 mb-2 font-semibold">Description</Text>
          <TextInput
            className="border border-gray-300 rounded-xl p-3 bg-gray-50"
            placeholder="Optional description"
            placeholderTextColor="#9ca3af"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Frequency */}
        <View className="bg-white rounded-2xl shadow-md p-4 mb-5">
          <Text className="text-gray-500 mb-2 font-semibold">Frequency</Text>
          <Dropdown
            data={freqOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Frequency"
            value={frequency}
            onChange={(item) => setFrequency(item.value as Freq)}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
            placeholderStyle={{ color: "#9ca3af", fontSize: 16 }}
            selectedTextStyle={{ fontSize: 16, color: "#111827" }}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className="bg-red-500 p-4 rounded-2xl mt-6 items-center shadow-md"
          onPress={handleSubmit}
        >
          <Text className="text-white font-bold text-lg">
            {isNew ? "Add Habit" : "Update Habit"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HabitFormScreen;

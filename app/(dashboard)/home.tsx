import { View, Text, FlatList, Pressable } from "react-native";
import React, { useState } from "react";

const Home = () => {
  const [habits, setHabits] = useState([
    { id: "1", name: "Drink Water", done: false },
    { id: "2", name: "Read Book", done: true },
    { id: "3", name: "Exercise", done: false },
  ]);

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    );
  };

  const completed = habits.filter((h) => h.done).length;

  return (
    <View className="flex-1 bg-white p-5">
      {/* Header */}
      <Text className="text-2xl font-bold mb-3">Today’s Habits</Text>
      <Text className="text-gray-600 mb-5">
        {completed} of {habits.length} completed ✅
      </Text>

      {/* Habits List */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggleHabit(item.id)}
            className={`p-4 mb-3 rounded-xl ${
              item.done ? "bg-green-200" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-lg ${
                item.done ? "line-through text-gray-500" : "text-black"
              }`}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
      />

      {/* Empty State */}
      {habits.length === 0 && (
        <Text className="text-gray-400 text-center mt-10">
          No habits yet. Add some from the ➕ tab.
        </Text>
      )}
    </View>
  );
};

export default Home;

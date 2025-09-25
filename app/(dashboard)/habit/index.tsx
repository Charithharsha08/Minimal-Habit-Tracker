import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { onSnapshot } from "firebase/firestore";

import { getAllHabitsByOwner, deleteHabit } from "@/services/habitService";
import { Habit } from "@/types/habit";
import { auth } from "@/firebase";
import Logo from "@/components/logo";
import HabitCard from "@/components/habitCard";

const HabitIndex = () => {
  const router = useRouter();
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("⚠️ No user logged in");
      setHabits([]);
      return;
    }

    setLoading(true);

    const q = getAllHabitsByOwner(user.uid);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Habit[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Habit),
        }));
        setHabits(list);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching habits:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleEdit = (habit: Habit) => {
    router.push(`/(dashboard)/habit/${habit.id}`);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Habit", "Are you sure you want to delete this habit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteHabit(id);
            setHabits((prev) => prev.filter((h) => h.id !== id));
            Alert.alert("✅ Success", "Habit deleted successfully.");
          } catch (err) {
            console.error("Delete failed:", err);
            Alert.alert("❌ Error", "Delete failed. Try again.");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="w-full py-6 items-center bg-white ">
        <Logo />
      </View>

      <Text className="text-2xl font-bold px-5 py-5 text-gray-900">
        Your Habits
      </Text>

      {/* Content */}
      <ScrollView
        className="px-5 mt-2"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 120 }} 
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View className="py-10 items-center ">
            <ActivityIndicator size="large" color="#ef4444" />
            <Text className="mt-3 text-gray-500">Loading habits...</Text>
          </View>
        )}

        {!loading && habits.length === 0 && (
          <Text className="text-center text-gray-500 mt-10">
            No habits yet. Tap the + button below to add one.
          </Text>
        )}

        {habits.map((h) => (
          <HabitCard
            key={h.id}
            data={h}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <Pressable
        className="absolute bottom-6 right-6 bg-red-600 p-4 rounded-full shadow-lg"
        onPress={() => {
          router.push("/(dashboard)/habit/new");
        }}
      >
        <Entypo name="add-to-list" size={28} color="white" />
      </Pressable>
    </View>
  );
};

export default HabitIndex;

import React from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import {
  getAllHabitsByOwner,
  deleteHabit,
  saveCompletedHabit,
} from "@/services/habitService";
import HabitCard from "@/components/habitCard";
import { Habit } from "@/types/habit";
import { auth } from "@/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import Logo from "@/components/logo";

const HabitIndex = () => {
  const router = useRouter();
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No user logged in");
      setHabits([]);
      return;
    }

    setLoading(true);

    const q = query(collection(db, "habits"), where("ownerId", "==", user.uid));

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
    Alert.alert("Delete habit", "Are you sure you want to delete this habit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteHabit(id);
            setHabits((prev) => prev.filter((h) => h.id !== id));
            Alert.alert("Success", "Habit deleted.");
          } catch (err) {
            console.error("Delete failed:", err);
            Alert.alert("Error", "Delete failed.");
          }
        },
      },
    ]);
  };

  // const handleComplete = async (id: string) => {
  //   try {
  //     await saveCompletedHabit(id);
  //     Alert.alert("Success", "Marked completed for this period.");
  //   } catch (err) {
  //     console.error("Complete failed:", err);
  //     Alert.alert("Error", "Could not mark complete.");
  //   }
  // };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="w-full py-5 items-center">
        <Logo />
      </View>

      <Text className="text-2xl font-bold py-5">Your All Habits</Text>

      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {loading ? <Text className="p-5">Loading...</Text> : null}

        {!loading && habits.length === 0 ? (
          <Text className="text-center text-gray-500 mt-10">
            No habits yet. Tap + to add one.
          </Text>
        ) : null}

        {habits.map((h) => (
          <HabitCard
            key={h.id}
            data={h}
            onEdit={handleEdit}
            onDelete={handleDelete}
            //onComplete={handleComplete}
          />
        ))}
      </ScrollView>

      <Pressable
        className="absolute bottom-6 right-6 bg-red-600 p-4 rounded-full shadow-lg"
        onPress={() => {
          router.push("/(dashboard)/habit/new");
        }}
      >
        <Entypo name="add-to-list" size={28} color={"white"} />
      </Pressable>
    </View>
  );
};

export default HabitIndex;
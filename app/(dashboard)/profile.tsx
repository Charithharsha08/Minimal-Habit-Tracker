import { View, Text, Pressable, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { logout } from "@/services/authService";
import { router } from "expo-router";
import { auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Pencil, Camera } from "lucide-react-native"; // icon lib (install if not already)

const Profile = () => {
  const [user, setUser] = React.useState<User | null>(auth.currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [age, setAge] = useState("22");
  const [weight, setWeight] = useState("68");
  const [height, setHeight] = useState("175");

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.replace("/(auth)/login");
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleUpdate = () => {
    // you can call API here
    setIsEditing(false);
  };

  return (
    <View className="flex-1 bg-white p-5">
      {/* Pencil button top right */}
      <TouchableOpacity
        className="absolute top-5 right-5"
        onPress={() => setIsEditing(!isEditing)}
      >
        <Pencil size={24} color="black" />
      </TouchableOpacity>

      {/* Avatar */}
      <View className="items-center">
        <View className="relative">
          <Image
            source={{
              uri: user?.photoURL || "https://i.pravatar.cc/150?img=12",
            }}
            className="w-24 h-24 rounded-full mb-4"
          />
          {isEditing && (
            <TouchableOpacity className="absolute bottom-1 right-1 bg-gray-800 p-2 rounded-full">
              <Camera size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* User Info */}
        <Text className="text-2xl font-bold">
          {user?.displayName || "No Name"}
        </Text>
        <Text className="text-gray-500 mb-6">{user?.email || "No Email"}</Text>
      </View>

      {/* Labels / Inputs */}
      <View className="w-full mt-5 space-y-4">
        {/* Age */}
        {isEditing ? (
          <TextInput
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            className="border border-gray-300 p-3 rounded-lg"
            placeholder="Enter Age"
          />
        ) : (
          <Text className="text-lg">Age: {age}</Text>
        )}

        {/* Weight */}
        {isEditing ? (
          <TextInput
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            className="border border-gray-300 p-3 rounded-lg"
            placeholder="Enter Weight"
          />
        ) : (
          <Text className="text-lg">Weight: {weight} kg</Text>
        )}

        {/* Height */}
        {isEditing ? (
          <TextInput
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            className="border border-gray-300 p-3 rounded-lg"
            placeholder="Enter Height"
          />
        ) : (
          <Text className="text-lg">Height: {height} cm</Text>
        )}
      </View>

      {/* Update button when editing */}
      {isEditing && (
        <Pressable
          className="bg-blue-500 p-4 rounded-xl mt-10 w-full"
          onPress={handleUpdate}
        >
          <Text className="text-white text-center font-bold text-lg">
            Update Changes
          </Text>
        </Pressable>
      )}

      {/* Logout */}
      {!isEditing && (
        <Pressable
          className="bg-red-500 p-4 rounded-xl mt-10 w-full"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-bold text-lg">
            Logout
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default Profile;

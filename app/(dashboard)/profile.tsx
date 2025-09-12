import { View, Text, Pressable, Image, GestureResponderEvent } from "react-native";
import React from "react";
import { logout } from "@/services/authService";
import { router } from "expo-router";

const Profile = () => {
  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");

    } catch (error) {
    }

  }

  return (
    <View className="flex-1 bg-white p-5 items-center">
      {/* Avatar */}
      <Image
        source={{ uri: "https://i.pravatar.cc/150?img=12" }}
        className="w-24 h-24 rounded-full mb-4"
      />

      {/* User Info */}
      <Text className="text-2xl font-bold">John Doe</Text>
      <Text className="text-gray-500 mb-6">john.doe@example.com</Text>

      {/* Settings */}
      <View className="w-full mt-5 space-y-4">
        <Pressable className="bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg">Edit Profile</Text>
        </Pressable>
        <Pressable className="bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg">Change Password</Text>
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable className="bg-red-500 p-4 rounded-xl mt-10 w-full"
      onPress={handleLogout}>
        <Text className="text-white text-center font-bold text-lg">Logout</Text>
      </Pressable>
    </View>
  );
};

export default Profile;

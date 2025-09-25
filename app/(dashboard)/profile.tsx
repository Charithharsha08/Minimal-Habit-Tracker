import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { router } from "expo-router";
import { logout } from "@/services/authService";
import {
  addNewUser,
  getUserByEmail,
  getUserByUid,
  updateUser,
  uploadProfilePhoto,
} from "@/services/userService";
import { UserData } from "@/types/userData";
import { Dropdown } from "react-native-element-dropdown";
import { Pencil, Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.displayName || "");
  const [age, setAge] = useState<number | null>(null);
  const [sex, setSex] = useState<"male" | "female" | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    fetchUserData();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.replace("/(auth)/login");
      }
    });

    return unsubscribe;
  }, []);

  const fetchUserData = async () => {
    if (!user?.uid) return;

    const data = await getUserByUid(user.uid);
    if (data) {
      setSex(data.sex ?? null);
      setAge(data.age);
      setWeight(data.weight);
      setHeight(data.height);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      try {
        setUploading(true);
        const url = await uploadProfilePhoto(result.assets[0].uri);
        setUser({ ...user!, photoURL: url } as User);
        Alert.alert("Success", "Profile photo updated!");
      } catch (e) {
        console.error("Upload failed", e);
        Alert.alert("Error", "Could not upload photo");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const existingUser = await getUserByEmail(user?.email || "");
      const updatedUser: UserData = {
        name,
        email,
        sex: sex ?? null,
        age: age ?? 0,
        weight: weight ?? 0,
        height: height ?? 0,
      };

      if (existingUser?.id) {
        await updateUser(existingUser.id, updatedUser);
      } else {
        await addNewUser(updatedUser);
      }

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  const sexOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 pt-14 pb-8 mb-8 rounded-b-3xl shadow-md">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-extrabold text-white">Profile</Text>
            <Text className="text-white/80">Manage your info ✨</Text>
          </View>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Pencil size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar */}
      <View className="items-center -mt-12">
        <View className="relative">
          <Image
            source={{
              uri: user?.photoURL || "https://i.pravatar.cc/150?img=12",
            }}
            className="w-28 h-28 rounded-full border-4 border-white shadow-md"
          />
          {isEditing && (
            <TouchableOpacity
              onPress={pickImage}
              className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full"
            >
              {uploading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Camera size={16} color="white" />
              )}
            </TouchableOpacity>
          )}
        </View>
        <Text className="text-2xl font-bold mt-3">
          {user?.displayName || name || "No Name"}
        </Text>
        <Text className="text-gray-500 mb-6">{user?.email || "No Email"}</Text>
      </View>

      {/* Profile Info */}
      <View className="px-5 space-y-4 mb-8">
        {/* Sex */}
        <View className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <Text className="text-gray-500 mb-2">Sex</Text>
          {isEditing ? (
            <Dropdown
              data={sexOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Sex"
              value={sex ?? undefined}
              onChange={(item) => setSex(item.value as "male" | "female")}
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              placeholderStyle={{ color: "#9ca3af", fontSize: 16 }}
              selectedTextStyle={{ fontSize: 16, color: "#111827" }}
            />
          ) : (
            <Text className="text-lg">{sex || "Not set"}</Text>
          )}
        </View>

        {/* Age */}
        <View className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <Text className="text-gray-500 mb-2">Age</Text>
          {isEditing ? (
            <TextInput
              value={age ? String(age) : ""}
              onChangeText={(text) => setAge(Number(text))}
              keyboardType="numeric"
              className="border border-gray-300 p-3 rounded-lg"
              placeholder="Enter Age"
            />
          ) : (
            <Text className="text-lg">{age ?? "Not set"}</Text>
          )}
        </View>

        {/* Weight */}
        <View className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <Text className="text-gray-500 mb-2">Weight (kg)</Text>
          {isEditing ? (
            <TextInput
              value={weight ? String(weight) : ""}
              onChangeText={(text) => setWeight(Number(text))}
              keyboardType="numeric"
              className="border border-gray-300 p-3 rounded-lg"
              placeholder="Enter Weight"
            />
          ) : (
            <Text className="text-lg">
              {weight ? `${weight} kg` : "Not set"}
            </Text>
          )}
        </View>

        {/* Height */}
        <View className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <Text className="text-gray-500 mb-2">Height (cm)</Text>
          {isEditing ? (
            <TextInput
              value={height ? String(height) : ""}
              onChangeText={(text) => setHeight(Number(text))}
              keyboardType="numeric"
              className="border border-gray-300 p-3 rounded-lg"
              placeholder="Enter Height"
            />
          ) : (
            <Text className="text-lg">
              {height ? `${height} cm` : "Not set"}
            </Text>
          )}
        </View>
      </View>

      {/* Buttons */}
      <View className="px-5 mt-8 mb-12">
        {isEditing ? (
          <Pressable
            className="bg-blue-500 p-4 rounded-xl"
            onPress={handleUpdate}
          >
            <Text className="text-white text-center font-bold text-lg">
              Save Changes
            </Text>
          </Pressable>
        ) : (
          <Pressable
            className="bg-red-400 p-4 rounded-xl"
            onPress={handleLogout}
          >
            <Text className="text-white text-center font-bold text-lg">
              Logout
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;

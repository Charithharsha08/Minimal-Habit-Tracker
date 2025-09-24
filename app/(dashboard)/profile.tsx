import { View, Text, Pressable, Image, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { use, useState } from "react";
import { logout } from "@/services/authService";
import { router } from "expo-router";
import { auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Pencil, Camera } from "lucide-react-native"; 
import { addNewUser, getUserByEmail, getUserByUid, updateUser } from "@/services/userService";
import { get } from "axios";
import { UserData } from "@/types/userData";
import { Dropdown } from "react-native-element-dropdown";
import Logo from "@/components/logo";


const Profile = () => {
  const [user, setUser] = React.useState<User | null>(auth.currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.displayName || "");
  const [age, setAge] = useState(Number);
const [sex, setSex] = useState<"male" | "female" | null>(null);
  const [weight, setWeight] = useState(Number);
  const [height, setHeight] = useState(Number);

  React.useEffect(() => {
    fetchUserData();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.replace("/(auth)/login");
      }
    });
    return unsubscribe
  }, []);

  const handleLogout = async () => {
    try {
      Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          style: "cancel",
        },
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
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // const fetchUserData = async () => {
  //   await getUserByEmail(user?.email || "")
  //     .then((data) => {
  //       if (data) {
  //         setSex(data.sex ?? null);
  //         setAge(data.age);
  //         setWeight(data.weight);
  //         setHeight(data.height);
  //       }
  //     })
  //     .catch((error) => {
  //     alert("User data not found, please update your profile.");
  //     });

  // };

  const fetchUserData = async () => {
    if (!user?.uid) return; // make sure we have a user

    const data = await getUserByUid(user.uid);
    if (data) {
      setSex(data.sex ?? null);
      setAge(data.age);
      setWeight(data.weight);
      setHeight(data.height);
    } else {
      alert("User data not found, please update your profile.");
    }
  };


  const handleUpdate = async () => {
    try {
      const existingUser = await getUserByEmail(user?.email || "");
      const updatedUser: UserData = {
        name,
        email,
        sex: sex ?? null, 
        age,
        weight,
        height,
      };

      if (existingUser?.id) {
        // Update existing profile
        await updateUser(existingUser.id, updatedUser);
      } else {
        // Create new profile (email as doc ID)
        await addNewUser(updatedUser);
      }

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating/creating user:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const sexOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];



  return (
    <View className="flex-1 bg-white p-5">
      
      <ScrollView>
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
          <Text className="text-gray-500 mb-6">
            {user?.email || "No Email"}
          </Text>
        </View>

        {/* Labels / Inputs */}

        <View className="w-full mt-5 space-y-4">
          {/* Sex */}
          {isEditing ? (
            <View className="mb-4">
              <View className="border border-gray-300 rounded-lg">
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
                  containerStyle={{ borderRadius: 8 }}
                  itemTextStyle={{ fontSize: 16, color: "#111827" }}
                />
              </View>
            </View>
          ) : (
            <Text className="text-lg">Sex: {sex ? sex : "Not set"}</Text>
          )}

          {/* Age */}
          {isEditing ? (
            <View className="mb-4">
              <Text className="text-lg mb-2">Age</Text>
              <TextInput
                value={age !== undefined && age !== null ? String(age) : ""}
                onChangeText={(text) => setAge(Number(text))}
                keyboardType="numeric"
                className="border border-gray-300 p-3 rounded-lg"
                placeholder="Enter Age"
              />
            </View>
          ) : (
            <Text className="text-lg">Age: {age}</Text>
          )}

          {/* Weight */}
          {isEditing ? (
            <View className="mb-4">
              <Text className="text-lg mb-2">Weight (kg)</Text>
              <TextInput
                value={
                  weight !== undefined && weight !== null ? String(weight) : ""
                }
                onChangeText={(text) => setWeight(Number(text))}
                keyboardType="numeric"
                className="border border-gray-300 p-3 rounded-lg"
                placeholder="Enter Weight"
              />
            </View>
          ) : (
            <Text className="text-lg">Weight: {weight} kg</Text>
          )}

          {/* Height */}
          {isEditing ? (
            <View className="mb-4">
              <Text className="text-lg mb-2">Height (cm)</Text>
              <TextInput
                value={
                  height !== undefined && height !== null ? String(height) : ""
                }
                onChangeText={(text) => setHeight(Number(text))}
                keyboardType="numeric"
                className="border border-gray-300 p-3 rounded-lg"
                placeholder="Enter Height"
              />
            </View>
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
      </ScrollView>
    </View>
  );
};

export default Profile;

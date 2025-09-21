import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { StatusBar } from "expo-status-bar";  

const Index = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/home");
      } else {
        router.push("/(auth)/login");
      }
    }
  }, [user, loading]);

  return loading ? (
    <View className="flex-1 w-full justify-center align-items-center">
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <ActivityIndicator size="large" />
    </View>
  ) : null;
};

export default Index;

import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen
        name="login"
        options={{ headerShown: false, title: "Login" }}
      />
      <Stack.Screen
        name="register"
        options={{ headerShown: false, title: "Register" }}
      />
    </Stack>
  );
};

export default AuthLayout;

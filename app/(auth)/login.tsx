import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { login } from "@/services/authService";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      console.log("Login successful");
      router.push("/home");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-2 text-gray-600">Logging in...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold text-blue-600 mb-8">
        Welcome Back 👋
      </Text>

      <TextInput
        className="border border-gray-300 rounded-xl p-3 w-full mb-4 bg-gray-50"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-gray-300 rounded-xl p-3 w-full mb-6 bg-gray-50"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        className="bg-blue-600 p-3 rounded-xl w-full mb-4 shadow-md"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Login
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/register")}>
        <Text className="text-blue-600 text-sm">
          Don't have an account? Register
        </Text>
      </Pressable>
    </View>
  );
};

export default Login;

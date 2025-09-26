// pages/(auth)/register.tsx
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { register as registerService } from "../../services/authService";
import * as Google from "expo-auth-session/providers/google";
import Logo from "@/components/logo";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "1035601014761-6gqv30ro7ib305ka3uljr73n266gc64r.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      router.push("/home");
    }
  }, [response]);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don’t match");
      return;
    }
    try {
      setLoading(true);
      await registerService(email, password, name);
      router.push("/(auth)/login");
    } catch (error: any) {
      alert(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-gray-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Logo header */}
        <View className="px-6 pt-16 pb-8 justify-center items-center bg-white">
          <Logo />
        </View>

        {/* Main content */}
        <View className="px-6 mt-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Create Account ✨
          </Text>
          <Text className="text-gray-500 mb-8 text-center">
            Start building better habits today
          </Text>

          {/* Inputs */}
          <TextInput
            className="border border-gray-300 rounded-xl p-4 mb-4 bg-white"
            placeholder="Name"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="border border-gray-300 rounded-xl p-4 mb-4 bg-white"
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="border border-gray-300 rounded-xl p-4 mb-4 bg-white"
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            className="border border-gray-300 rounded-xl p-4 mb-6 bg-white"
            placeholder="Confirm Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Register Button */}
          <Pressable
            className="bg-red-400 p-4 rounded-xl mb-4"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-white font-semibold text-lg">
                Sign Up
              </Text>
            )}
          </Pressable>

          {/* Google Button */}
          <Pressable
            onPress={() => promptAsync()}
            className="flex-row items-center border border-gray-300 rounded-xl p-4 bg-white mb-6"
          >
            <Image
              source={require("../../assets/icons/google-icon.png")}
              className="w-6 h-6 mr-3"
              resizeMode="contain"
            />
            <Text className="text-gray-700 text-lg">Continue with Google</Text>
          </Pressable>

          {/* Redirect */}
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text className="text-center text-gray-600">
              Already have an account?{" "}
              <Text className="text-red-400 font-semibold">Login</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

// pages/(auth)/login.tsx

import { View, Text, Pressable, TextInput, ActivityIndicator, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import * as Google from "expo-auth-session/providers/google";
import Logo from "@/components/logo";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Setup Google sign-in
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "<YOUR_GOOGLE_CLIENT_ID>",  // replace with yours
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      // send id_token to your server or firebase
      // after verification, navigate
      router.push("/home");
    }
  }, [response]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/profile");
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
      <Logo />

      <TextInput
        className="border border-gray-300 rounded-xl p-3 w-full mb-4 bg-gray-50"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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

      {/* Google Sign In Button */}
      <Pressable
        className="flex-row items-center border border-gray-300 rounded-xl w-full p-3 mb-4 bg-white shadow"
        onPress={() => promptAsync()}
      >
        <Image
          source={require("../../assets/icons/google-icon.png")}
          className="w-6 h-6 mr-3"
          resizeMode="contain"
        />
        <Text className="text-gray-700 text-center text-lg">
          {" "}
          Sign in with Google
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/register")}>
        <Text className="text-blue-600 text-sm">
          Don't have an account? Sign Up
        </Text>
      </Pressable>
    </View>
  );
};

export default Login;

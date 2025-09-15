// pages/(auth)/register.tsx

import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { register as registerService } from "../../services/authService";
import * as Google from "expo-auth-session/providers/google";
import Logo from "@/components/logo";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Google sign-up/use same flow
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "<YOUR_GOOGLE_CLIENT_ID>",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      // send id_token to server or firebase
      router.push("/home");
    }
  }, [response]);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await registerService(email, password);
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

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
        className="border border-gray-300 rounded-xl p-3 w-full mb-4 bg-gray-50"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        className="border border-gray-300 rounded-xl p-3 w-full mb-6 bg-gray-50"
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {loading ? (
        <ActivityIndicator color="#2563eb" size="large" />
      ) : (
        <Pressable
          className="bg-blue-600 p-3 rounded-xl w-full mb-4 shadow-md"
          onPress={handleRegister}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Sign Up
          </Text>
        </Pressable>
      )}

      {/* Google Sign Up / Use Google */}
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
          Sign up with Google
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text className="text-blue-600 text-sm">
          Already have an account? Login
        </Text>
      </Pressable>
    </View>
  );
};

export default Register;

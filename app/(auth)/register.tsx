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
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/firebase";
import Logo from "@/components/logo";

WebBrowser.maybeCompleteAuthSession();

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // ✅ Google OAuth request
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "1035601014761-nvkcl03oi0r3dlommoequgfttuvjsecu.apps.googleusercontent.com",
    iosClientId:
      "1035601014761-eo7phvr573een2j2ho7d1pfhc5b459j9.apps.googleusercontent.com",
    androidClientId:
      "1035601014761-bv0opm2cluh371ae8l5b7p294ftduj4j.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential).catch((err) => {
        console.error("Google sign-up error:", err);
        alert("Google sign-in failed");
      });
    }
  }, [response]);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don’t match");
      return;
    }
    setLoading(true);
    try {
      await registerService(email, password, name);
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
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="border border-gray-300 rounded-xl p-4 mb-4 bg-white"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="border border-gray-300 rounded-xl p-4 mb-4 bg-white"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            className="border border-gray-300 rounded-xl p-4 mb-6 bg-white"
            placeholder="Confirm Password"
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

          {/* Google Register */}
          <Pressable
            disabled={!request}
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

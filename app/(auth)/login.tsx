// pages/(auth)/login.tsx
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
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@/firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // ✅ Google OAuth request
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      ".apps.googleusercontent.com",
    iosClientId:
      ".apps.googleusercontent.com",
    androidClientId:
      ".apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential).catch((err) => {
        console.error("Google sign-in error:", err);
        alert("Google sign-in failed.");
      });
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert(error.message || "Login failed.");
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
            Welcome back 👋
          </Text>
          <Text className="text-gray-500 mb-8 text-center">
            Log in to track your daily habits
          </Text>

          {/* Inputs */}
          <TextInput
            className="border border-gray-300 rounded-xl p-4 mb-4 bg-white"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="border border-gray-300 rounded-xl p-4 mb-6 bg-white"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Email Login */}
          <Pressable
            className="bg-red-400 p-4 rounded-xl mb-4"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-white font-semibold text-lg">
                Login
              </Text>
            )}
          </Pressable>

          {/* Google Login */}
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
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text className="text-center text-gray-600">
              Don’t have an account?{" "}
              <Text className="text-red-400 font-semibold">Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

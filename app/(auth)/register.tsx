import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { register } from "../../services/authService";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await register(email, password);
      console.log("Registration successful");
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
      <Text className="text-3xl font-bold text-blue-600 mb-8">
        Create Account ✨
      </Text>

      <TextInput
        className="border border-gray-300 rounded-xl p-3 w-full mb-4 bg-gray-50"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
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
        <ActivityIndicator color="blue" size="large" />
      ) : (
        <Pressable
          className="bg-blue-600 p-3 rounded-xl w-full mb-4 shadow-md"
          onPress={handleRegister}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Register
          </Text>
        </Pressable>
      )}

      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text className="text-blue-600 text-sm">
          Already have an account? Login
        </Text>
      </Pressable>
    </View>
  );
};

export default Register;

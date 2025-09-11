import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native'
import React from 'react'
import { router, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

const login = () => {
    const router = useRouter();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log("Login successful");
                router.push('/(dashBoard)/home');
            })
            .catch((error) => {
                console.error("Login error:", error);
            });
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false);
            setEmail('');
            setPassword('');
        }
    };
        if (loading) {
            return <ActivityIndicator size="large" color="#0000ff" />;
        }

  return (
    <View className="flex-1 w-full align-items-center justify-center bg-white">
      <Text className="text-lg">Login</Text>
      <TextInput
        className="border border-gray-300 rounded p-2 w-80 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-gray-300 rounded p-2 w-80 mb-4"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable 
        className="bg-blue-500 p-3 rounded w-80 mb-4"
        onPress={handleLogin}
      >
        <Text className="text-white text-center">Login</Text>
      </Pressable>
      <Pressable
        className="bg-gray-300 p-3 rounded w-80"
        onPress={() => router.push('/(auth)/register')}
      >
        <Text className="text-black text-center">Don't have an account? Register</Text>
      </Pressable>
    </View>
  );
}

export default login
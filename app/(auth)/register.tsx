import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { register } from '../../services/authService';

const Register = () => {
    const router = useRouter();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const[loading, setLoading] = React.useState(false);

    const  handleRegister = async () => {
        if (password === confirmPassword) {
            try {
              setLoading(true);
                await register(email, password)
                .then(() => {
                    console.log("Registration successful");
                    router.push('/(auth)/login');
                })
                .catch((error) => {
                    console.error("Registration error:", error);
                })
                .finally(() => {
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                });

            } catch (error) {
                console.error("Registration error:", error);
            }
    };
  }

  return (
    <View className="flex-1 w-full align-items-center justify-center bg-white">
      <Text className="text-lg">register</Text>
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
      <TextInput
        className="border border-gray-300 rounded p-2 w-80 mb-4"
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      { loading ?(
        <ActivityIndicator color="blue" size="large" />
      ): (
      <Pressable 
        className="bg-blue-500 p-3 rounded w-80 mb-4"
        onPress={handleRegister}
      >
        <Text className="text-white text-center">Register</Text>
      </Pressable>)}
      <Pressable
        className="bg-gray-300 p-3 rounded w-80"
        onPress={() => router.push('/(auth)/login')}
      >
        <Text className="text-black text-center">Already have an account? Login</Text>
      </Pressable>
 
      
    </View>
  );
}

export default  Register;
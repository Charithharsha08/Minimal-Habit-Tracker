import React from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Header = () => {
  return (
    <View>
    <LinearGradient
      colors={["#3b82f6", "#9333ea"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-6 pt-12 pb-8 rounded-b-3xl flex-row items-center justify-between"
    >
      {/* Left side: Logo + Title */}
      <View className="flex-row items-center">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-12 h-12 rounded-2xl bg-white shadow-md mr-3"
          resizeMode="contain"
        />
        <View>
          <Text className="text-xl font-bold text-white">Minimal Habit</Text>
          <Text className="text-sm text-white/80">Track your growth 🌱</Text>
        </View>
      </View>

    </LinearGradient>
    </View>
  );
};

export default Header;

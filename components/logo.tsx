import React from "react";
import { View, Text, Image } from "react-native";

const Logo = () => {
  return (
    <View className="flex-row items-center space-x-3">
      <Image
        source={require("../assets/images/logo.png")}
        className="w-12 h-12 rounded-xl shadow-md bg-white"
        resizeMode="contain"
      />
      <View>
        <Text className="text-xl font-extrabold text-black tracking-tight px-1">
          Minimal Habit
        </Text>
        <Text className="text-xs text-black/80 px-1">Track your growth 🌱</Text>
      </View>
    </View>
  );
};

export default Logo;

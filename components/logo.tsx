import React from "react";
import { View, Text, Image } from "react-native";

const Logo = () => {
  return (
    <View className="flex-row items-center space-x-3 mb-8">
      <Image
        source={require("../assets/images/logo.png")}
        className="w-14 h-14 rounded-xl shadow-md"
        resizeMode="contain"
      />
      <Text className="text-2xl font-extrabold text-blue-700 tracking-wide">
        Minimal Habit Tracker
      </Text>
    </View>
  );
};

export default Logo;
// components/Logo.tsx

import React from "react";
import { View, Text, Image } from "react-native";

const Logo = () => {
  return (
    <View className="items-center mb-8">
      {/* If you have a logo image, use Image; else use emoji or text */}
      <Image
        source={require("../assets/images/logo.png")} 
        className="w-24 h-24 mb-2"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-blue-600">
        A Minimal Habit Tracker 😊
      </Text>
    </View>
  );
};

export default Logo;

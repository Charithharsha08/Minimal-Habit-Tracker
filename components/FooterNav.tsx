import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link, useRouter, useSegments } from "expo-router";
import { Home, User, BarChart, Plus } from "lucide-react-native";

const FooterNav = () => {
  const router = useRouter();
  const segment = useSegments();
  const activeRouter = "/" + (segment[0] || "");

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Add", href: "/add", icon: Plus },
    { name: "Progress", href: "/progress", icon: BarChart },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <View className="flex-row justify-around items-center border-t border-gray-200 bg-white py-3">
      {tabs.map((tab, index) => {
        const isActive = activeRouter === tab.href;
        const Icon = tab.icon;

        return (
          <Pressable
            key={index}
            onPress={() => router.push(tab.href)}
            className="items-center"
          >
            <Icon size={24} color={isActive ? "#ef4444" : "#6b7280"} />
            <Text
              className={`${isActive ? "text-red-500" : "text-gray-500"} text-xs mt-1`}
            >
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default FooterNav;

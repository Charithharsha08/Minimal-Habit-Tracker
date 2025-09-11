import React, { useEffect } from 'react'
import { Stack, Tabs, useRouter } from 'expo-router'
import Entypo from "@expo/vector-icons/Entypo";
import { useAuth } from '@/context/AuthContext';

const dashBoardLayout = () => {
      const { user, loading } = useAuth();

  useEffect(() => {
    const router = useRouter();
    if(!loading && !user) {
      if (!user) {
        router.push('/(auth)/login');
      }
    }
  }, [user, loading]);

  return (
    <Tabs screenOptions={{ 
        headerShown: false, 
        tabBarActiveBackgroundColor: 'black',
        tabBarInactiveBackgroundColor: 'white',
         }}>
     <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: (data) => <Entypo name="home" size={data.size} color={data.color} />,
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Entypo name="user" size={24} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

export default dashBoardLayout
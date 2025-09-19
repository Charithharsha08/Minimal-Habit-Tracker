import { View, Text, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { get } from 'axios';
import { getAllHabits } from '@/services/habitService';
import { Habit } from '@/types/habit';

const index = () => {
    const router = useRouter();
    const [habits, setHabits] = React.useState<Habit[]>();

      React.useEffect(() => {
        fetchAllHabits();
      }, []);

    const fetchAllHabits = async () => {
        try {
            console.log("start fetching habits");
            const response = await getAllHabits()
            .then((data) => setHabits(data));
            console.log("start fetching");
            console.log( "response", response);
        } catch (error) {
            console.error('Error fetching habits:', error);
        }
    };

  
  return (
    
    <View className="flex-1 bg-gray-100">
        <Text className="text-2xl font-bold p-5">Habit Tracker</Text>

        {/* <ScrollView className="px-5">
        {Array.from({ length: 20 }).map((_, index) =>
          index % 2 === 0 ? (
            <View
              key={index}
              className="bg-white p-5 rounded-xl mb-4 flex-row justify-between items-center"
            >
              <View>
                <Text className="text-lg font-bold">Drink Water</Text>
                <Text className="text-gray-600">Daily</Text>
              </View>
              <TouchableOpacity
                className="bg-blue-600 p-3 rounded-full"
                onPress={() => {}}
              >
                <Entypo name="check" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              key={index}
              className="bg-white p-5 rounded-xl mb-4 flex-row justify-between items-center opacity-50"
            >
              <View>
                <Text className="text-lg font-bold">Morning Run</Text>
                <Text className="text-gray-600">Weekly</Text>
              </View>
              <TouchableOpacity
                className="bg-gray-400 p-3 rounded-full"
                disabled
              >
                <Entypo name="check" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )
        )}  

        </ScrollView> */}



      {/* Floating Add Button */}
      <Pressable
        className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg"
        onPress={() => {
          router.push("/(dashboard)/habit/new");
        }}
      >
        <Entypo name="add-to-list" size={28} color={"white"} />
      </Pressable>
    </View>
  );
}

export default index
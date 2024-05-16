import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./components/Home/Home";
import Tour from './components/Tour/Tour';
import News from "./components/News/News";
import Booking from "./components/Tour/Booking";
import TourDetails from './components/Tour/TourDetails';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tour" component={Tour} options={{title:"Tour du lich"}} />
      <Stack.Screen name="TourDetails" component={TourDetails} options={{title:"Chi tiet tour du lich"}} />
      <Stack.Screen name="Booking" component={Booking} options={{title:"Dat tour"}} />
    </Stack.Navigator>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  )
}

export default App;


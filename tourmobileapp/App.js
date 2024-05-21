import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./components/Home/Home";
import Tour from './components/Tour/Tour';
import Booking from "./components/Tour/Booking";
import TourDetails from './components/Tour/TourDetails';
import News from "./components/News/News";
import NewsDetails from "./components/News/NewsDetails";
import Login from "./components/User/Login"
import Logout from "./components/User/Logout"
import Register from "./components/User/Register"
import Profile from "./components/User/Profile"
import { Icon } from 'react-native-paper';

const Stack = createNativeStackNavigator();

const TourStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tour" component={Tour} options={{title:"Tour du lich"}} />
      <Stack.Screen name="TourDetails" component={TourDetails} options={{title:"Chi tiet tour du lich"}} />
      <Stack.Screen name="Booking" component={Booking} options={{title:"Dat tour"}} />
    </Stack.Navigator>
  )
}

const NewsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="News" component={News} options={{title: "tin tuc du lich"}} />
      <Stack.Screen name="NewsDetails" component={NewsDetails} options={{title: "Chi tiet tin tuc"}} />
    </Stack.Navigator>
  )
}

const UserStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{title: "Dang nhap"}} />
      <Stack.Screen name="Logout" component={Logout} options={{title:"Dang xuat"}} />
      <Stack.Screen name="Register" component={Register} options={{title:"Dang ky"}} />
      <Stack.Screen name="Profile" component={Profile} options={{title:"Ho so ca nhan"}} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

const MyTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={TourStack} options={{tabBarIcon: () => <Icon size={30} color='blue' source="home" />}} />
      <Tab.Screen name="Newss" component={NewsStack} options={{tabBarIcon: () => <Icon size={30} color='blue' source="home" />}} />
      <Tab.Screen name="User" component={UserStack} options={{tabBarIcon: () => <Icon size={30} color='blue' source="home" />}} />
    </Tab.Navigator>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <MyTab />
    </NavigationContainer>
  )
}

export default App;


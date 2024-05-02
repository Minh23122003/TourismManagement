import React from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from "./components/Home/Home";
import Tour from './components/Tour/Tour';
import News from "./components/News/News";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Home} options={{title: "Trang chu"}} />
        <Drawer.Screen name="Tour" component={Tour} options={{title: "Tour du lich"}} />
        <Drawer.Screen name="News" component={News} options={{title: "Tin tuc"}} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default App;


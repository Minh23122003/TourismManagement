import React, { useContext, useReducer } from 'react';
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
import Register from "./components/User/Register"
import Profile from "./components/User/Profile"
import Cart from "./components/User/Cart"
import { Icon } from 'react-native-paper';
import { CartContext, CartDispatchContext, MyDispatchContext, MyUserContext, NewsContext, NewsDispatchContext, TourContext, TourDispatchContext } from './configs/Contexts';
import { CartReducer, MyUserReducer, NewsReducer, TourReducer } from './configs/Reducer';
import CreateTour from './components/Tour/CreateTour';
import CreateNews from './components/News/CreateNews';



const Stack = createNativeStackNavigator();

const TourStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tour" component={Tour} options={{title:"Tour du lịch"}} />
      <Stack.Screen name="TourDetails" component={TourDetails} options={{title:"Chi tiết tour du lịch"}} />
      <Stack.Screen name="Booking" component={Booking} options={{title:"Đặt tour"}} />
      <Stack.Screen name="CreateTour" component={CreateTour} options={{title:"Tạo tour du lịch"}} />
    </Stack.Navigator>
  )
}

const NewsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="News" component={News} options={{title: "Tin tức du lịch"}} />
      <Stack.Screen name="NewsDetails" component={NewsDetails} options={{title: "Chi tiết tin tức"}} />
      <Stack.Screen name='CreateNews' component={CreateNews} options={{title: "Tạo tin tức mới"}} />
    </Stack.Navigator>
  )
}

const UserStack = () => {
  return (
    <Stack.Navigator> 
        <Stack.Screen name="Login" component={Login} options={{title: "Đăng nhập"}} />
        <Stack.Screen name="Register" component={Register} options={{title:"Đăng ký"}} /> 
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

const MyTab = () => {
  const user = useContext(MyUserContext)

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={TourStack} options={{tabBarIcon: () => <Icon size={30} color='blue' source="home" />, title:"Trang chủ"}} />
      <Tab.Screen name="Newss" component={NewsStack} options={{tabBarIcon: () => <Icon size={30} color='blue' source="newspaper" />, title:"Tin tức"}} />
      {user===null?<>
        <Tab.Screen name="LogIn" component={UserStack} options={{tabBarIcon: () => <Icon size={30} color='blue' source="account-plus" />, title:"Đăng nhập"}} />
      </>:<>
      <Tab.Screen name="Cart" component={Cart} options={{tabBarIcon: () => <Icon size={30} color='blue' source="cart" />, title:"Giỏ hàng"}} />
      <Tab.Screen name="Profile" component={Profile} options={{tabBarIcon: () => <Icon size={30} color='blue' source="account-tie" />, title:"Hồ sơ"}} />
      </>}
    </Tab.Navigator>
  )
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null)
  const [cart, cartDispatch] = useReducer(CartReducer, 0)
  const [tour, tourDispatch] = useReducer(TourReducer, 0)
  const [news, newsDispatch] = useReducer(NewsReducer, 0)


  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <CartContext.Provider value={cart}>
            <CartDispatchContext.Provider value={cartDispatch}>
              <TourContext.Provider value={tour}>
                <TourDispatchContext.Provider value={tourDispatch}>
                  <NewsContext.Provider value={news}>
                    <NewsDispatchContext.Provider value={newsDispatch}>
                      <MyTab />
                    </NewsDispatchContext.Provider>
                  </NewsContext.Provider>
                </TourDispatchContext.Provider>
              </TourContext.Provider>
            </CartDispatchContext.Provider>
          </CartContext.Provider>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  )
}

export default App;


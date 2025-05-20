import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StatusBar, StyleSheet, View, Text } from "react-native";
import { scale } from "react-native-size-matters";
import { Icon } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTheme } from "./Theme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./src/Screens/Auth/Login/Login";
import Home from "./src/Screens/TabScreens/Home/Home";
import Profile from "./src/Screens/TabScreens/Profile/Profile";
import Settings from "./src/Screens/TabScreens/Settings/Settings";
import CaregiverLogin from "./src/Screens/CareGiverAuth/Login/CaregiverLogin";
import Signup from "./src/Screens/Auth/Signup/Signup";
import Users from "./src/Screens/CaregiverTab/Users/Users";
import CaregiverProfile from "./src/Screens/CaregiverTab/Profile/CaregiverProfile";
import CaregiverSettings from "./src/Screens/CaregiverTab/Settings/CaregiverSettings";
import SingleProfile from "./src/Screens/StackScreens/SingleProfile/SingleProfile";
import AddMedicine from "./src/Screens/StackScreens/AddMedicine/AddMedicine";
import RoomScreen from "./src/Screens/StackScreens/RoomScreen/RoomScreen";
import BedScreen from "./src/Screens/StackScreens/BedScreen/BedScreen";
import Ultrasonic from "./src/Screens/StackScreens/Ultrasonic/Ultrasonic";
import RecentActivity from "./src/Screens/StackScreens/RecentActivity/RecentActivity";
import MPUScreen from "./src/Screens/StackScreens/MPUScreen/MPUScreen";
import EditProfile from "./src/Screens/StackScreens/EditProfile/EditProfile";
import AllMedications from "./src/Screens/StackScreens/AllMedications/AllMedications";
import EditMedicine from "./src/Screens/StackScreens/AllMedications/EditMedicine";
import Notifications from "./src/Screens/StackScreens/Notifications/Notifications";
import PrivacyPolicy from "./src/Screens/StackScreens/PrivacyPolicy/PrivacyPolicy";
import Latency from "./src/Screens/StackScreens/LatencyScreen/LatencyScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const CaregiverTab = createBottomTabNavigator();
const TabNavigator = () => {
  const {
     Tcolor, primary, secondary, background, theme, logo, toggleTheme } =
    useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          marginBottom: 5,
        },
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0.5,

          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          paddingVertical: 5,
          height: Platform.OS == "ios" ? scale(80) : scale(70),
        },
        tabBarActiveTintColor: "#2874F0",
        tabBarInactiveTintColor: "#333",
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarInactiveTintColor: "#444",
          tabBarLabel: "Home",
          tabBarLabelStyle: {
            fontFamily: "PoppinsR",
            fontSize: scale(13),
            marginBottom: scale(5),
          },
          headerShown: false,
          tabBarActiveTintColor: primary,
          tabBarHideOnKeyboard: true,
          // animation: 'slide_from_bottom',
          tabBarIcon: ({ focused }) => (
            <Icon
              source={focused ? "home" : "home-outline"}
              size={30}
              color={focused ? primary : "#444"}
            />
          ),
        }}
        component={Home}
      />

      <Tab.Screen
        name="Profile"
        options={{
          tabBarInactiveTintColor: "#444",
          tabBarLabel: "Profile",
          tabBarLabelStyle: {
            fontFamily: "PoppinsR",
            fontSize: scale(13),

            marginBottom: scale(5),
          },
          headerShown: false,
          tabBarActiveTintColor: primary,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <Icon
              source={focused ? "account-circle" : "account-circle-outline"}
              size={30}
              color={focused ? primary : "#444"}
            />
          ),
        }}
        component={Profile}
      />

      <Tab.Screen
        name="Settings"
        options={{
          tabBarInactiveTintColor: "#444",
          tabBarLabel: "Settings",
          tabBarLabelStyle: {
            fontFamily: "PoppinsR",
            fontSize: scale(13),

            marginBottom: scale(5),
          },
          headerShown: false,
          tabBarActiveTintColor: primary,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name={focused ? "setting" : "setting"}
              size={30}
              color={focused ? primary : "#444"}
            />
          ),
        }}
        component={Settings}
      />
    </Tab.Navigator>
  );
};







const CaregiverTabNavigator = () => {
  const {
     Tcolor, primary, secondary, background, theme, logo, toggleTheme } =
    useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          marginBottom: 5,
        },
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0.5,

          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          paddingVertical: 5,
          height: Platform.OS == "ios" ? scale(80) : scale(70),
        },
        tabBarActiveTintColor: "#2874F0",
        tabBarInactiveTintColor: "#333",
      }}
    >
      <Tab.Screen
        name="Users"
        options={{
          tabBarInactiveTintColor: "#444",
          tabBarLabel: "Users",
          tabBarLabelStyle: {
            fontFamily: "PoppinsR",
            fontSize: scale(13),
            marginBottom: scale(5),
          },
          headerShown: false,
          tabBarActiveTintColor: primary,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <Icon
              source={focused ? "home" : "home-outline"}
              size={30}
              color={focused ? primary : "#444"}
            />
          ),
        }}
        component={Users}
      />

      <Tab.Screen
        name="CaregiverProfile"
        options={{
          tabBarInactiveTintColor: "#444",
          tabBarLabel: "Profile",
          tabBarLabelStyle: {
            fontFamily: "PoppinsR",
            fontSize: scale(13),

            marginBottom: scale(5),
          },
          headerShown: false,
          tabBarActiveTintColor: primary,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <Icon
              source={focused ? "account-circle" : "account-circle-outline"}
              size={30}
              color={focused ? primary : "#444"}
            />
          ),
        }}
        component={CaregiverProfile}
      />

      <Tab.Screen
        name="CaregiverSettings"
        options={{
          tabBarInactiveTintColor: "#444",
          tabBarLabel: "Settings",
          tabBarLabelStyle: {
            fontFamily: "PoppinsR",
            fontSize: scale(13),

            marginBottom: scale(5),
          },
          headerShown: false,
          tabBarActiveTintColor: primary,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name={focused ? "setting" : "setting"}
              size={30}
              color={focused ? primary : "#444"}
            />
          ),
        }}
        component={Settings}
      />
    </Tab.Navigator>
  );
};



const MainNav = () => {
  const { primary, theme } = useTheme();
  const [isAuthenticated, setisAuthenticated] = useState(null);
  const [Category, setCategory] = useState('');
  const navigationRef = useRef();

  useEffect(() => {
    const checkAuthentication = async () => {
      const a = await AsyncStorage.getItem("User");
      const parsed  = JSON.parse(a);
      const Cat = parsed?.Category
      setCategory(Cat)  
      
      // console.log('first',a)
      if (a) {

        setisAuthenticated(true);
      } else {
        setisAuthenticated(false);
      }
    };
    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "transparent" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        backgroundColor={theme === "light" ? "black" : primary}
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <StackNavigator
        isAuthenticated={isAuthenticated}
        Category={Category}
        setisAuthenticated={setisAuthenticated}
      />
    </NavigationContainer>
  );
};
const StackNavigator = ({ isAuthenticated, setisAuthenticated,Category }) => (
  <Stack.Navigator
    initialRouteName={isAuthenticated == false ? "Login" :  Category == 'Caregiver'? "CaregiverTab": "TabStart"}
    // initialRouteName="Login"
  >
    <Stack.Screen
      name="Login"
      component={Login}
      options={{
        headerShown: false,
        animation: "slide_from_left",
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name="Signup"
      component={Signup}
      options={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name="CareGiverLogin"
      component={CaregiverLogin}
      options={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: false,
      }}
    />

    <Stack.Screen
      name="TabStart"
      component={TabNavigator}
      options={{ headerShown: false, animation: "slide_from_bottom" }}
    />

<Stack.Screen
      name="SingleProfile"
      component={SingleProfile}
      options={{ headerShown: false, animation: "slide_from_bottom" }}
    />
<Stack.Screen
      name="AddMedicine"
      component={AddMedicine}
      options={{ headerShown: false, animation: "simple_push" }}
    />
    <Stack.Screen
      name="RoomScreen"
      component={RoomScreen}
      options={{ headerShown: false, animation: "simple_push" }}
    />
       <Stack.Screen
      name="BedScreen"
      component={BedScreen}
      options={{ headerShown: false, animation: "simple_push" }}
    />

<Stack.Screen
      name="Ultrasonic"
      component={Ultrasonic}
      options={{ headerShown: false, animation: "simple_push" }}
    />
    <Stack.Screen
      name="MPUScreen"
      component={MPUScreen}
      options={{ headerShown: false, animation: "simple_push" }}
    />

<Stack.Screen
      name="RecentActivity"
      component={RecentActivity}
      options={{ headerShown: false, animation: "simple_push" }}
    />
    

<Stack.Screen
      name="CaregiverTab"
      component={CaregiverTabNavigator}
      options={{ headerShown: false, animation: "slide_from_bottom" }}
    />

<Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{ headerShown: false, animation: "slide_from_bottom" }}
    />

<Stack.Screen
      name="AllMedications"
      component={AllMedications}
      options={{ headerShown: false, animation: "slide_from_bottom" }}
    />

<Stack.Screen
      name="EditMedicine"
      component={EditMedicine}
      options={{ headerShown: false, animation: "slide_from_bottom" }}
    />
    <Stack.Screen
      name="Notifications"
      component={Notifications}
      options={{ headerShown: false, animation: "slide_from_bottom" }}
    />
  <Stack.Screen
      name="Latency"
      component={Latency}
      options={{ headerShown: false, animation: "slide_from_bottom" }}
    />
        <Stack.Screen
      name="PrivacyPolicy"
      component={PrivacyPolicy}
      options={{ headerShown: false, animation: "slide_from_bottom" }}
    />
  </Stack.Navigator>
);

export default MainNav;

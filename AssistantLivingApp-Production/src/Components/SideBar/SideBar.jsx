import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../Theme";
import createStyles from "./styles";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
// import { signOut } from "firebase/auth";
// import { auth } from '../../../firebaseConfig';
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
const SideBar = () => {
  const [BG, setBG] = useState(require("../../Assets/Images/sun.jpg"));
  const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } =
    useTheme();
  const styles = createStyles({
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
    Tcolor,
  });
  const navigation = useNavigation();
  const [Logout, setLogout] = useState(false);
  const [LanguagesShow, setLanguagesShow] = useState(false);
  const [SettingsShow, setSettingsShow] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [circle1, setcircle1] = useState("#fff");
  const [circle2, setcircle2] = useState("transparent");

  const ThemeChanger = () => {
    if (theme == "light") {
      setcircle1("transparent");
      setcircle2("white");
      toggleTheme();
    }
    if (theme == "dark") {
      setcircle1("white");
      setcircle2("transparent");
      toggleTheme();
    }
  };
  const menuItems = [
    {
      iconsource: Fontisto,
      iconcolor: primary,
      icon: "persons",
      label: "About Us",
      screen: "AboutUs",
    },
    {
      iconsource: MaterialCommunityIcons,
      iconcolor: primary,
      icon: "advertisements",
      label: "Adevetise With Us",
      screen: "AdvertiseWithUs",
    },

    {
      iconsource: Octicons,
      iconcolor: Tcolor,
      icon: "code-of-conduct",
      label: "Terms and Conditions",
      screen: "TermsandConditions",
    },
    {
      iconsource: MaterialCommunityIcons,
      iconcolor: Tcolor,
      icon: "view-gallery",
      label: "Events and Gallery",
      screen: "EventsandGallery",
    },

    // { iconsource: Ionicons, iconcolor: Tcolor, icon: 'chatbox-ellipses', label: 'Chats', screen: 'Chat' },
    {
      iconsource: FontAwesome5,
      iconcolor: Tcolor,
      icon: "creative-commons-by",
      label: "Associates",
      screen: "Associates",
    },
    {
      iconsource: Entypo,
      iconcolor: Tcolor,
      icon: "newsletter",
      label: "News",
      screen: "News",
    },
  ];

  const SecondmenuItems = [
    {
      iconsource: MaterialIcons,
      iconcolor: Tcolor,
      icon: "contact-support",
      label: "Contact Us",
      screen: "ContactUs",
    },
    // { iconsource: AntDesign , iconcolor: Tcolor, icon: 'infocirlceo', label: 'About Us', screen: 'About' },
    {
      iconsource: MaterialIcons,
      iconcolor: Tcolor,
      icon: "privacy-tip",
      label: "Report a Problem",
      screen: "ReportaProblem",
    },
  ];

  const settingmenuItems = [
    {
      iconsource: MaterialCommunityIcons,
      iconcolor: Tcolor,
      icon: "theme-light-dark",
      label: "Theme",
      value: "Theme",
    },
    // { iconsource: Entypo, iconcolor: Tcolor, icon: 'language', label: 'Language', value: 'Language' },
  ];

  const language = [
    {
      iconsource: EvilIcons,
      iconcolor: Tcolor,
      icon: "search",
      label: "English (default)",
      value: "English",
    },
    {
      iconsource: Ionicons,
      iconcolor: Tcolor,
      icon: "chatbox-ellipses",
      label: "French",
      value: "French",
    },
    {
      iconsource: MaterialIcons,
      iconcolor: Tcolor,
      icon: "schedule",
      label: "German",
      value: "German",
    },
    {
      iconsource: MaterialIcons,
      iconcolor: Tcolor,
      icon: "schedule",
      label: "Urdu",
      value: "Urdu",
    },
    {
      iconsource: MaterialIcons,
      iconcolor: Tcolor,
      icon: "schedule",
      label: "Arabic",
      value: "Arabic",
    },
  ];

  const handleMenuItemPress = (screen, label) => {
    setSelectedMenuItem(label);
    navigation.navigate(screen);
  };

  const handlesettings = (value) => {
    if (value === "Language") {
      setLanguagesShow(!LanguagesShow);
    }
    if (value === "Theme") {
      ThemeChanger();
    }
  };
  const Logouter = async () => {
    try {
      console.log("Signing Out");

      // Firebase sign-out
      // await signOut(auth);

      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem("User");
      await AsyncStorage.removeItem("Name");
      await AsyncStorage.removeItem("Email-Saved");

      // Navigate to Login screen
      navigation.navigate("Login");
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };
  useEffect(() => {
    if (theme == "dark") {
      setBG(require("../../Assets/Images/star.jpg"));
    }
    if (theme == "light") {
      setBG(require("../../Assets/Images/sun.jpg"));
    }
  }, [theme]);
  return (
    <SafeAreaView style={styles.container}>
      {/* <LinearGradient   style={styles.gradient2}
        colors={[secondary, '#4fb3f6','#80d1ff']}
        start={{ x: 0, y:0 }}
        end={{ x: 1, y: 2}}> */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logo}>
          <Image style={styles.img} source={logo} />
          {/* <Text style={styles.head}>Percepco</Text> */}
        </View>
        <View style={styles.SideBar}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={index}
              style={[
                styles.menuItem,
                {
                  backgroundColor:
                    selectedMenuItem === item.label ? primary : "transparent",
                },
              ]}
              onPress={() => handleMenuItemPress(item.screen, item.label)}
            >
              {item.iconsource ? (
                <View style={styles.icon}>
                  <item.iconsource
                    name={item.icon}
                    size={24}
                    color={selectedMenuItem === item.label ? "white" : Tcolor}
                  />
                </View>
              ) : null}
              <Text
                style={[
                  styles.menuItemText,
                  { color: selectedMenuItem === item.label ? "white" : Tcolor },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* <TouchableOpacity
            activeOpacity={0.6}
            style={[
              styles.settingsfontbtn,
              { backgroundColor: SettingsShow ? primary : 'transparent' }
            ]}
            onPress={() => {
              setSettingsShow(!SettingsShow);
              setLanguagesShow(false);
            }}>
            <View style={styles.icon}>
              <AntDesign name="setting" size={24} color={SettingsShow ==true ? 'white': Tcolor} />
            </View>
            <Text style={[styles.menuItemText,
                {color: SettingsShow ==true ? 'white': Tcolor}
              ]}>Settings</Text>
            {!SettingsShow && (
              <View style={styles.icon2}>
                <MaterialIcons name="arrow-drop-down" size={24} color={SettingsShow ==true ? 'white': Tcolor} />
              </View>
            )}
            {SettingsShow && (
              <View style={styles.icon2}>
                <MaterialIcons name="arrow-drop-up" size={24} color={SettingsShow ==true ? 'white': Tcolor} />
              </View>
            )}
          </TouchableOpacity> */}

          <View style={styles.ml}>
            {SettingsShow &&
              settingmenuItems.map((item, index) => (
                <TouchableOpacity
                  activeOpacity={0.6}
                  key={index}
                  style={[
                    styles.settingsfontbtn,
                    {
                      backgroundColor:
                        selectedMenuItem === item.label
                          ? primary
                          : "transparent",
                    },
                  ]}
                  onPress={() => handlesettings(item.value)}
                >
                  {item.iconsource ? (
                    <View style={styles.iconsetting}>
                      <item.iconsource
                        name={item.icon}
                        size={24}
                        color={item.iconcolor}
                      />
                    </View>
                  ) : null}
                  <Text style={styles.settingsfont}>{item.label}</Text>

                  {
                    item.label == "Theme" && (
                      // <View style={styles.toggle}>
                      <ImageBackground style={styles.toggle} source={BG}>
                        <View
                          style={{ ...styles.round, backgroundColor: circle1 }}
                        ></View>
                        <View
                          style={{ ...styles.round, backgroundColor: circle2 }}
                        ></View>
                      </ImageBackground>
                    )
                    // </View>
                  }
                  {!LanguagesShow && item.label === "Language" && (
                    <View style={styles.icon2}>
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={24}
                        color={Tcolor}
                      />
                    </View>
                  )}
                  {LanguagesShow && item.label === "Language" && (
                    <View style={styles.icon2}>
                      <MaterialIcons
                        name="arrow-drop-up"
                        size={24}
                        color={Tcolor}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
          </View>

          <View style={styles.ml2}>
            {LanguagesShow &&
              language.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.languagebtn,
                    {
                      backgroundColor:
                        selectedMenuItem === item.label
                          ? primary
                          : "transparent",
                    },
                  ]}
                  onPress={() => handlesettings(item.value)}
                >
                  {item.iconsource ? (
                    <View style={styles.iconlanguage}>
                      <item.iconsource
                        name={item.icon}
                        size={18}
                        color={item.iconcolor}
                      />
                    </View>
                  ) : null}
                  <Text style={styles.languagefont}>{item.label}</Text>
                </TouchableOpacity>
              ))}
          </View>

          {SecondmenuItems.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={index}
              style={[
                styles.menuItem,
                {
                  backgroundColor:
                    selectedMenuItem === item.label ? primary : "transparent",
                },
              ]}
              onPress={() => handleMenuItemPress(item.screen, item.label)}
            >
              {item.iconsource ? (
                <View style={styles.icon}>
                  <item.iconsource
                    name={item.icon}
                    size={24}
                    color={selectedMenuItem === item.label ? "white" : Tcolor}
                  />
                </View>
              ) : null}
              <Text
                style={[
                  styles.menuItemText,
                  { color: selectedMenuItem === item.label ? "white" : Tcolor },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            activeOpacity={0.6}
            style={[
              styles.settingsfontbtn,
              { backgroundColor: Logout ? secondary : "transparent" },
            ]}
            onPress={() => {
              Logouter();
            }}
          >
            <View style={styles.icon}>
              <AntDesign name="setting" size={24} color={Tcolor} />
            </View>
            <Text
              style={[
                styles.menuItemText,
                { color: Logout == true ? "white" : Tcolor },
              ]}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
};

export default SideBar;

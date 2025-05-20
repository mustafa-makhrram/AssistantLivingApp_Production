import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import BottomView from "../../../Components/LoginComponents/BottomView";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [Name, setName] = useState("");
  const [token, settoken] = useState();
  const [Loader, setLoader] = useState(false);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [showpassword, setshowpassword] = useState(true);
  const [Remember, setRemember] = useState(true);
  const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } =
    useTheme();
  const styles = createStyles({
    Tcolor,
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
  });

  useEffect(() => {
    getdevicetoken();
  }, []);

  const getdevicetoken = async () => {
    let a = await messaging().getToken();
    settoken(a);

    await AsyncStorage.setItem("Token", a);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={[primary, secondary]}
          style={styles.gradient}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Text style={styles.sign}>Login</Text>
        </LinearGradient>

        <BottomView
          navigation={navigation}
          setName={setName}
          setEmail={setEmail}
          setPassword={setPassword}
          setRemember={setRemember}
          Name={Name}
          showpassword={showpassword}
          setshowpassword={setshowpassword}
          Email={Email}
          Password={Password}
          Remember={Remember}
          token={token}
        />
        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

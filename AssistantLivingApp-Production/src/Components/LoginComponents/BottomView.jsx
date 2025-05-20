import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../Theme";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { scale } from "react-native-size-matters";
import { FontAwesome5 } from "@expo/vector-icons";
import { auth } from "../../../firebaseConfig";
import createStyles from "./styles";
import CustomAlert from "../CustomAlert/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetData } from "../../utils/UserDataCalling/UserDataCalling";

import CustomDialog from "../CustomDialog/CustomDialog";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UpdateUserData } from "../../utils/LoginUpdating/LoginUpdating";

export default function BottomView({
  navigation,
  setName,
  setEmail,
  setPassword,
  setRemember,
  Name,
  Email,
  Password,
  showpassword,
  Remember,
  setshowpassword,
  token,
}) {
  const {
    Tcolor,
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
    AppName,
  } = useTheme();
  const styles = createStyles({
    Tcolor,
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
  });
  const [Loader, setLoader] = useState(false);
  const [Message, setMessage] = useState(false);
  const [MessageBox, setMessageBox] = useState("");

  const NavigatorFunc = async () => {
    // Convert email to lowercase and trim whitespace
    const LowerEmail = Email.toLowerCase().trim();

    // Validation for empty fields
    if (!Email || !Password) {
      setMessage(true);
      setMessageBox("Please fill all the fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(LowerEmail)) {
      setMessage(true);
      setMessageBox("Invalid Email format");
      return;
    }

    try {
      // Start the loader
      setLoader(true);
      console.log("Attempting login...");

      // Attempt to sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        LowerEmail,
        Password
      );
      const user = userCredential.user;

      // Save email to AsyncStorage if "Remember" is checked
      if (Remember) {
        await AsyncStorage.setItem("Email-Saved", JSON.stringify(LowerEmail));
      }

      // Fetch additional user data
      const myData = await GetData(LowerEmail);

      if (myData) {
        // Save the user data to AsyncStorage
        await AsyncStorage.setItem("User", JSON.stringify({ ...myData }));

        await UpdateUserData({
          id: LowerEmail,
          Category: myData.Category.toLowerCase(),
          login: true,
          Visibility: true,
        });

        // Stop the loader
        setLoader(false);

        // Navigate to the Home screen
        navigation.replace("TabStart", { screen: "Home" });
      }
    } catch (error) {
      setLoader(false); // Stop the loader in case of an error

      if (error.code === "auth/invalid-credential") {
        setMessage(true);
        setMessageBox("Invalid credentials. Please try again.");
      } else if (error.code === "auth/wrong-password") {
        setMessage(true);
        setMessageBox("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        setMessage(true);
        setMessageBox("User not found. Please check your email or sign up.");
      } else {
        // Generic error handling
        console.error("Error during authentication:", error);
        setMessage(true);
        setMessageBox(error.message || "An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    if (Message == true) {
      setTimeout(() => {
        setMessage(false);
      }, 1500);
    }
  }, [Message]);

  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.bottomview}>
      <CustomDialog visible={visible} hideDialog={() => setVisible(false)} />

      {Message && (
        <CustomAlert message={MessageBox} visible={Message} type="ERROR" />
      )}
      <Text style={styles.wel}>Welcome to {AppName}</Text>
      <Text style={styles.sub}>Login to Continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email Address"
        value={Email}
        onChangeText={setEmail}
      />
      <View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={Password}
          onChangeText={setPassword}
          secureTextEntry={showpassword}
        />
        <TouchableOpacity
          onPress={() => setshowpassword(!showpassword)}
          style={styles.eye}
        >
          <Feather
            name={showpassword == true ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => setRemember(!Remember)}
          style={styles.box}
        >
          <AntDesign
            name="check"
            size={15}
            color={Remember == true ? primary : background}
          />
        </TouchableOpacity>

        <Text style={styles.sub2}>Remember me ?</Text>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Text style={styles.sub3}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => NavigatorFunc()}
        activeOpacity={0.7}
        style={styles.btn}
      >
        <LinearGradient
          style={styles.gradient2}
          colors={[primary, primary, secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {Loader == false ? (
            <Text style={styles.sub4}>Sign in</Text>
          ) : (
            <FontAwesome5 name="spinner" size={24} color="white" />
          )}
        </LinearGradient>
      </TouchableOpacity>
      <View style={{ ...styles.row2, marginTop: scale(7) }}>
        <Text style={styles.gray}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.sub5}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <View style={{ ...styles.row2, marginTop: scale(7) }}>
        <Text style={styles.gray}>Continue as a </Text>
        <TouchableOpacity onPress={() => navigation.navigate("CareGiverLogin")}>
          <Text style={styles.sub5}>Caregiver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

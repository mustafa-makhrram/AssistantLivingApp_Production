import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Dialog, Portal, Button, Chip } from "react-native-paper";
import { useTheme } from "../../../Theme";
import createStyles from "./styles";
import Modal from "react-native-modal";
import CustomTextinput from "../CustomTextInput/CustomTextinput";
import { LinearGradient } from "expo-linear-gradient";
import forgotPassword from "../../utils/ForgotPassword/ForgotPassword";
const CustomDialog = ({ visible, hideDialog }) => {
  const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } =
    useTheme();
  const styles = createStyles({
    Tcolor,
    primary,
    secondary,
    background,
    theme,
  });
  const [Email, setEmail] = useState("");
  const [Loader, setLoader] = useState(false);
  const [FirstView, setFirstView] = useState(true);
  const [SecondView, setSecondView] = useState(false);
  const Submit = async () => {
    if (!Email.trim()) {
      Alert.alert("Please Enter an Email");
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      Alert.alert("Please Enter a Valid Email Address");
      return;
    }
    setLoader(true);
    // Email is valid
    const response = await forgotPassword(Email);

    if (response.success) {
      console.log(response.message);
    } else {
      console.error(response.message);
    }

    // Proceed with further logic if email is valid
    console.log("Email is valid. Proceeding...");
    setLoader(false);
    setFirstView(false);
    setSecondView(true);
    // hideDialog()
  };

  const hider = () => {
    setEmail("");
    setFirstView(true);
    setSecondView(false);
    hideDialog();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={hider}
      backdropColor="rgba(0, 0, 0, 0.9)" // Transparent black background color
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500} // Slow open duration (1000ms = 1 second)
      animationOutTiming={1000}
    >
      <View style={styles.modalbox}>
        {FirstView && (
          <View>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address to reset your password
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={Email}
              placeholderTextColor={"gray"}
              onChangeText={setEmail}
            />

            <TouchableOpacity
              onPress={Submit}
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
                  <Text style={styles.sub4}>Submit</Text>
                ) : (
                  <ActivityIndicator size="small" color="white" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {SecondView && (
          <View>
            <Text
              style={{ ...styles.subtitle, textAlign: "center", color: "red" }}
            >
              An email has been send to your Email Address to reset your
              Password
            </Text>
            <TouchableOpacity
              onPress={hider}
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
                  <Text style={styles.sub4}>Close</Text>
                ) : (
                  <ActivityIndicator size="small" color="white" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CustomDialog;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

import Modal from "react-native-modal";
import { scale } from "react-native-size-matters";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";

const PorfolioModal = ({
  isVisible,
  onBackdropPress,
  ModalFunction,
  navigation,
  Sharebtn,
  RaspberrryPiID,
}) => {
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

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropColor="rgba(0, 0, 0, 0.5)" // Transparent black background color
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500} // Slow open duration (1000ms = 1 second)
      animationOutTiming={1000}
      //   style={styles.modal}
    >
      <View style={styles.modalbox}>
        <TouchableOpacity
          onPress={() => {
            onBackdropPress();

            navigation.navigate("AddMedicine", {
              RaspberrryPiID: RaspberrryPiID,
            });
          }}
          style={{ ...styles.btn, backgroundColor: "#ddd" }}
        >
          <Text style={styles.txt}>Add Medicine</Text>
          <MaterialCommunityIcons
            name="pencil-outline"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PorfolioModal;

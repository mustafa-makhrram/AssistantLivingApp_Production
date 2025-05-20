import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function BusinessPersonPopup({ onBackdropPress }) {
  const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } = useTheme();
  const navigation = useNavigation();
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
    <View style={styles.popupContainer}>
      <TouchableOpacity
        onPress={() => {
          if (onBackdropPress) onBackdropPress();
          navigation.navigate("AddBusiness");
        }}
        style={[styles.btn, { backgroundColor: "#ddd" }]}
      >
        <Text style={styles.txt}>Add Business</Text>
        <MaterialCommunityIcons name="plus" size={24} color={primary} />
      </TouchableOpacity>

      <View style={styles.line} />

      <TouchableOpacity
        onPress={() => {
          if (onBackdropPress) onBackdropPress();
          navigation.navigate("EditBusiness");
        }}
        style={[styles.btn, { backgroundColor: "#ddd" }]}
      >
        <Text style={styles.txt}>Edit Business</Text>
        <MaterialCommunityIcons name="pencil" size={24} color={primary} />
      </TouchableOpacity>
    </View>
  );
}

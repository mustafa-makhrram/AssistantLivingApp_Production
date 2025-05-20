import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function JobsPopup({ onBackdropPress }) {
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
          navigation.navigate("AddJobs");
        }}
        style={[styles.btn, { backgroundColor: "#ddd" }]}
      >
        <Text style={styles.txt}>Add Jobs</Text>
        <MaterialCommunityIcons name="plus" size={24} color={primary} />
      </TouchableOpacity>

      <View style={styles.line} />

      <TouchableOpacity
        onPress={() => {
          if (onBackdropPress) onBackdropPress();
          navigation.navigate("EditJobs");
        }}
        style={[styles.btn, { backgroundColor: "#ddd" }]}
      >
        <Text style={styles.txt}>Edit Jobs</Text>
        <MaterialCommunityIcons name="pencil" size={24} color={primary} />
      </TouchableOpacity>
    </View>
  );
}

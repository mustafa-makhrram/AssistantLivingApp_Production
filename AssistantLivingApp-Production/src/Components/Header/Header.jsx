import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "../../../Theme";
import createStyles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export default function Header({ Heading, navigation, reload, noback }) {
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
    <View style={styles.rowcontainer}>
      {noback ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            ...styles.back,
            backgroundColor: "transparent",
            borderRadius: 0,
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="transparent"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      )}

      <Text style={styles.head}>{Heading}</Text>

      {reload ? (
        <TouchableOpacity onPress={() => reload()} style={styles.back}>
          <MaterialCommunityIcons name="reload" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => reload()}
          style={{
            ...styles.back,
            backgroundColor: "transparent",
            borderRadius: 0,
          }}
        >
          <MaterialCommunityIcons name="reload" size={24} color="transparent" />
        </TouchableOpacity>
      )}
    </View>
  );
}

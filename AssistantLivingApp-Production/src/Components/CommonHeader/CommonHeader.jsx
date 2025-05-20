import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../Theme";
import createStyles from "./styles";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import PostModal from "../Modals/PostModal/PostModal";
export default function CommonHeader({
  Title,
  navigation,
  Content,
  setContent,
  fetchAllPostqs,
  isVisiblePost,
  setisVisiblePost,
}) {
  const {
    Tcolor,
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
    gradientbg,
  } = useTheme();
  const styles = createStyles({
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
    Tcolor,
    gradientbg,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={"#fff"} />
      </TouchableOpacity>
      <Text style={styles.title}>{Title}</Text>
      <TouchableOpacity
        style={styles.back}
        onPress={() => setisVisiblePost(!isVisiblePost)}
      >
        <MaterialCommunityIcons name="plus" size={24} color={"#fff"} />
      </TouchableOpacity>
    </View>
  );
}

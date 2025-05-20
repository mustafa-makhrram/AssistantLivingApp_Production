import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../Theme";
import createStyles from "./styles";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import PostModal from "../Modals/PostModal/PostModal";
export default function CommonHeaderSingle({
  Title,
  navigation,
  Content,
  setContent,
  fetchAllPostqs,
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
  const [isVisible, setisVisible] = useState(false);
const goback = () => {
  console.log('calling goback')
  if (Title=='News'){
    navigation.navigate('News')

  }

  if (Title==='News '){
    navigation.navigate('Home');

  }
  else{
    navigation.goBack();

  }
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() =>goback()} style={styles.back}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={"#fff"} />
      </TouchableOpacity>
      <Text style={styles.title}>{Title}</Text>
      <TouchableOpacity>
        <MaterialCommunityIcons
          name="dots-grid"
          size={24}
          color={"transparent"}
        />
        <MaterialCommunityIcons name="arrow-left" size={24} color={"#fff"} />

      </TouchableOpacity>
    </View>
  );
}

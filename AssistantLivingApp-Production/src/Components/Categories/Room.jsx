import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../../Theme";
import { LinearGradient } from "expo-linear-gradient";
import createStyles from "./styles";
import {
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import fetchMyRoomStatus from "../../utils/FetchRoomStatus/FetchMyRoomStatus";

export default function Room({ navigation, disabled,RoomData,setRoomData ,RoomLoading,setRoomLoading}) {
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

  const getLatestEvent = () => {
    const now = new Date();
    return RoomData?.filter((event) => new Date(event.timestamp) <= now) // Only consider past events
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]; // Get the latest one
  };

  const latestEvent = getLatestEvent();

  return (
    <TouchableOpacity onPress={()=>navigation.navigate('RoomScreen',{
      Data:RoomData
    })} disabled={disabled} style={{ width: "49%" }}>

      {
            RoomLoading ? <ActivityIndicator size="large" color={primary} /> : 
      <LinearGradient
        colors={["#F9B2CF", "#FAC8DD"]}
        style={{ ...styles.section, width: "100%" }}
      >
        <Text style={styles.title}>Room Status</Text>
        <Text style={styles.description}>
          {latestEvent
            ? latestEvent?.roomOccupied
              ? "OCCUPIED"
              : "VACANT"
            : "No Data"}
        </Text>
        <FontAwesome6
          name={latestEvent?.roomOccupied ? "door-closed" : "door-open"}
          size={32}
          color="gray"
        />
      </LinearGradient>
}
    </TouchableOpacity>
  );
}

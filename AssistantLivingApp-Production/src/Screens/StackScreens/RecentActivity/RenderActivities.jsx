import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
export default function RenderActivities({ item }) {
  const iconcolor = "#36454F";

  const {
    Tcolor,
    primary,
    secondary,
    AppName,
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
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp); // Make sure timestamp is in milliseconds
    const options = { day: "numeric", month: "short" }; // 12 May

    const dayMonth = date.toLocaleDateString("en-US", options);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // convert to 12-hour format
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${dayMonth} ${hours}:${formattedMinutes} ${ampm}`;
  };

  const getActivityIcon = (activity) => {
    switch (activity) {
      case "MPU Detection":
        return <FontAwesome5 name="walking" size={24} color={iconcolor} />;
      case "Walking Upstairs":
        return <FontAwesome5 name="arrow-up" size={24} color={iconcolor} />;
      case "Walking Downstairs":
        return <FontAwesome5 name="arrow-down" size={24} color={iconcolor} />;
      case "Standing":
        return <FontAwesome5 name="male" size={24} color={iconcolor} />;
      case "Chair Activity":
        return <FontAwesome5 name="chair" size={24} color={iconcolor} />;
      case "Bed Activity":
        return <FontAwesome5 name="bed" size={24} color={iconcolor} />;
      case "Medication Activity":
        return <FontAwesome5 name="pills" size={24} color={iconcolor} />;
      case "Ultrasonic Activity":
        return (
          <MaterialIcons name="social-distance" size={24} color={iconcolor} />
        );
      case "Room Activity":
        return <FontAwesome5 name="door-open" size={24} color={iconcolor} />;
      default:
        return <FontAwesome5 name="circle" size={24} color={iconcolor} />;
    }
  };
  return (
    <View style={styles.box}>
      <View style={styles.rowalign}></View>

      <View key={item.id} style={styles.timelineItem}>
        <View style={styles.timelineIconContainer}>
          {getActivityIcon(item.type)}
        </View>
        <Text style={styles.title}>{item.type}</Text>

        <View style={styles.timelineContent}>
          <Text style={styles.description2}>
            at {formatTimestamp(item.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );
}

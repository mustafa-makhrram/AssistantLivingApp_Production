import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import { FontAwesome6 } from "@expo/vector-icons";
export default function RenderRoom({ item }) {
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

  // Convert timestamp to formatted date
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp); // Make sure timestamp is in milliseconds
    const options = { day: 'numeric', month: 'short' }; // 12 May
  
    const dayMonth = date.toLocaleDateString('en-US', options);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12 || 12; // convert to 12-hour format
    const formattedMinutes = minutes.toString().padStart(2, '0');
  
    return `${dayMonth} ${hours}:${formattedMinutes} ${ampm}`;
  };
  
  return (
    <View style={styles.box}>
        <View style={styles.rowalign}>
      <Text style={styles.title}>Room Status</Text>
      <Text style={styles.smalldescription}>{formatTimestamp(item.timestamp)}</Text>
      </View>
      <Text style={styles.description}>
        {item ? (item.roomOccupied ? "OCCUPIED" : "VACANT") : "No Data"}
      </Text>
      <FontAwesome6
        name={item.roomOccupied ? "door-closed" : "door-open"}
        size={32}
        color="gray"
      />
    </View>
  );
}

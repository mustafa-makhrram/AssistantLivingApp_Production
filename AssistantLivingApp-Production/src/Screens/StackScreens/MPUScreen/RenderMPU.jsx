import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { AntDesign, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import createStyles from "./styles";
import { useTheme } from "../../../../Theme";
import { ShakingAlertButton } from "../../../Components/ShakingAlertButton/ShakingAlertButton";

export default function RenderMPU({ item,token }) {
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

  // 🧠 Helper: Format Location
  const formatLocation = (location) => {
    if (!location) return '';
    const lower = location.toLowerCase();
    if (lower === 'living_room') return 'Living Room';
    if (lower === 'bed_room') return 'Bedroom';
    // Add more mappings as needed
    return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
  };

  // 🚨 Emergency Notification
  const SendEmergencyNotification = async () => {
    console.log('send unusual notification');

    if (token) {
      console.log('Sending to token:', token);
      const message = {
        to: token,
        sound: 'default',
        title: '🚨 Unusual Movement Detected',
        body: `Unusual Movement Detected. Please check in your surroundings immediately.`,
        data: {
          type: "Unusual Movement",
          Timestamp: new Date().toISOString(),
          priority: 'high',
          title: '🚨 Unusual Movement Detected',
          body: `Unusual Movement Detected. Please check in your surroundings immediately.`,
          sound: 'unusualmovement',
          channelId: 'unusual_movement_channel',
        },
      };

      try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });

        const responseJson = await response.json();
        console.log('Push notification response:', responseJson);
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    } else {
      console.warn(`No Expo token for caregiver with ID: ${caregiver.id}`);
    }
  };

  // 🕒 Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = { day: "numeric", month: "short" };
    const dayMonth = date.toLocaleDateString("en-US", options);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${dayMonth} ${hours}:${formattedMinutes} ${ampm}`;
  };

  // 🚨 Confirm Alert
  const SendAlert = () => {
    Alert.alert(
      "Send Abnormal Activity Alert",
      "Are you sure you want to send an alert?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => SendEmergencyNotification() },
      ]
    );
  };

  return (
    <View style={styles.box}>
      <View style={styles.rowalign}>
        <Text style={styles.title}>{(item.position?.toUpperCase()).toLowerCase()== 'door_side_table'? 'Door Side Table': item.position.toUpperCase()}</Text>
        <Text style={styles.smalldescription}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>

      {/* Movement Status */}
      <Text style={styles.description3}>
        {item?.movementDetected ? (
          <Text
            style={[
              styles.description2,
              item.eventType === 'unusual_movement' && { color: 'red' },
            ]}
          >
            {item.eventType === 'unusual_movement'
              ? `Unusual Movement Detected in ${formatLocation(item?.location)}`
              : `Movement Detected in ${formatLocation(item?.location)}`}
          </Text>
        ) : (
          <Text style={styles.description2}>
            No Movement Detected in {formatLocation(item?.location)}
          </Text>
        )}
      </Text>

      {/* Location */}
      <Text style={styles.description}>
        <Text style={{ ...styles.description, fontFamily: "PoppinsSB" }}>
          Location:
        </Text>{" "}
        {formatLocation(item?.location)}
      </Text>

      {/* Shake Button */}
      {item.eventType === 'unusual_movement' && (
        <ShakingAlertButton
          onPress={SendAlert}
          style={styles.btnbox}
          textStyle={styles.btntxt}
        />
      )}
    </View>
  );
}

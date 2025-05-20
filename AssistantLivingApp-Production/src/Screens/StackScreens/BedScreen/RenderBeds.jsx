import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import createStyles from './styles';
import { useTheme } from '../../../../Theme';
import { ShakingAlertButton } from '../../../Components/ShakingAlertButton/ShakingAlertButton';

export default function RenderBeds({ item ,index,token}) {
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

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = { day: 'numeric', month: 'short' };
    const dayMonth = date.toLocaleDateString('en-US', options);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${dayMonth} ${hours}:${formattedMinutes} ${ampm}`;
  };

    const SendEmergencyNotification = async () => {
    console.log('send unusual notification');

    if (token) {
      console.log('Sending to token:', token);
      const message = {
        to: token,
        sound: 'default',
        title: '🚨 Unusual Sleep Pattern Detected',
        body: `You have been detected in bed for an unusual amount of time.`,
        data: {
          type: "unusual_sleep",
          Timestamp: new Date().toISOString(),
          priority: 'high',
          title: '🚨 Unusual Sleep Pattern Detected',
          body: `You have been detected in bed for an unusual amount of time.`,
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

  // Handle Alert
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

  // Calculate if alert should be shown
  const timestampDate = new Date(item.timestamp);
  const now = new Date();
  const diffInMs = now - timestampDate;
  const diffInHours = diffInMs / (1000 * 60 * 60);

  const showAlertButton =
    (item.location === 'chair' && diffInHours > 2) ||
    (item.location === 'bed' && diffInHours > 9);

  return (
    <View style={styles.box}>
      <View style={styles.rowalign}>
        <Text style={styles.title}>Status</Text>
        <Text style={styles.description3}>{formatTimestamp(item.timestamp)}</Text>
      </View>

      <Text style={styles.description}>
        {item.status === 'occupied' ? 'Occupied' : 'Vacant'}
      </Text>

      <View style={styles.rowalign}>
        <FontAwesome6
          name={item.location === 'chair' ? 'chair' : 'bed'}
          size={32}
          color="gray"
        />

{showAlertButton && index === 0 && (
  <ShakingAlertButton
    onPress={SendAlert}
    style={styles.btnbox}
    textStyle={styles.btntxt}
  />
)}

      </View>
    </View>
  );
}

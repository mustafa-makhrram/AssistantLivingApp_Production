import { View, Text ,TouchableOpacity, Alert} from 'react-native'
import React,{useState} from 'react'
import { LinearGradient } from "expo-linear-gradient";
import createStyles from './styles'
import { useTheme } from '../../../Theme';
import fetchCaregiverData from '../../utils/FetchCaregiverData/FetchCaregiverData';
import { and, Timestamp } from '@firebase/firestore';
export default function EmergencyButton({Name}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });

 const SendEmergencyNotification = async () => {
  console.log('send emergency notification');
  const caregiverdata = await fetchCaregiverData();

  if (!caregiverdata || caregiverdata.length === 0) {
    console.log('No caregivers found.');
    return;
  }

  for (const caregiver of caregiverdata) {
    const token = caregiver.ExpoToken;

    if (token) {
      console.log('Sending to caregiver token:', token);
   const message = {
  to: token,
  sound: 'default', // ✅ Required, only 'default' is accepted
  title: '🚨 Emergency Alert',
  body: `This is an emergency alert from ${Name}. Please respond immediately.`,
  data: {
    type: "Emergency",
    Timestamp: new Date().toISOString(),
    priority: 'high',
    title: '🚨 Emergency Alert',
    body: `This is an emergency alert from ${Name}. Please respond immediately.`,
    sound: 'emergency', // ✅ We'll use this on the receiving side
    channelId: 'emergency_channel',
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
  }
};



  return (
  //  <View >
  <TouchableOpacity onPress={()=>SendEmergencyNotification()} > 
    <LinearGradient
    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      locations={[0.1, 0.5, 0.9]} 
      colors={["#e52d27", "#b31217",'#e52d27']} style={styles.section2}>
      <Text style={styles.emergencytitle}>Emergency Assistance</Text>
    </LinearGradient>
   
   </TouchableOpacity>
  )
}
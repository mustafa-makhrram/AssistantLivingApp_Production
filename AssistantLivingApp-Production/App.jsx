import React, { useRef, useEffect, useState } from 'react';
import { Alert, LogBox, StatusBar, Modal, View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import * as Notifications from "expo-notifications";
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaperProvider } from 'react-native-paper';
import { Themer } from './Theme';
import MainNav from './MainNav';
import { registerForPushNotificationsAsync } from './src/utils/RegisterforPushNotifications/RegisterforPushNotifications';

LogBox.ignoreAllLogs();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const setupNotificationChannels = async () => {
  if (Device.osName === 'Android') {
    const channels = [
      { id: 'no_movement_channel', name: 'No Movement', sound: 'nomovement' },
      { id: 'upcoming_medication_channel', name: 'Upcoming Medication', sound: 'upcomingmedication' },
      { id: 'take_medication_channel', name: 'Take Medication', sound: 'takemedication' },
      { id: 'taken_medication_channel', name: 'Medication Taken', sound: 'takenmedication' },
      { id: 'unusual_movement_channel', name: 'Unusual Movement', sound: 'unusualmovement' },
      { id: 'unusual_sleep_channel', name: 'Unusual Sleep', sound: 'unusualsleep' },
      { id: 'emergency_channel', name: 'Emergency', sound: 'emergency' },
      { id: 'notification-channel-default', name: 'Default Channel', sound: 'default' },
    ];

    for (let channel of channels) {
      await Notifications.setNotificationChannelAsync(channel.id, {
        name: channel.name,
        importance: Notifications.AndroidImportance.MAX,
        sound: channel.sound,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }
};

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationContent, setNotificationContent] = useState(null);

  useEffect(() => {
    setupNotificationChannels();
    registerForPushNotificationsAsync();

    const subscription = Notifications.addNotificationReceivedListener(async notification => {
      console.log('Notification Received:', notification);

      try {
        const recievedAt = new Date();
        const sentAt = notification?.request?.content?.data?.Timestamp  // fallback if unavailable
        const myprev = await AsyncStorage.getItem('notification');
         const latency = recievedAt - sentAt;
           const entry = {
    title: notification.request.content.title,
    body: notification.request.content.body,
    recievedAt,
    sentAt,
    latency,

  };
   // Save to AsyncStorage
  try {
    const existing = await AsyncStorage.getItem('notification_log');
    const parsed = existing ? JSON.parse(existing) : [];
    const updated = [...parsed, entry];
    await AsyncStorage.setItem('notification_log', JSON.stringify(updated));
  } catch (err) {
    console.error('❌ Failed to store notification:', err);
  }
        const parsedPrev = myprev ? JSON.parse(myprev) : [];
        const updated = [...parsedPrev, notification];
        await AsyncStorage.setItem('notification', JSON.stringify(updated));
      } catch (err) {
        console.error('❌ Failed to store notification:', err);
      }

      // Show modal with notification content
      setNotificationContent(notification.request.content);
      setModalVisible(true);
    });

    return () => subscription.remove();
  }, []);

  const [loaded] = useFonts({
    PoppinsR: require('./assets/fonts/Poppins-Regular.ttf'),
    PoppinsB: require('./assets/fonts/Poppins-Bold.ttf'),
    PoppinsSB: require('./assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsT: require('./assets/fonts/Poppins-Thin.ttf'),
    PoppinsSuper: require('./assets/fonts/Poppins-Black.ttf'),
    PoppinsM: require('./assets/fonts/Poppins-Medium.ttf'),
    PoppinsL: require('./assets/fonts/Poppins-Light.ttf'),
    AG: require('./assets/fonts/AGUIRRE.ttf')
  });

  if (!loaded) {
    return null;
  }

  return (
    <Themer>
      <PaperProvider>
        <MainNav />

        {/* Modal to show notification details */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>{notificationContent?.title}</Text>
              <Text style={styles.body}>{notificationContent?.body}</Text>
<TouchableOpacity style={{ backgroundColor: '#588c7e', padding: 10, borderRadius: 5,width:200,alignItems:"center",justifyContent:'center' }} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff', fontFamily: 'PoppinsR' }}>Okay</Text>

</TouchableOpacity>
            </View>
          </View>
        </Modal>
      </PaperProvider>
    </Themer>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontFamily: 'PoppinsB',
    fontWeight: 'bold',
    marginBottom: 10
  },
  body: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'PoppinsR',
    textAlign: 'center'
  }
});

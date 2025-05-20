import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("no_movement_channel", {
            name: "No Movement",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'nomovement',
        });

        await Notifications.setNotificationChannelAsync("upcoming_medication_channel", {
            name: "Upcoming Medication",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'upcomingmedication',

        });

        await Notifications.setNotificationChannelAsync("take_medication_channel", {
            name: "Take Medication",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'takemedication',

        });

        await Notifications.setNotificationChannelAsync("taken_medication_channel", {
            name: "Medication Taken",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'takenmedication',

        });

     await Notifications.setNotificationChannelAsync("unusual_movement_channel", {
            name: "Unusual Movement",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'unusualmovement',

        });

          await Notifications.setNotificationChannelAsync("unusual_sleep_channel", {
            name: "Unusual Sleep",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'unusualsleep',

        });

          await Notifications.setNotificationChannelAsync("emergency_channel", {
            name: "Emergency",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'emergency',

        });
     await Notifications.setNotificationChannelAsync("notification-channel-default", {
            name: "Default Channel",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'default',

        });
     
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            console.log(
                "Permission not granted to get push token for push notification!"
            );
            return null
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
        if (!projectId) {
            console.log("Project ID not found");
            return null
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log('push token ==>', pushTokenString);
            return pushTokenString;
        } catch (e) {
            console.log(`${e}`);
            return null
        }
    } else {
        console.log("Must use physical device for push notifications");
        return null
    }
}




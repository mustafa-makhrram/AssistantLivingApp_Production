import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("notification-channel-upcoming-medication", {
            name: "Upcoming Medication",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'azan1',
            enableVibrate: true,
            
        });

        await Notifications.setNotificationChannelAsync("notification-channel-time-medication", {
            name: "Take Medication",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'azan2',
            enableVibrate: true,

        });

        await Notifications.setNotificationChannelAsync("notification-channel-nottaken-medication", {
            name: "Medication Not Taken",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'azan3',
            enableVibrate: true,

        });

        await Notifications.setNotificationChannelAsync("notification-channel-missed-medication", {
            name: "Missed Medication",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'azan4',
            enableVibrate: true,

        });
     await Notifications.setNotificationChannelAsync("notification-channel-default", {
            name: "Default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: 'azan1',
            enableVibrate: true,

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
        } catch (e: unknown) {
            console.log(`${e}`);
            return null
        }
    } else {
        console.log("Must use physical device for push notifications");
        return null
    }
}




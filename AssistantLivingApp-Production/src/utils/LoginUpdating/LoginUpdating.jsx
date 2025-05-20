import { doc, updateDoc, setDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UpdateUserData = async ({ id, Category, login, Visibility }) => {
  try {
    console.log("Updating Data for ID:", id, "Category:", Category);

    const collectionName = "Users";
    if (!collectionName) {
      throw new Error("Invalid category provided.");
    }

    let fcmToken = "";
    let expoPushToken = "";

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        // Get FCM Token
        const { data: devicePushToken } = await Notifications.getDevicePushTokenAsync();
        fcmToken = devicePushToken;

        // Get Expo Push Token
        const { data: expoToken } = await Notifications.getExpoPushTokenAsync();
        expoPushToken = expoToken;

        console.log("FCM Device Push Token:", fcmToken);
        console.log("Expo Push Token:", expoPushToken);
      } else {
        console.warn("Push notification permissions not granted.");
      }
    } else {
      console.warn("Must use a physical device to get push tokens.");
    }

    // Save the tokens to AsyncStorage
    await AsyncStorage.setItem("FCMToken", fcmToken || "");
    await AsyncStorage.setItem("ExpoToken", expoPushToken || "");

    // Update the user document
    const docRef = doc(firestore, collectionName, id);
    await updateDoc(docRef, {
      Token: fcmToken || "",
      ExpoToken: expoPushToken || "",
      login: login || false,
      Visibility: Visibility || false,
    });

    console.log(`Document with ID ${id} in collection ${collectionName} updated successfully.`);

    // Save tokens in a separate Tokens collection
    const tokenDocRef = doc(firestore, "Tokens", id);
    await setDoc(tokenDocRef, {
      Token: fcmToken || "",
      ExpoToken: expoPushToken || "",
      updatedAt: new Date(),
    });

    console.log(`Tokens for ID ${id} updated successfully in the Tokens collection.`);

    return { success: true };
  } catch (error) {
    console.error("Error updating user data or token:", error);
    throw error;
  }
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert } from "react-native";
export const LocalUserData = async () => {
  const data = await AsyncStorage.getItem("User");
  console.log("Data:", data);
  const parsed = JSON.parse(data);
  return parsed;
};

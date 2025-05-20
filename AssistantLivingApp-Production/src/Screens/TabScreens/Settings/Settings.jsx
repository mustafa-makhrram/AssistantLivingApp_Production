import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LocalUserData } from "../../../utils/LocalUserData/LocalUserData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { ActivityIndicator } from "react-native-paper";

const Settings = ({ navigation }) => {
  const {
    Tcolor,
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
    VoiceAssistant,
    setVoiceAssistant,
  } = useTheme();
  const styles = createStyles({
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
    Tcolor,
  });

  const [SpeakingStatus, setSpeakingStatus] = useState(false);
  const [Data, setData] = useState({
    Profile:
      "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    DisplayName: "John Doe",
    Category: "Special User",
    RasberryPi: "Raspberry Pi 4",
    Bio: "I am a strong person trying to do my best to recover myself from illness.",
    CaregiverRemarks:
      "You are working great. Just focus on your medicines and diet.",
  });

  const ASSEMBLYAI_API_KEY = "7ffacc193c4847c1b810eed73ae431a4";
  const recordingRef = useRef(null);

  const Signout = async () => {
    try {
      await AsyncStorage.removeItem("notification");
      await AsyncStorage.removeItem("notification_log");
      await AsyncStorage.removeItem("User");
      await AsyncStorage.removeItem("Email-Saved");
      await AsyncStorage.removeItem("Token");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const ThemeSetter = async () => {
    try {
      const currentTheme = await AsyncStorage.getItem("Theme");
      if (currentTheme === "dark") {
        await AsyncStorage.setItem("Theme", "light");
        toggleTheme();
      } else {
        await AsyncStorage.setItem("Theme", "dark");
        toggleTheme();
      }
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  };

  const VoiceAssistantFunc = async () => {
    Alert.alert(
      "Voice Assistant",
      `Voice Assistant is ${VoiceAssistant ? "Enabled" : "Disabled"}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await AsyncStorage.setItem(
                "VoiceAssistant",
                VoiceAssistant ? "false" : "true"
              );
              setVoiceAssistant(!VoiceAssistant);
            } catch (error) {
              console.error("Error updating voice assistant setting:", error);
            }
          },
        },
      ]
    );
  };

  const startListening = async () => {
    setSpeakingStatus(true);
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert("Microphone permission is required");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      recordingRef.current = newRecording;

      console.log("Recording...");
    } catch (err) {
      console.error("Failed to start recording", err);
      setSpeakingStatus(false);
    }
  };

  const [Loading, setLoading] = useState(false);

  const stopListening = async () => {
    setLoading(true);
    setSpeakingStatus(false);
    try {
      const recording = recordingRef.current;
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const fileBinary = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const uploadResponse = await fetch(
        "https://api.assemblyai.com/v2/upload",
        {
          method: "POST",
          headers: {
            authorization: ASSEMBLYAI_API_KEY,
            "Content-Type": "application/octet-stream",
          },
          body: Uint8Array.from(atob(fileBinary), (c) => c.charCodeAt(0)),
        }
      );

      const { upload_url } = await uploadResponse.json();

      // Step 2: Request transcription
      const transcriptRes = await fetch(
        "https://api.assemblyai.com/v2/transcript",
        {
          method: "POST",
          headers: {
            authorization: ASSEMBLYAI_API_KEY,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            audio_url: upload_url,
          }),
        }
      );

      const { id } = await transcriptRes.json();

      // Step 3: Poll until complete
      const getTranscript = async () => {
        const res = await fetch(
          `https://api.assemblyai.com/v2/transcript/${id}`,
          {
            headers: { authorization: ASSEMBLYAI_API_KEY },
          }
        );
        const data = await res.json();
        if (data.status === "completed") return data.text;
        if (data.status === "error") throw new Error(data.error);
        return null;
      };

      let text;
      for (let i = 0; i < 20; i++) {
        text = await getTranscript();
        if (text) break;
        await new Promise((res) => setTimeout(res, 3000));
      }

      console.log("Transcript:", text);
      setLoading(false);
      if (text?.toLowerCase().includes("home")) {
        navigation.navigate("Home");
      }
      if (text?.toLowerCase().includes("profile")) {
        navigation.navigate("Profile");
      } else {
        Alert.alert("No Command Detected");
      }

      recordingRef.current = null;
    } catch (err) {
      console.error("Error during voice processing:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await LocalUserData();
        setData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {Loading == true ? (
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            left: 0,
            right: 0,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: primary,
              textAlign: "center",
              fontFamily: "PoppinsR",
            }}
          >
            Processing your Command...
          </Text>
          <ActivityIndicator size={"large"} color={primary} style={{}} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={styles.header}>
            {VoiceAssistant && (
              <TouchableOpacity
                onPress={() => {
                  if (SpeakingStatus) stopListening();
                  else startListening();
                }}
                style={styles.end}
              >
                {SpeakingStatus ? (
                  <MaterialCommunityIcons
                    name="microphone"
                    size={30}
                    color={"#ff8564"}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="microphone-off"
                    size={30}
                    color={"#fff"}
                  />
                )}
              </TouchableOpacity>
            )}

            <Text style={styles.headerText}>Settings</Text>
            <View style={styles.row}>
              <View style={styles.person}>
                <Image source={{ uri: Data?.Profile }} style={styles.logo} />
              </View>
              <View>
                <Text style={styles.titlesub}>{Data?.Name}</Text>
                <Text style={styles.titlesub2}>{Data?.Category}</Text>
              </View>
            </View>
          </View>

          <View style={styles.block}>
            {/* Notifications */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Notifications")}
              style={styles.block1}
            >
              <View style={styles.block3}>
                <View style={styles.button}>
                  <MaterialCommunityIcons
                    name="bell"
                    size={30}
                    color={"#fff"}
                  />
                </View>
                <Text style={styles.icontxt}>Notifications</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={30}
                color={"#ff8564"}
              />
            </TouchableOpacity>

            {/* Voice Assistant Toggle */}

            {Data?.Category == "Disabled/Elder User" && (
              <TouchableOpacity
                onPress={VoiceAssistantFunc}
                style={styles.block1}
              >
                <View style={styles.block3}>
                  <View
                    style={{ ...styles.button, backgroundColor: "#7889c7" }}
                  >
                    <FontAwesome5 name="microphone" size={30} color={"#fff"} />
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.icontxt}>Voice Assistant </Text>
                    {VoiceAssistant ? (
                      <MaterialCommunityIcons
                        name="toggle-switch"
                        size={85}
                        color={"#7889c7"}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="toggle-switch-off"
                        size={85}
                        color={"gray"}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {/* Privacy Policy */}
            <TouchableOpacity
              onPress={() => navigation.navigate("PrivacyPolicy")}
              style={styles.block1}
            >
              <View style={styles.block3}>
                <View style={{ ...styles.button, backgroundColor: "#d8e772" }}>
                  <MaterialIcons name="privacy-tip" size={30} color="white" />
                </View>
                <Text style={styles.icontxt}>Privacy Policy</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={30}
                color={"#d8e772"}
              />
            </TouchableOpacity>

            {/* Theme Switch */}
            <TouchableOpacity onPress={ThemeSetter} style={styles.block1}>
              <View style={styles.block3}>
                <View style={{ ...styles.button, backgroundColor: "gray" }}>
                  <MaterialCommunityIcons
                    name="theme-light-dark"
                    size={24}
                    color="black"
                  />
                </View>
                <Text style={styles.icontxt}>Dark Theme</Text>
              </View>
              {theme === "dark" ? (
                <MaterialCommunityIcons
                  name="toggle-switch"
                  size={85}
                  color={"#333"}
                />
              ) : (
                <MaterialCommunityIcons
                  name="toggle-switch-off"
                  size={85}
                  color={"gray"}
                />
              )}
            </TouchableOpacity>

            {/* Sign Out */}
            <TouchableOpacity onPress={Signout} style={styles.block1}>
              <View style={styles.block3}>
                <View style={{ ...styles.button, backgroundColor: "#e3382d" }}>
                  <Feather name="power" size={30} color="white" />
                </View>
                <Text style={styles.icontxt}>Sign Out</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={30}
                color={"#e3382d"}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Settings;

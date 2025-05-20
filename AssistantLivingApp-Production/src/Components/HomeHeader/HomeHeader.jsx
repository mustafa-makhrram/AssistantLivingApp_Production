import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../../../Theme";
import createStyles from "./styles";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function HomeHeader({
  Test,
  Loading,
  setLoading,
  Profile,
  navigation,
  SpeechAllowed,
}) {
  const {
    Tcolor,
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
    gradientbg,
    VoiceAssistant,
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
  const [SpeakingStatus, setSpeakingStatus] = useState(false);
  const ASSEMBLYAI_API_KEY = "7ffacc193c4847c1b810eed73ae431a4";
  const recordingRef = useRef(null);
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
      } else if (text?.toLowerCase().includes("settings")) {
        navigation.navigate("Settings");
      } else if (text?.toLowerCase().includes("profile")) {
        navigation.navigate("Profile");
      } else {
        Alert.alert("No Command Detected");
      }

      recordingRef.current = null;
    } catch (err) {
      console.error("Error during voice processing:", err);
    }
  };
  console.log(Profile);

  return (
    <View style={styles.rowcontainer}>
      <TouchableOpacity style={styles.round}>
        <Image source={{ uri: Profile }} style={styles.person} />
      </TouchableOpacity>
      <View style={styles.row}>
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
      </View>
    </View>
  );
}

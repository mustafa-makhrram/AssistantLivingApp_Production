import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import PorfolioModal from "../../../Components/Modals/ProfileModals/ProfileModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmergencyButton from "../../../Components/Categories/EmergencyButton";
import { LocalUserData } from "../../../utils/LocalUserData/LocalUserData";
const CaregiverProfile = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
  const [isVisible, setisVisible] = useState(false);

  const [Data, setData] = useState([]);

  const Sharebtn = async (item) => {
    Share.share({
      message: `Hi, I am ${Data?.DisplayName} using ${AppName}. Connect with me on ${AppName}.`,
    })
      .then((result) => {
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log(`Shared via ${result.activityType}`);
          } else {
            console.log("Shared successfully");
          }
        } else if (result.action === Share.dismissedAction) {
          console.log("Share dismissed");
        }
      })
      .catch((error) => {
        console.error("Error sharing:", error.message);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await LocalUserData();
        console.log("data of profile", data);
        setData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);
  const ModalOpener = () => {
    setisVisible(!isVisible);
  };
  return (
    <View style={styles.container}>
      <PorfolioModal
        navigation={navigation}
        isVisible={isVisible}
        Sharebtn={Sharebtn}
        onBackdropPress={ModalOpener}
        ModalFunction={ModalOpener}
      />

      <SafeAreaView style={styles.absoluterow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={"#fff"} />
        </TouchableOpacity>
      </SafeAreaView>
      <Image source={{ uri: Data?.Profile }} style={styles.profileImage} />

      <View style={styles.bottombox}>
        <Text style={styles.name}>{Data?.Name}</Text>
        <Text style={styles.aboutme}>{Data?.Category}</Text>
        <Text style={styles.aboutme}>
          I am a dedicated caregiver for elderly and disabled patients,
          committed to providing compassionate and respectful care every day. I
          take my responsibilities seriously, ensuring the safety, comfort, and
          dignity of those I support. With patience, empathy, and attention to
          detail, I strive to improve their quality of life and build trusting
          relationships with both patients and their families.
        </Text>
      </View>
    </View>
  );
};

export default CaregiverProfile;

import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
  Keyboard,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import CustomTextinput from "../../../Components/CustomTextInput/CustomTextinput";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomAlert from "../../../Components/CustomAlert/CustomAlert";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage } from "../../../../firebaseConfig";

export default function PersonalInfo({
  RaspberrryPiID,
  RaspberrryPiID1,
  RaspberrryPiID2,

  setRaspberryPiID1,
  setRaspberryPiID2,

  EmergencyContact,
  
  setEmergencyContact,
  setRaspberryPiID,
  visiblealert,
  setvisiblealert,
  navigation,
  ProfileImage,
  Category,
  EditProfile,
  setProfileImage,
  showDatePicker,
  formatDate,
  date,
  showPicker,
  handlePickerChange,
  name,
  setName,
  Bio,
  AccountActivator,
  setBio,
  CaregiverRemarks,
  setCaregiverRemarks,
  Gender,
  setGender,
  Email,
  setEmail,
  Password,
  setPassword,
  ConfirmPassword,
  setConfirmPassword,
  showpassword,
  setshowpassword,
  Loader,
  setLoader,
  Message,
  setMessage,
  confirmshowpassword,
  setconfirmshowpassword,
  pickerMode,
}) {
  const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } = useTheme();
  const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor });

  const [SampleImage, setSampleImage] = useState(
    "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
  );
  const [Keyboardopen, setKeyboardopen] = useState(false);


  const handleValueChange = (value) => {
    setGender(value);
  };

  const ProfilePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  console.log('aler t',visiblealert)
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardopen(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardopen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

useEffect(()=>{

  const handleAlert = () => {
    setRaspberryPiID([
      RaspberrryPiID1,
      RaspberrryPiID2,
    ])
  }

  handleAlert()
},[RaspberrryPiID1,RaspberrryPiID2])

  return (
    <View>
      <View style={styles.imagecontainer}>
        <Image
          source={ProfileImage ? { uri: ProfileImage } : { uri: SampleImage }}
          style={styles.image}
        />

        <TouchableOpacity onPress={ProfilePicker} style={styles.edit}>
          <MaterialCommunityIcons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <CustomTextinput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        Importance={true}
      />

      <CustomDropdown
        data={["Male", "Female"]}
        placeholder="Select Gender"
        selectedValue={Gender}
        onValueChange={handleValueChange}
      />

      <Text style={styles.input3}>Date of Birth:</Text>

      <TouchableOpacity onPress={showDatePicker} style={styles.input}>
        <Text style={styles.input2}>{formatDate(date)}</Text>
        <Ionicons name="calendar" size={20} color="gray" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          themeVariant={theme}

          maximumDate={new Date()}
          mode={pickerMode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handlePickerChange}
        />
      )}

      <CustomTextinput
        placeholder="Raspberry Pi ID 1" 
        value={RaspberrryPiID1}
        onChangeText={setRaspberryPiID1}
        Importance={true}
      />

<CustomTextinput
        placeholder="Raspberry Pi ID 2"
        value={RaspberrryPiID2}
        onChangeText={setRaspberryPiID2}
        Importance={true}
      />
      <CustomTextinput
        placeholder="About Me"
        value={Bio}
        onChangeText={setBio}
        Importance={true}
      />
   <CustomTextinput
        placeholder="Emergency Contact"
        value={EmergencyContact}
        onChangeText={setEmergencyContact}
        Importance={true}
      />

{
  !EditProfile && 
  <CustomTextinput
  placeholder="Email"
  value={Email}
  onChangeText={setEmail}
  Importance={true}
/>
}
    

      {!EditProfile && (
        <>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={Password}
              onChangeText={setPassword}
              secureTextEntry={showpassword}
            />
            <TouchableOpacity
              onPress={() => setshowpassword(!showpassword)}
              style={styles.eye}
            >
              <Feather
                name={showpassword ? "eye-off" : "eye"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <View>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={ConfirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={confirmshowpassword}
            />
            <TouchableOpacity
              onPress={() => setconfirmshowpassword(!confirmshowpassword)}
              style={styles.eye}
            >
              <Feather
                name={confirmshowpassword ? "eye-off" : "eye"}
                size={20}
                color={Password === ConfirmPassword ? "gray" : "red"}
              />
            </TouchableOpacity>
          </View>
        </>
      )}

      {
        EditProfile &&   <Text style={styles.input4}>
        Changes will be reflected when you Relogin to your account.
        </Text>
      }
    
      {Keyboardopen && <View style={{ height: 210 }} />}

      <TouchableOpacity
        onPress={AccountActivator}
        activeOpacity={0.7}
        style={styles.btn}
      >
        <LinearGradient
          style={styles.gradient2}
          colors={[primary, primary, secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {!Loader ? (
            <Text style={styles.sub4}>
              {EditProfile ? "Update" : "Sign up"}
            </Text>
          ) : (
            <FontAwesome5 name="spinner" size={24} color="white" />
          )}
        </LinearGradient>
      </TouchableOpacity>

      {visiblealert && (
        <CustomAlert visible={visiblealert} message={Message} type="ERROR" />
      )}
    </View>
  );
}

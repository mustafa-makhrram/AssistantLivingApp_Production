import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import React, { useState } from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import PersonalInfo from "./PersonalInfo";
import { Entypo } from "@expo/vector-icons";
import { SignUpWithEmailPassword } from "../../../utils/RegisteringUserData/SignupwithEmail";

import { RegisteringUserData } from "../../../utils/RegisteringUserData/RegisteringUserData";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Signup = ({ navigation }) => {
  const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } =
    useTheme();
  const styles = createStyles({
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
    Tcolor,
  });

  const [name, setName] = useState("");
  const [EmergencyContact, setEmergencyContact] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [PersonalInfoActive, setPersonalInfoActive] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
  const [Category, setCategory] = useState("Disabled/Elder User");
  const [RaspberrryPiID1, setRaspberryPiID1] = useState("");
  const [RaspberrryPiID2, setRaspberryPiID2] = useState("");
  const [RaspberrryPiID, setRaspberryPiID] = useState([
    RaspberrryPiID1,
    RaspberrryPiID2,
  ]);

  const [Bio, setBio] = useState("");
  const [CaregiverRemarks, setCaregiverRemarks] = useState("No Remarks yet.");
  const [Gender, setGender] = useState(null);
  const showDatePicker = () => {
    setPickerMode("date");
    setShowPicker(!showPicker);
  };

  const handlePickerChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    setShowPicker(false);
    setDate(selectedDate || date);
  };

  const formatDate = (date) => {
    return date.toDateString(); // This will return a formatted date like "Wed Apr 24 2024"
  };

  // console.log('formater', formatDate(date))
  const [Message, setMessage] = useState("");
  const [Loader, setLoader] = useState(false);

  const [visiblealert, setvisiblealert] = useState(false);
  const [showpassword, setshowpassword] = useState(true);
  const [confirmshowpassword, setconfirmshowpassword] = useState(true);
  const [ProfileImage, setProfileImage] = useState(null);

  const AccountActivator = async () => {
    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (Password !== ConfirmPassword) {
      setMessage("Password does not match");
      setvisiblealert(true);
      setTimeout(() => setvisiblealert(false), 1800);
      return;
    }

    const requiredFields = [
      Email,
      Password,
      ConfirmPassword,
      RaspberrryPiID1,
      RaspberrryPiID2,
      name,
      Bio,
    ];

    const isEmptyField = requiredFields.some((field) => field.trim() === "");

    if (
      isEmptyField ||
      !Gender ||
      !ProfileImage ||
      !date ||
      RaspberrryPiID.length < 2
    ) {
      setMessage("Please fill all the fields");
      setvisiblealert(true);
      setTimeout(() => setvisiblealert(false), 1800);
      return;
    }

    if (!isEmailValid(Email)) {
      setMessage("Invalid email format");
      setvisiblealert(true);
      setTimeout(() => setvisiblealert(false), 1800);
      return;
    }

    setLoader(true);
    try {
      const user = await SignUpWithEmailPassword(Email.toLowerCase(), Password);
      console.log("User created:", user);
      const imageRef = ref(storage, `ProfileImages/${Email}`); // Unique path for each user's profile image
      const response = await fetch(ProfileImage); // Fetch image from the URI
      const blob = await response.blob(); // Convert image to blob

      await uploadBytes(imageRef, blob); // Upload image to Firebase Storage
      const downloadURL = await getDownloadURL(imageRef);

      console.log("CAT IS", Category);
      const result = await RegisteringUserData({
        Profile: downloadURL,
        EmergencyContact: EmergencyContact,
        Bio: Bio,
        CaregiverRemarks,
        Name: name,
        Category,
        RaspberrryPiID,
        Email: Email.toLowerCase(),
        Password,
        ConfirmPassword,
        name,
        Gender,
        formatDate: formatDate(date),
      });

      if (result) {
        await AsyncStorage.setItem("UserCreated", "true");
        setLoader(false);
        navigation.navigate("Login");
      } else {
        throw new Error("Something went wrong while saving user data");
      }
    } catch (error) {
      setLoader(false);
      setMessage(error.message || "An error occurred");
      setvisiblealert(true);
      setTimeout(() => setvisiblealert(false), 1800);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.block}>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              {/* <AntDesign name="left" size={24} color="black" /> */}
              <Entypo name="chevron-left" size={40} color={Tcolor} />
            </TouchableOpacity>
            <Text style={styles.name}>Create an Account</Text>
          </View>

          <Text style={styles.para}>Sign up to get started!</Text>
        </View>

        {PersonalInfoActive && (
          <PersonalInfo
            EmergencyContact={EmergencyContact}
            setLoader={setLoader}
            Loader={Loader}
            setMessage={setMessage}
            Message={Message}
            setEmergencyContact={setEmergencyContact}
            AccountActivator={AccountActivator}
            visiblealert={visiblealert}
            setvisiblealert={setvisiblealert}
            Email={Email}
            setEmail={setEmail}
            Password={Password}
            setPassword={setPassword}
            ConfirmPassword={ConfirmPassword}
            setConfirmPassword={setConfirmPassword}
            showpassword={showpassword}
            setshowpassword={setshowpassword}
            confirmshowpassword={confirmshowpassword}
            setconfirmshowpassword={setconfirmshowpassword}
            Bio={Bio}
            setBio={setBio}
            CaregiverRemarks={CaregiverRemarks}
            setCaregiverRemarks={setCaregiverRemarks}
            navigation={navigation}
            RaspberrryPiID={RaspberrryPiID}
            setRaspberryPiID={setRaspberryPiID}
            RaspberrryPiID1={RaspberrryPiID1}
            setRaspberryPiID1={setRaspberryPiID1}
            RaspberrryPiID2={RaspberrryPiID2}
            setRaspberryPiID2={setRaspberryPiID2}
            ProfileImage={ProfileImage}
            setProfileImage={setProfileImage}
            PersonalInfoActive={PersonalInfoActive}
            setPersonalInfoActive={setPersonalInfoActive}
            Category={Category}
            setCategory={setCategory}
            showDatePicker={showDatePicker}
            formatDate={formatDate}
            showPicker={showPicker}
            pickerMode={pickerMode}
            date={date}
            handlePickerChange={handlePickerChange}
            name={name}
            setName={setName}
            Gender={Gender}
            setGender={setGender}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;

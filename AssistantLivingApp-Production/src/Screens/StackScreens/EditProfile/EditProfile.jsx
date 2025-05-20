import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../Theme";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import createStyles from "./styles";
import {  Entypo } from "@expo/vector-icons";
import PersonalInfo from "../../Auth/Signup/PersonalInfo";
import { LocalUserData } from "../../../utils/LocalUserData/LocalUserData";
import { RegisteringUserData } from "../../../utils/RegisteringUserData/RegisteringUserData";
import { UpdatingData } from "../../../utils/UpdatingData/UpdatingData";
import AsyncStorage from "@react-native-async-storage/async-storage";
const EditProfile = ({ navigation }) => {
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
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [PersonalInfoActive, setPersonalInfoActive] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
const [Category,setCategory] = useState('Disabled/Elder User')
const [RaspberrryPiID1,setRaspberryPiID1] = useState()
const [RaspberrryPiID2,setRaspberryPiID2] = useState()
const [RaspberrryPiID,setRaspberryPiID] = useState([
  RaspberrryPiID1,
  RaspberrryPiID2,
])


const [Bio,setBio] = useState('')
  const [visiblealert, setvisiblealert] = useState(false);
const [EmergencyContact, setEmergencyContact] = useState('')
const [CaregiverRemarks,setCaregiverRemarks] = useState('No Remarks yet.')
const[Gender,setGender] = useState(null)
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




  const [showpassword, setshowpassword] = useState(true);
  const [confirmshowpassword, setconfirmshowpassword] = useState(true);
  const [ProfileImage, setProfileImage] = useState(null);
  const [Message, setMessage] = useState("");
const [Loader, setLoader] = useState(false);
  const [Data, setData] = useState([null]);

  const AccountActivator = async () => {
    const requiredFields = [
      name,
      RaspberrryPiID1,
      RaspberrryPiID2,
      Bio,
      EmergencyContact,
    ];
  
    const isEmptyField = requiredFields.some((field) => field.trim() === "");
  
    if (isEmptyField || !Gender || !ProfileImage || !date || RaspberrryPiID.length < 2) {
      setMessage("Please fill all the fields");
      setvisiblealert(true);
      setTimeout(() => setvisiblealert(false), 1800);
      return;
    }
  
    setLoader(true);
    try {
      let finalProfileURL = ProfileImage;
  
      if (ProfileImage !== Data?.Profile) {
        const imageRef = ref(storage, `ProfileImages/${Email}`);
        const response = await fetch(ProfileImage);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        finalProfileURL = await getDownloadURL(imageRef);
      }
  console.log('THE EMAIL IS ',Email)
      const result = await UpdatingData({
        Email,
        Profile: finalProfileURL,
        EmergencyContact,
        Bio,
        CaregiverRemarks,
        Name: name,
        Category,
        RaspberrryPiID,
        Password,
        ConfirmPassword,
        Gender,
        formatDate: formatDate(date),
      });
  
      if (result) {
        await AsyncStorage.setItem("UserCreated", "true");
        navigation.goBack();
        setMessage("User Updated Successfully");
      } else {
        throw new Error("Something went wrong while updating user data");
      }
    } catch (error) {
      setMessage(error.message || "An error occurred");
      setvisiblealert(true);
      setTimeout(() => setvisiblealert(false), 1800);
    } finally {
      setLoader(false);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await LocalUserData();
        setData(data);
        console.log("data", data);
        setName(data.Name);
        setEmail(data?.id);
        console.log('THE EMAIL COMING FROM DATA',data?.id)
        setGender(data.Gender)
        setProfileImage(data.Profile);
        setRaspberryPiID1(data.RaspberrryPiID[0]);
        setRaspberryPiID2(data.RaspberrryPiID[1]);
        setBio(data.Bio);
        setDate(new Date(data.Dob));
        setEmergencyContact(data.EmergencyContact);
        setCaregiverRemarks(data.CaregiverRemarks);
      }
        catch (error) {
        console.error("Error fetching user data:", error);
        }
        };
        fetchData();
        }
        , []);
        
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
      showsVerticalScrollIndicator={false}
      >
      <View style={styles.block}>
        <View style={styles.row}>
<TouchableOpacity onPress={() => navigation.goBack()}>
{/* <AntDesign name="left" size={24} color="black" /> */}
<Entypo name="chevron-left" size={40} color={Tcolor} />
</TouchableOpacity>
        <Text style={styles.name}>Edit Profile</Text>
        </View>

      </View>

      {PersonalInfoActive && (
        <PersonalInfo
        visiblealert={visiblealert}
        Loader={Loader}
        RaspberrryPiID1={RaspberrryPiID1}
        setRaspberryPiID1={setRaspberryPiID1}
        RaspberrryPiID2={RaspberrryPiID2}
        setRaspberryPiID2={setRaspberryPiID2}
        setLoader={setLoader}
        setMessage={setMessage}
        Message={Message}
        AccountActivator={AccountActivator}
        EditProfile={true}
        EmergencyContact={EmergencyContact}
        setEmergencyContact={setEmergencyContact}
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

export default EditProfile;

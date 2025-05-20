import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import Header from "../../../Components/Header/Header";
import CustomTextinput from "../../../Components/CustomTextInput/CustomTextinput";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CustomAlert from "../../../Components/CustomAlert/CustomAlert";
import AddMedicines from "../../../utils/AddMedicines/AddMedicines";
import { SensorType } from "react-native-reanimated";

const AddMedicine = ({ navigation,route }) => {
  const { RaspberrryPiID } = route.params;
  const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } =
    useTheme();
  const styles = createStyles({
    Tcolor,
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
  });
  const [MedicineName, setMedicineName] = React.useState("");
  const [Dosage, setDosage] = React.useState("");
  const [Message, setMessage] = React.useState("");
  const [AlertVisible, setAlertVisible] = React.useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
  const [SideEffects, setSideEffects] = React.useState("");
  const [Instructions, setInstructions] = React.useState("");
  const [MedicationTime, setMedicationTime] = React.useState(new Date());
  console.log('THE DATE IS',MedicationTime)
  const [MedicineStorageCondition, setMedicineStorageCondition] =React.useState("");
  const [StartDate, setStartDate] = useState(new Date());
  console.log('first date',StartDate)
  const [Loader, setLoader] = useState(false);
  const showStartDatePicker = () => {
    setPickerMode("date");
    setShowStartPicker(!showStartPicker);
  };
const showTimePickerFunc = () => {
    setPickerMode("time");
    setShowTimePicker(!showTimePicker);
  };

  const handleTimePickerChange = (event, selectedTime) => {
    if (event.type === "dismissed") {
      showTimePicker(false);
      return;
    }
    setShowTimePicker(false);
    setMedicationTime(selectedTime || date);
  };

  const handleStartPickerChange = (event, selectedDate) => {
    console.log('the selected date is', selectedDate)
    if (event.type === "dismissed") {
      setShowStartPicker(false);
      return;
    }
    setShowStartPicker(false);
    setStartDate(selectedDate || date);
  };


  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };
  


  const Submit =async() => {
    setLoader(true);
if (
  MedicineName.trim() === "" ||
  Dosage.trim() === "" ||
  Instructions.trim() === "" ||
  SideEffects.trim() === "" ||
  MedicineStorageCondition.trim() === ""
) {
  setMessage("Please fill all the fields");
  setAlertVisible(true);
  setTimeout(() => {
    setAlertVisible(false);
  }, 2000);
  setLoader(false);
  return;
}
    const data = {
      medication_name: MedicineName,
      Dosage: Dosage,
      Instructions: Instructions,
      scheduledTime: formatTime(MedicationTime),
      Medication_Date: formatDate(StartDate),
      SideEffects: SideEffects,
      StorageCondition: MedicineStorageCondition,
      raspberryPiId: RaspberrryPiID[0],
      adherenceStatus: "Upcoming",
      box_opened: false,
      sensorModel:"Touch_Sensor",
      SensorType:'capacitive',
      scheduledDateTime:MedicationTime.toISOString(),
      timestamp: new Date().toISOString(),

    };

    await AddMedicines({
      MedData: data,
      onSuccess: onSuccess => {
        setLoader(false);
        setMessage("Medicine added successfully");
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
        }, 2000);
        navigation.navigate("CaregiverTab");
      },

      onError: (error) => {
        setLoader(false);
        setMessage("Error adding medicine: " + error.message);
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
        }, 2000);
      },
    })

    console.log(data);
  



  };
  return (
    <SafeAreaView style={styles.container}>
      <Header Heading={"Add Medicine"} navigation={navigation} />
      {
        AlertVisible && <CustomAlert message={Message} visible={AlertVisible} duration={1500} type="ERROR" />
      }
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <CustomTextinput
          placeholder="Medicine Name"
          value={MedicineName}
          onChangeText={setMedicineName}
          Importance={true}
        />
        <CustomTextinput
          placeholder="Dosage"
          value={Dosage}
          onChangeText={setDosage}
          Importance={true}
        />
       
        <CustomTextinput
          placeholder="Side Effects"
          value={SideEffects}
          onChangeText={setSideEffects}
          Importance={true}
        />
        <CustomTextinput
          placeholder="Instructions"
          value={Instructions}
          onChangeText={setInstructions}
          Importance={true}
        />
           <CustomTextinput
          placeholder="Medicine Storage Condition"
          value={MedicineStorageCondition}
          onChangeText={setMedicineStorageCondition}
          Importance={true}
        />

        <Text style={styles.input3}>Medication Date:</Text>

        <TouchableOpacity onPress={showStartDatePicker} style={styles.input}>
          <Text style={styles.input2}>{formatDate(StartDate)}</Text>
          <Ionicons name="calendar" size={20} color="gray" />
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={StartDate}
            themeVariant={theme}
            // maximumDate={new Date()}
            minimumDate={new Date()}
            mode={pickerMode}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleStartPickerChange}
          />
        )}
        

  

        <Text style={styles.input3}>Time of Medicine:</Text>
        <TouchableOpacity onPress={showTimePickerFunc} style={styles.input}>
          <Text style={styles.input2}>{formatTime(MedicationTime)}</Text>
          <Ionicons name="calendar" size={20} color="gray" />
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={MedicationTime}
            themeVariant={theme}

            // maximumDate={new Date()}
            minimumDate={new Date()}
            mode={"time"}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimePickerChange}
          />
        )}
        
 
     
        <TouchableOpacity
          onPress={() => Submit()}
          activeOpacity={0.7}
          style={styles.btn}
        >
          <LinearGradient
            style={styles.gradient2}
            colors={[primary, primary, secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {Loader == false ? (
              <Text style={styles.sub4}>Submit</Text>
            ) : (
              <FontAwesome5 name="spinner" size={24} color="white" />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMedicine;

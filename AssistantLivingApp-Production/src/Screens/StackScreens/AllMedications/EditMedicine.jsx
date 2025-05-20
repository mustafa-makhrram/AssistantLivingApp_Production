import { View, Text, SafeAreaView,ScrollView,TouchableOpacity,Platform } from 'react-native'
import React,{useState,useEffect} from 'react'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
import Header from '../../../Components/Header/Header'
import CustomAlert from '../../../Components/CustomAlert/CustomAlert'
import CustomTextinput from '../../../Components/CustomTextInput/CustomTextinput'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from 'expo-linear-gradient'
import UpdateMedicines from '../../../utils/UpdateMedicines/UpdateMedicines'
const EditMedicine = ({navigation,route}) => {
    const { Data,RaspberrryPiID } = route.params
    console.log('the data', Data.id)
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme, gradientbg } = useTheme()
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor, gradientbg });
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
  const [MedicineStorageCondition, setMedicineStorageCondition] =React.useState("");
  const [StartDate, setStartDate] = useState(new Date());
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
        console.log('coming in submit')
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

console.log('wht')
      const data = {
        medication_name: MedicineName,
        Dosage: Dosage,
        Instructions: Instructions,
        scheduledTime: formatTime(MedicationTime),
        Medication_Date: formatDate(StartDate),
        SideEffects: SideEffects,
        StorageCondition: MedicineStorageCondition,
        raspberryPiId: RaspberrryPiID,
        adherenceStatus: "Upcoming",
        box_opened: false,
        sensorModel:"Touch_Sensor",
        SensorType:'capacitive',
        timestamp: new Date().toISOString(),
  
      };
  
      console.log('data to update,',data)
      await UpdateMedicines({
        id: Data?.id,
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

  useEffect(() => {
    setMedicineName(Data?.medication_name)
    setDosage(Data?.Dosage)
    setSideEffects(Data?.SideEffects)
    setInstructions(Data?.Instructions)
    setMedicineStorageCondition(Data?.StorageCondition)
    setStartDate(new Date(Data?.Medication_Date))

if (Data?.scheduledTime) {
  const [hours, minutes] = Data.scheduledTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  setMedicationTime(date);
}

  }
  , [])
  return (
    <SafeAreaView style={styles.container}>
           <Header Heading={"Edit Medicine"} navigation={navigation} />
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
            themeVariant={theme}

                       value={MedicationTime}
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
                         <Text style={styles.sub4}>Update</Text>
                       ) : (
                         <FontAwesome5 name="spinner" size={24} color="white" />
                       )}
                     </LinearGradient>
                   </TouchableOpacity>
                 </ScrollView>
     
    </SafeAreaView>
  )
}

export default EditMedicine
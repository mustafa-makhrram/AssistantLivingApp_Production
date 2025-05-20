import { View, Text, SafeAreaView,ScrollView,TouchableOpacity,Image, Alert ,Platform, ActivityIndicator} from 'react-native'
import React,{useState} from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import CustomTextinput from '../CustomTextInput/CustomTextinput';
import CustomAlert from '../CustomAlert/CustomAlert';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from "@react-native-community/datetimepicker";

import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { LinearGradient } from 'expo-linear-gradient';
export default function BusinessInfoViewer({AddressInfoEditor,BusinessImage1,BusinessName,setBusinessName,
    setAddressInfo,BusinessInfo,setBusinessInfo
    ,BusinessCategory,setBusinessCategory,BusinessDescription,setBusinessDescription,
    BusinessContact,setBusinessContact,Education,setEducation,
    WorkingDaysFrom,setWorkingDaysFrom,WorkingDaysTo,setWorkingDaysTo,WorkingTimeTo,
    setWorkingTimeTo,WorkingTimeFrom,setWorkingTimeFrom,
    setBusinessImage1,setBusinessImage2,setBusinessImage3,BusinessImage2,BusinessImage3,
}) {
    console.log('Working Days are', WorkingDaysFrom, WorkingDaysTo);
    console.log('Working Time is', WorkingTimeFrom, WorkingTimeTo);
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
    const [Alerter, setAlerter] = useState(false);
    const [Message, setMessage] = useState('');
    const [AlertType, setAlertType] = useState('');
      const [StartTimeshowPicker, setStartTimeshowPicker] = useState(false);
        const [EndTimeshowPicker, setEndTimeshowPicker] = useState(false);
        const [PickerMode, setPickerMode] = useState('date');
const [Loader, setLoader] = useState(false);
    const formatTime = (date) =>
        `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`; // Format as "HH:mm"
    
    const SampleImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJjQG4z0Jar-kZOTDtI6Ii_kVNUlAd_hKyFQ&s';
   const BusinessImagePicker1 = async () => {
          try {
            // Request permission to access media library
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
              return;
            }
      
            // Open the image picker
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true, // Allow users to crop the image
              aspect: [1, 1], // Maintain a square aspect ratio
              quality: 0.8, // Set image quality (0.0 - 1.0)
            });
      
            if (!result.canceled) {
              // Set the selected image URI
              setBusinessImage1(result.assets[0].uri);
            }
          } catch (error) {
            console.error('Error selecting image:', error);
          }
        };

        const BusinessImagePicker2 = async () => {
            try {
              // Request permission to access media library
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
              if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
                return;
              }
        
              // Open the image picker
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true, // Allow users to crop the image
                aspect: [1, 1], // Maintain a square aspect ratio
                quality: 0.8, // Set image quality (0.0 - 1.0)
              });
        
              if (!result.canceled) {
                // Set the selected image URI
                setBusinessImage2(result.assets[0].uri);
              }
            } catch (error) {
              console.error('Error selecting image:', error);
            }
          };
          const BusinessImagePicker3 = async () => {
            try {
              // Request permission to access media library
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
              if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
                return;
              }
        
              // Open the image picker
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true, // Allow users to crop the image
                aspect: [1, 1], // Maintain a square aspect ratio
                quality: 0.8, // Set image quality (0.0 - 1.0)
              });
        
              if (!result.canceled) {
                // Set the selected image URI
                setBusinessImage3(result.assets[0].uri);
              }
            } catch (error) {
              console.error('Error selecting image:', error);
            }
          };


          const StartshowTimePicker = () => {
            setPickerMode("time");
            setStartTimeshowPicker(!StartTimeshowPicker);
          };
          const EndshowTimePicker = () => {
            setPickerMode("time");
            setEndTimeshowPicker(!EndTimeshowPicker);
          };
        
  const handleStartTimePickerChange = (event, selectedTime) => {
    setStartTimeshowPicker(false);
    if (event.type !== "dismissed") {
      setWorkingTimeFrom(selectedTime);
    }
  };
  const handleEndTimePickerChange = (event, selectedTime) => {
    setEndTimeshowPicker(false);
    if (event.type !== "dismissed") {
      setWorkingTimeTo(selectedTime);
    }
  };
  const Submit = () => {

    if (BusinessName.trim() === '' || BusinessCategory.trim() === '' || BusinessDescription.trim() === '' || BusinessContact.trim() === '' || WorkingDaysFrom === null || WorkingDaysTo === null || WorkingTimeFrom === null || WorkingTimeTo === null || BusinessImage1===null || BusinessImage2===null || BusinessImage3===null) {
      setAlerter(true);
      console.log('Business INfo ', BusinessName, BusinessCategory, BusinessDescription, BusinessContact, WorkingDaysFrom, WorkingDaysTo, WorkingTimeFrom, WorkingTimeTo, BusinessImage1, BusinessImage2, BusinessImage3);
      setMessage('Please fill all required fields');
      setAlertType('WARNING');
      setTimeout(() => {
        setAlerter(false);
      }
        , 1200);
      return;
    }
    else{
        AddressInfoEditor()
    }
  }

  return (
    <View style={styles.container}>
           <ScrollView showsVerticalScrollIndicator={false}>
      {Alerter &&  <CustomAlert message={Message} visible={Alerter} type={AlertType} />} 
        <View style={styles.body}>
            <ScrollView horizontal={true} pagingEnabled showsHorizontalScrollIndicator={false}>
<TouchableOpacity onPress={BusinessImagePicker1}  style={styles.imagebox} activeOpacity={0.7}>
<Image source={BusinessImage1 === null ? { uri: SampleImage } : { uri: BusinessImage1 }}  style={styles.image} />
<TouchableOpacity  onPress={BusinessImagePicker1} style={styles.absolutebtn} activeOpacity={0.7}>
<MaterialCommunityIcons name="image-plus" size={35} color={primary} />
</TouchableOpacity>
</TouchableOpacity>
<TouchableOpacity  onPress={BusinessImagePicker2} style={styles.imagebox} activeOpacity={0.7}>
<Image   source={BusinessImage2 === null ? { uri: SampleImage } : { uri: BusinessImage2 }} style={styles.image} />
<TouchableOpacity  onPress={BusinessImagePicker2} style={styles.absolutebtn} activeOpacity={0.7}>
<MaterialCommunityIcons name="image-plus" size={35} color={primary} />
</TouchableOpacity>
</TouchableOpacity>
<TouchableOpacity  onPress={BusinessImagePicker3} style={styles.imagebox} activeOpacity={0.7}>
<Image   source={BusinessImage3 === null ? { uri: SampleImage } : { uri: BusinessImage3 }} style={styles.image} />
<TouchableOpacity  onPress={BusinessImagePicker3} style={styles.absolutebtn} activeOpacity={0.7}>
<MaterialCommunityIcons name="image-plus" size={35} color={primary} />
</TouchableOpacity>
</TouchableOpacity>
                </ScrollView>
      <CustomTextinput placeholder={'Business Name'} value={BusinessName} onChangeText={setBusinessName}  Importance={true} />
        <CustomTextinput placeholder={'Business Category'} value={BusinessCategory} onChangeText={setBusinessCategory}  Importance={true} />
        <CustomTextinput placeholder={'Business Description'} value={BusinessDescription} onChangeText={setBusinessDescription}  Importance={true} />
        <CustomTextinput placeholder={'Business Contact'} value={BusinessContact} onChangeText={setBusinessContact}  Importance={true} />
        <CustomTextinput placeholder={'Business Owner Educational Qualification'} value={Education} onChangeText={setEducation} />
        <Text style={styles.title2}>Working Days :</Text>
        <CustomDropdown
        data={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
        placeholder="Select Working Day From"
        selectedValue={WorkingDaysFrom}
        onValueChange={(value)=>setWorkingDaysFrom(value)}
      />
        <CustomDropdown
        data={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
        placeholder="Select Working Day To"
        selectedValue={WorkingDaysTo}
        onValueChange={(value)=>setWorkingDaysTo(value)}
      />
        <Text style={styles.title2}>Working Time :</Text>
        <Text style={styles.input3}>Start Time:</Text>
          <TouchableOpacity onPress={StartshowTimePicker} style={styles.input}>
            <Text style={styles.input2}>{formatTime(WorkingTimeFrom)}</Text>
            <Ionicons name="time" size={20} color="gray" />
          </TouchableOpacity>
          {StartTimeshowPicker && (
            <DateTimePicker
              value={WorkingTimeFrom}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartTimePickerChange}
            />
          )}

<Text style={styles.input3}>End Time:</Text>
          <TouchableOpacity onPress={EndshowTimePicker} style={styles.input}>
            <Text style={styles.input2}>{formatTime(WorkingTimeTo)}</Text>
            <Ionicons name="time" size={20} color="gray" />
          </TouchableOpacity>
          {EndTimeshowPicker && (
            <DateTimePicker
            themeVariant={theme}
            
              value={WorkingTimeTo}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndTimePickerChange}
            />
          )}

                 <TouchableOpacity onPress={Submit} style={styles.btn2}>
                    
                      <LinearGradient
                        style={styles.gradient2}
                        colors={['#00853E', '#00A86B', '#00A86B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
          {
          Loader? <ActivityIndicator size="small" color="#fff" /> :   <Text style={styles.submitText}>Next</Text>
          
          }
                      
                      </LinearGradient>
                    </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  )
}
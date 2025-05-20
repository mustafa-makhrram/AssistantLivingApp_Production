import {
  View,
  Text,
  Image,ActivityIndicator,
  TouchableOpacity,
  Share,  
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState ,useRef} from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Information from "../../../Components/Information/Information";
import PersonalInfoViewer from "../../../Components/Information/PersonalInfoViewer";
import OtherInfoViewer from "../../../Components/Information/OtherInfoViewer";
import { LocalUserData } from "../../../utils/LocalUserData/LocalUserData";
import AddressInfoViewer from "../../../Components/Information/AddressInfoViewer";
import PorfolioModal from "../../../Components/Modals/ProfileModals/ProfileModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmergencyButton from "../../../Components/Categories/EmergencyButton";
const Profile = ({ navigation }) => {
  const [PersonalInfo, setPersonalInfo] = useState(true);
  const [OtherInfo, setOtherInfo] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [AddressInfo, setAddressInfo] = useState(false);

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
  const [isVisible, setisVisible] = useState(false);

  const [Data, setData] = useState([]);
  const [Loading,setLoading]=useState(false)
  const [SpeakingStatus, setSpeakingStatus] = useState(false);
  const ASSEMBLYAI_API_KEY = '7ffacc193c4847c1b810eed73ae431a4';
  const recordingRef = useRef(null);


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
  
 
  const ModalOpener = () => {
    setisVisible(!isVisible);
  };

      const startListening = async () => {
        setSpeakingStatus(true);
        try {
          const permission = await Audio.requestPermissionsAsync();
          if (!permission.granted) {
            alert('Microphone permission is required');
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
    
          console.log('Recording...');
        } catch (err) {
          console.error('Failed to start recording', err);
          setSpeakingStatus(false);
        }
      };
    
    
      const stopListening = async () => {
        setLoading(true)
        setSpeakingStatus(false);
        try {
          const recording = recordingRef.current;
          if (!recording) return;
    
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
    const fileBinary = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/octet-stream',
      },
      body: Uint8Array.from(atob(fileBinary), c => c.charCodeAt(0)),
    });
    
    
          const { upload_url } = await uploadResponse.json();
    
          // Step 2: Request transcription
          const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
            method: 'POST',
            headers: {
              authorization: ASSEMBLYAI_API_KEY,
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              audio_url: upload_url,
            }),
          });
    
          const { id } = await transcriptRes.json();
    
          // Step 3: Poll until complete
          const getTranscript = async () => {
            const res = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
              headers: { authorization: ASSEMBLYAI_API_KEY },
            });
            const data = await res.json();
            if (data.status === 'completed') return data.text;
            if (data.status === 'error') throw new Error(data.error);
            return null;
          };
    
          let text;
          for (let i = 0; i < 20; i++) {
            text = await getTranscript();
            if (text) break;
            await new Promise((res) => setTimeout(res, 3000));
          }
    
          console.log('Transcript:', text);
            setLoading(false)
          if (text?.toLowerCase().includes('home')) {
            navigation.navigate('Home');
          }
          else if (text?.toLowerCase().includes('settings')) {
            navigation.navigate('Settings');
          }
          else if (text?.toLowerCase().includes('profile')) {
            navigation.navigate('Profile');
          }
          
          else{
            Alert.alert ('No Command Detected')
          }
    
          recordingRef.current = null;
        } catch (err) {
          console.error('Error during voice processing:', err);
        }
      };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await LocalUserData();
          console.log('data',data)
          setData(data)
          // if (data) {
          //   setProfile(data.Profile);
          //   setName(data.Name);
          // }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }, []);
  return (
    <View style={styles.container}>
      {
        Loading ==true ?
        <View style={{position:'absolute',top:'50%',left:'50%',left:0,right:0}}>
          <Text style={{fontSize:20,color:primary,textAlign:'center',fontFamily:'PoppinsR'}}>Processing your Command...</Text>
        <ActivityIndicator size={'large'} color={primary} style={{}} />
        </View>
        :
        <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
        
        <PorfolioModal
          navigation={navigation}
          isVisible={isVisible}
          Sharebtn={Sharebtn}
          onBackdropPress={ModalOpener}
          ModalFunction={ModalOpener}
        />

        <View>
          <SafeAreaView style={styles.absoluterow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.back}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={"#fff"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('EditProfile')} style={{...styles.back}}>
            <FontAwesome5 name="user-edit" size={22} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>
          <Image source={{ uri: Data?.Profile }} style={styles.profileImage} />
        </View>

        <View style={styles.bottombox}>
          <View style={styles.row}>
          <Text style={styles.name}>{Data?.Name}</Text>
               {VoiceAssistant && (
                      <TouchableOpacity
                        onPress={() => {
                          if (SpeakingStatus) stopListening();
                          else startListening();
                        }}
                        style={styles.end}
                      >
                        {SpeakingStatus ? (
                          <MaterialCommunityIcons name="microphone" size={30} color={'#ff8564'} />
                        ) : (
                          <MaterialCommunityIcons name="microphone-off" size={30} color={'#eee'} />
                        )}
                      </TouchableOpacity>
                    )}

          </View>
          <Text style={styles.aboutme}>{Data?.Category}</Text>
          {Data?.Bio && Data?.Bio.length < 100 && (
            <Text style={styles.aboutme2}>
              {isExpanded ? Data?.Bio : `${Data?.Bio?.substring(0, 100)}`}
            </Text>
          )}

          {/* Button to toggle between Read More and Read Less */}
          {Data?.Bio && Data?.Bio.length > 100 && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={[styles.button]}>
                {isExpanded ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title2}>Raspberry Pi ID:</Text>
          <Text style={styles.aboutme2}>
  {Data?.RaspberrryPiID?.join(', ')}
</Text>


<Text style={styles.title2}>Caregiver Remarks:</Text>

          <Text style={styles.aboutme2}>
            {Data?.CaregiverRemarks}
          </Text>
        
          <Text style={styles.title2}>Emergency Contact:</Text>

<Text style={styles.aboutme2}>
  {Data?.EmergencyContact}
</Text>



     
      <EmergencyButton  Name={Data?.Name} />

        
        </View>
</ScrollView>
      }

    </View>
  );
};

export default Profile;

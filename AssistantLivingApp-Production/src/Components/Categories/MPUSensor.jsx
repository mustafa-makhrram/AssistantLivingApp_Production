import { View, Text ,TouchableOpacity} from 'react-native'
import React,{useState} from 'react'
import { useTheme } from '../../../Theme'
import { LinearGradient } from "expo-linear-gradient";
import createStyles from './styles'
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
export default function MPUSensor({MPUData,disabled,navigation,token}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
 
      // Function to get the latest event closest to the current time
      const getLatestEvent = () => {
        const now = new Date();
        return MPUData?.filter(event => new Date(event?.timestamp) <= now) // Only consider past events
          .sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp))[0]; // Get the latest one
      };
    
      const latestEvent = getLatestEvent();
  return (
   <TouchableOpacity disabled ={disabled} onPress={()=>navigation.navigate('MPUScreen',{
    Data:MPUData,
    token:token
   })}  >
  <LinearGradient colors={["#FFF3E0",  '#FFDB99']} style={styles.section}>
      <Text style={styles.title}>MPU Sensor Detection</Text>
      <Text style={{ ...styles.description }}>
  {latestEvent?.timestamp ? (
    `${new Date(latestEvent?.timestamp).toLocaleTimeString()} -- ${new Date(latestEvent?.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`
  ) : (
    <Text style={styles.description2}>No Detection </Text>
  )}
</Text>

      <Text style={styles.description3}>
     {
      latestEvent?.movementDetected
      ? (
        <Text style={styles.description2}><Text style={{color:primary,fontFamily:'PoppinsSB'}}>Movement Detected</Text> in {latestEvent?.location.toLowerCase()== 'living_room'?'Living Room' :'null'}</Text>

      ):(
        <Text style={styles.description2}>
        No Movement Detected in {latestEvent?.location 
          ? (latestEvent.location.charAt(0).toUpperCase() + latestEvent.location.slice(1).toLowerCase()).toLowerCase()=='living_room'?'Living Room' : latestEvent?.location.charAt(0).toUpperCase() + latestEvent?.location.slice(1).toLowerCase()
          : 'any location'}
      </Text>
      
      
      )
     }
        </Text>
   
      

      
    </LinearGradient>
   </TouchableOpacity>
  )
}
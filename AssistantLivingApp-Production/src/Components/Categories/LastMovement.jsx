import { View, Text ,TouchableOpacity} from 'react-native'
import React,{useState} from 'react'
import { useTheme } from '../../../Theme'
import { LinearGradient } from "expo-linear-gradient";
import createStyles from './styles'
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
export default function LastMovement({UltrasonicData,Category,setCategory,isVisible,setIsVisible,Status,disabled,navigation}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
    // Motion Events
      const [RoomData, setRoomData] = useState([
        // { eventType: 'entry', roomOccupied: true, timestamp: '2025-03-05T01:t54:49.243Z', sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'exit', roomOccupied: false, timestamp: '2025-03-05T01:39:49.243Z' , sensorType:'ultrasonic' ,location:'living_room' },
        { eventType: 'entry', roomOccupied: true, timestamp: '2025-03-05T01:34:49.243Z' , sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'exit', roomOccupied: false, timestamp: '2025-03-05T01:49:49.243Z', sensorType:'ultrasonic' ,location:'living_room' },
        { eventType: 'entry', roomOccupied: true, timestamp: '2025-03-05T01:54:49.243Z' , sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'exit', roomOccupied: false, timestamp: '2025-03-05T01:59:49.243Z' , sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'entry', roomOccupied: true, timestamp: '2025-03-05T02:04:49.243Z' , sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'exit', roomOccupied: false, timestamp: '2025-03-05T02:09:49.243Z' , sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'entry', roomOccupied: true, timestamp: '2025-03-05T02:14:49.243Z' , sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'exit', roomOccupied: false, timestamp: '2025-03-05T02:19:49.243Z' , sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'entry', roomOccupied: true, timestamp: '2025-03-05T02:24:49.243Z' , sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'exit', roomOccupied: false, timestamp: '2025-03-05T02:29:49.243Z' , sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'entry', roomOccupied: true, timestamp: '2025-03-05T02:34:49.243Z' , sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'exit', roomOccupied: false, timestamp: '2025-03-05T02:39:49.243Z' , sensorType:'ultrasonic',location:'living_room' },
        { eventType: 'entry', roomOccupied: true, timestamp: '2025-03-05T02:23:49.243Z' , sensorType:'ultrasonic',location:'living_room' }
      ]);
    
      // Function to get the latest event closest to the current time
      const getLatestEvent = () => {
        const now = new Date();
        return UltrasonicData?.filter(event => new Date(event?.timestamp) <= now) // Only consider past events
          .sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp))[0]; // Get the latest one
      };
    
      const latestEvent = getLatestEvent();
  return (
   <TouchableOpacity disabled ={disabled} onPress={()=>navigation.navigate('Ultrasonic',{
    Data:UltrasonicData
   })}  >
  <LinearGradient colors={["#FFDB99", "#FFF3E0"]} style={styles.section}>
      <Text style={styles.title}>Last Movement</Text>


  <Text style={{ ...styles.description }}>
  {
    latestEvent?.timestamp
      ? new Date(latestEvent.timestamp).toLocaleTimeString()
      : 'No Movement Detected'
  }
</Text>


      <View style={styles.row3}>
      <AntDesign name="user" size={28} color={primary} />

      <Text style={styles.description3}>
        ---{latestEvent?.distance}---
        </Text>
        <FontAwesome5 name="object-group" size={24} color={primary} />
        <Text style={styles.description3}>
        {latestEvent?.eventType == 'retreat' ? 'Retreating' : latestEvent?.eventType== 'approach' ? 'Approaching' : latestEvent?.eventType == 'closer'? 'Moving Closer' : latestEvent?.eventType }
        </Text>
        </View>
      

      
    </LinearGradient>
   </TouchableOpacity>
  )
}
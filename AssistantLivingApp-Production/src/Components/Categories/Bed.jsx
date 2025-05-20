import { View, Text ,TouchableOpacity, ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../../Theme'
import { LinearGradient } from "expo-linear-gradient";
import createStyles from './styles'
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import fetchMyBedStatus from '../../utils/FetchBedStatus/FetchMyBedStatus';
export default function Bed({Category,setCategory,isVisible,setIsVisible,navigation,disabled,BedData,setBedData,BedLoading,setBedLoading,token}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
    // pressure Events
 

 
    

      const getLatestEvent = () => {
        const now = new Date();
        return BedData
          .filter(event => new Date(event.timestamp) <= now) // Only consider past events
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]; // Get the latest one
      };
    
      const latestEvent = getLatestEvent();
  return (
   <TouchableOpacity disabled={disabled} onPress={()=>navigation.navigate('BedScreen',{
    Data:BedData,
    token:token

   })} style={{width:'49%'}}>

    {
      BedLoading ? <ActivityIndicator size="large" color={primary} /> :    <LinearGradient colors={["#DFF2BF", "#F2FFE6"]} style={{...styles.section,width:'100%'}}>
      <Text style={styles.title}>Bed/Chair</Text>
     
   <Text style={styles.description}>
          {  latestEvent?.status ? latestEvent?.status.toLocaleUpperCase() : 'No Data'}
           </Text>
           {latestEvent?.location === 'bed' ? (
<MaterialCommunityIcons name="bed" size={32} color="gray" />
) : (
<MaterialCommunityIcons name="seat" size={32} color="gray" />
)}

     
    </LinearGradient>
    }

   </TouchableOpacity>
  )
}
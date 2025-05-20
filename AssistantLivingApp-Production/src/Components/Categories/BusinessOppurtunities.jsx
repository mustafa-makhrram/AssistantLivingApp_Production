import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import { LinearGradient } from "expo-linear-gradient";
import createStyles from './styles'
export default function BusinessOpportunities({navigation}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
  return (
   <TouchableOpacity onPress={()=>navigation.navigate('BusinessOppurtunities')} style={{width:'49%'}}>
  <LinearGradient colors={["#A8D0E6", "#DFF9FB"]} style={{...styles.section,width:'100%'}}>
    <Text style={styles.title}>Business Opportunities</Text>
    <Text style={styles.description}>
      Find the best business Opportunity for you.
    </Text>
  </LinearGradient>
   </TouchableOpacity>
  )
}
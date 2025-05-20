import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import { LinearGradient } from "expo-linear-gradient";
import createStyles from './styles'
export default function Proposals({Category,setCategory,isVisible,setIsVisible,navigation}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
  return (
   <TouchableOpacity onPress={()=>navigation.navigate('Proposals')} style={{width:'49%'}}>
<LinearGradient colors={["#FFA07A", "#FFDAB9"]} style={{...styles.section,width:'100%'}}>
  <Text style={styles.title}>Proposals</Text>
  <Text style={styles.description}>
  Connect with potential partners easily.
  </Text>
  <Text style={styles.description}>
  Reach collaborators and grow together.
  </Text>

</LinearGradient>
   </TouchableOpacity>
  )
}
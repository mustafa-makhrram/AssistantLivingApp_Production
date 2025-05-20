import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
export default function MatrimonialPopup({navigation, onBackdropPress}) {
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
  return (
    <View>
         <TouchableOpacity onPress={()=>{navigation.navigate('Matrimonial',{
            myGender:'Female'
         })
         onBackdropPress()}
         
        
         } style={{...styles.btn,backgroundColor:"#ddd"}}>
     <Text style={styles.txt}>
    Looking for Bride
     </Text>
     <MaterialCommunityIcons name="plus" size={24} color={primary} />
           </TouchableOpacity>
           <View style={styles.line}>
               <Text></Text>
           </View>
           <TouchableOpacity  onPress={()=>{navigation.navigate('Matrimonial',{
            myGender:'Male'
         })
         onBackdropPress()}
         
        
         }  style={{...styles.btn,backgroundColor:"#ddd"}}>
     <Text style={styles.txt}>
     Looking for Groom
     </Text>
     <MaterialCommunityIcons name="eye" size={24} color={primary} />
           </TouchableOpacity>
           <View style={styles.line}>
               <Text></Text>
           </View>
           <TouchableOpacity 
            onPress={()=>{navigation.navigate('AddMyDetails')
             onBackdropPress()}
             
            
             }  
            style={{...styles.btn,backgroundColor:"#ddd"}}>
     <Text style={styles.txt}>
     Add My Details
     </Text>
     <MaterialCommunityIcons name="pencil" size={24} color={primary} />
           </TouchableOpacity>
     </View>
  )
}
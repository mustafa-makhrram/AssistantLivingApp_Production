import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
export default function ProposalPopup({navigation,onBackdropPress}) {
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
     <TouchableOpacity onPress={()=>
     {
        onBackdropPress()
        navigation.navigate('AddProposals')}} style={{...styles.btn,backgroundColor:"#ddd"}}>
 <Text style={styles.txt}>
 Add Proposals
 </Text>
 <MaterialCommunityIcons name="plus" size={24} color={primary} />
       </TouchableOpacity>
       {/* <View style={styles.line}>
           <Text></Text>
       </View> */}
       {/* <TouchableOpacity style={{...styles.btn,backgroundColor:"#ddd"}}>
 <Text style={styles.txt}>
 View Proposals
 </Text>
 <MaterialCommunityIcons name="eye" size={24} color={primary} />
       </TouchableOpacity> */}
       <View style={styles.line}>
           <Text></Text>
       </View>
       <TouchableOpacity 
        onPress={()=>
            {
               onBackdropPress()
               navigation.navigate('EditProposals')}} 
       style={{...styles.btn,backgroundColor:"#ddd"}}>
 <Text style={styles.txt}>
 Edit Proposals
 </Text>
 <MaterialCommunityIcons name="pencil" size={24} color={primary} />
       </TouchableOpacity>
 </View>
  )
}
import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
export default function OffersPopup({ onBackdropPress}) {
    const navigation = useNavigation();
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
          <TouchableOpacity onPress={()=>{
onBackdropPress()
            navigation.navigate('AddOffers')
            
          }
            } style={{...styles.btn,backgroundColor:"#ddd"}}>
<Text style={styles.txt}>
    Add Offers
</Text>
<MaterialCommunityIcons name="plus" size={24} color={primary} />
            </TouchableOpacity>
            {/* <View style={styles.line}>
                <Text></Text>
            </View> */}
            {/* <TouchableOpacity style={{...styles.btn,backgroundColor:"#ddd"}}>
<Text style={styles.txt}>
    View Offers
</Text>
<MaterialCommunityIcons name="eye" size={24} color={primary} />
            </TouchableOpacity> */}
            <View style={styles.line}>
                <Text></Text>
            </View>
            <TouchableOpacity onPress={()=>{
onBackdropPress()
                navigation.navigate('EditOffers')}} style={{...styles.btn,backgroundColor:"#ddd"}}>
<Text style={styles.txt}>
    Edit My Offers
</Text>
<MaterialCommunityIcons name="pencil" size={24} color={primary} />
            </TouchableOpacity>
    </View>
  )
}
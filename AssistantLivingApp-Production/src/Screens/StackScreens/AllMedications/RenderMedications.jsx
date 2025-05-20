import { View, Text ,Image, TouchableOpacity} from 'react-native'
import React from 'react'
import createStyles from './styles'
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../Theme';
export default function RenderMedications({item,navigation,RaspberrryPiID}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
    const pilpic = 'https://media.istockphoto.com/id/1072626580/vector/medicine-flat-design-icon-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=I0ZVPGWIHoLbx6VC25v-aplRocMd7Al8OQUO2Mwri7Q='
  return (
   <View style={styles.userCard}>
  
  <TouchableOpacity onPress={()=>navigation.navigate('EditMedicine',{
    Data:item,
    RaspberrryPiID:RaspberrryPiID
  })} style={{alignSelf:'flex-end'}}>
  <FontAwesome name="edit" size={24} color={primary} />
  </TouchableOpacity>
    <View style={styles.row}>
        <View style={styles.round}>
<Image source={{uri:pilpic}} style={styles.profileImage} />
        </View>
        <View style={styles.align}>
        <Text style={styles.userName}>{item.medication_name}</Text>
        <Text style={styles.cat}>{item.scheduledTime}</Text>
        <Text style={styles.cat}>{item.Medication_Date}</Text>

        
        </View>



    </View>

    </View>
  )
}
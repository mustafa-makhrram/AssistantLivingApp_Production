import { View, Text ,Image, TouchableOpacity} from 'react-native'
import React from 'react'
import createStyles from './styles'
import { useTheme } from '../../../../Theme'
import { MaterialIcons } from '@expo/vector-icons';

export default function RenderUser({item,navigation}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
  return (
   <TouchableOpacity activeOpacity={0.6} style={styles.userCard} onPress={()=>navigation.navigate('SingleProfile',{Data:item})}>
  
    <View style={styles.row}>
        <View style={styles.round}>
<Image source={{uri:item.Profile}} style={styles.profileImage} />
        </View>
        <View style={styles.align}>
        <Text style={styles.userName}>{item.Name}</Text>
        <Text style={styles.cat}>{item.Category}</Text>
        <Text style={styles.cat}>{item.RasberryPi_Id}</Text>

        
        </View>



    </View>

    </TouchableOpacity>
  )
}
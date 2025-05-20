import { View, Text,TextInput ,TouchableOpacity} from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import {FontAwesome6} from '@expo/vector-icons'
import { scale } from 'react-native-size-matters'
export default function CustomTextinput({placeholder,value,onChangeText,Importance,Keyboard,disabler,PColor,multiline}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor });
  return (
    <View>
    <TextInput
      editable={!disabler}
      style={{...styles.input,paddingTop:multiline==true ?scale(10) :scale(0),height:multiline==true ? scale(100) : scale(40)}}
      keyboardType={Keyboard}
      placeholder={placeholder}
      placeholderTextColor={PColor}
      multiline={multiline}
      value={value}
      onChangeText={onChangeText}
    />
    {
        <View style={styles.eye}>
        {Importance &&         <FontAwesome6 name="asterisk" size={12} color="gray" />}
        </View>
    }
  
  </View>
  )
}
import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import CustomTextinput from '../CustomTextInput/CustomTextinput'
export default function Other({item}) {
    const  { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
  return (
    <View>
       <Text style={styles.title2}>About Me</Text>
                 <CustomTextinput title='Studying in Class / Standard' value={item?.Bio} disabler={true}/>
                 <Text style={styles.title2}>Educational Qualification</Text>
                 <CustomTextinput title='Educational Qualification' value={item?.Education} disabler={true}/>
                 <Text style={styles.title2}>School Name</Text>
                 <CustomTextinput title='School Name' value={item?.SchoolName} disabler={true}/>
                  <Text style={styles.title2}>College Name</Text>
                  <CustomTextinput title='College Name' value={item?.CollegeName} disabler={true}/>
                  <Text style={styles.title2}>Profession</Text>
                  <CustomTextinput title='SProfession' value={item?.Profession} disabler={true}/>
    </View>
  )
}
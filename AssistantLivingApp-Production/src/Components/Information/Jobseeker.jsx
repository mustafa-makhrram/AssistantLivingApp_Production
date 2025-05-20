import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import CustomTextinput from '../CustomTextInput/CustomTextinput'
export default function Jobseeker({item}) {
    const  { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
  return (
    <View>
       <Text style={styles.title2}>About</Text>
                     <CustomTextinput title='Studying in Class / Standard' value={item?.Bio} disabler={true}/>
                     <Text style={styles.title2}>Educational Qualification</Text>
                     <CustomTextinput title='Educational Qualification' value={item?.Education} disabler={true}/>
                    
                      <Text style={styles.title2}>Profession</Text>
                      <CustomTextinput title='Profession' value={item?.Profession} disabler={true}/>
                      <Text style={styles.title2}>Skills</Text>
                      <CustomTextinput title='Skills' value={item?.Skills} disabler={true}/>
                      <Text style={styles.title2}>Expected Salary</Text>
                      <CustomTextinput title='Expected Salary' value={item?.Salary} disabler={true}/>
                      <Text style={styles.title2}>Joining Details</Text>
                      <CustomTextinput title='Joining Details' value={item?.Join} disabler={true}/>
                      <Text style={styles.title2}>Experience</Text>
                      <CustomTextinput title='Experience' value={item?.Experience} disabler={true}/>

    </View>
  )
}
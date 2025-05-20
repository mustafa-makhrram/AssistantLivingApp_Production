import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import CustomTextinput from '../CustomTextInput/CustomTextinput'
export default function Student({item}) {
    const  { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
  return (
    <View>
     <Text style={styles.title2}>Studying in Class / Standard</Text>
           <CustomTextinput title='Studying in Class / Standard' value={item?.Degree} disabler={true}/>

<Text style={styles.title2}>Academic Year</Text>
            <CustomTextinput title='Academic Year' value={item?.Degreeyear} disabler={true}/>
            <Text style={styles.title2}>Board / Course</Text>
            <CustomTextinput title='Board / Course' value={item?.Board} disabler={true}/>
            <Text style={styles.title2}>Medium</Text>
            <CustomTextinput title='Medium' value={item?.Medium} disabler={true}/>
            <Text style={styles.title2}>School / College</Text>
            <CustomTextinput title='School / College' value={item?.SchoolName} disabler={true}/>
            <Text style={styles.title2}>Achievements</Text>
            <CustomTextinput title='Achievements' value={item?.Achievement} disabler={true}/>
            <Text style={styles.title2}>Ambition</Text>
            <CustomTextinput title='Ambition' value={item?.Ambition} disabler={true}/>

            
    </View>
  )
}
import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import CustomTextinput from '../CustomTextInput/CustomTextinput'
export default function Business({item}) {
    const  { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
  return (
      <View>
               <Text style={styles.title2}>Educational Qualification</Text>
        
                    <CustomTextinput placeholder='Educational Qualification' value={item.Education} disabler={true}/>
                     {/* <Text style={styles.title2}>College Name</Text> */}
                            <Text style={styles.title2}>College Name</Text>
                     
                     <CustomTextinput placeholder='College Name' value={item.CollegeName}disabler={true}/>
                            <Text style={styles.title2}>School Name</Text>
                     
                     <CustomTextinput placeholder='School Name' value={item.SchoolName}  disabler={true}/>
                     
       </View>
  )
}
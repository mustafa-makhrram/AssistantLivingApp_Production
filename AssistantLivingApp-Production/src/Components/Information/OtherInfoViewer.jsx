import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import Jobseeker from './Jobseeker';
import Student from './Student';
import Other from './Other';
import Business from './Business';
export default function OtherInfoViewer({item}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
    
  return (
    <View style={styles.info}>
    {
     ( item.Category === 'Jobseeker' || item.Category=='jobseeker') &&  <Jobseeker item={item}/>
    }
    {
      (item.Category === 'Student' || item.Category=='student') &&  <Student item={item}/>
    }
    {
      (item.Category === 'Other' || item.Category=='other') &&  <Other item={item}/>
    }

{
      (item.Category === 'Business' || item.Category=='business') &&  <Business item={item}/>
    }
    </View>
  )
}
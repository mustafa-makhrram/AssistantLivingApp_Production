import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import CustomTextinput from '../CustomTextInput/CustomTextinput';
export default function AddressInfoViewer({item}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
    
  return (
       <View style={styles.info}>
         <Text style={styles.title2}>Address</Text>
       <CustomTextinput title='Address' value={item?.Address} disabler={true}/>
       <Text style={styles.title2}>Street</Text>
       <CustomTextinput title=' Street' value={item?.Street} disabler={true}/>
       <Text style={styles.title2}>Area</Text>
       <CustomTextinput title='Area' value={item?.District} disabler={true}/>
       <Text style={styles.title2}>City</Text>
       <CustomTextinput title='City' value={item?.City} disabler={true}/>
       <Text style={styles.title2}>State</Text>
       <CustomTextinput title='State' value={item?.State} disabler={true}/>
       <Text style={styles.title2}>Country</Text>
       <CustomTextinput title='Country' value={item?.Country} disabler={true}/>
       <Text style={styles.title2}>Postal Code</Text>
       <CustomTextinput title='Postal Code' value={item?.PostalCode} disabler={true}/>
       
       </View>
  )
}
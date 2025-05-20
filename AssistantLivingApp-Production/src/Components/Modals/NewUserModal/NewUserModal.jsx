import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function NewUserModal({isVisible,onBackdropPress,Email}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme, gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor, gradientbg });
   
  return (
     <Modal
         isVisible={isVisible}
        //  onBackdropPress={onBackdropPress}
         backdropColor="rgba(0, 0, 0, 0.5)" // Transparent black background color
         animationIn="slideInUp"
         animationOut="slideOutDown"
         animationInTiming={500} // Slow open duration (1000ms = 1 second)
         animationOutTiming={1000}
         //   style={styles.modal}
       >
         <View style={styles.modalbox}>
          <Text style={styles.title}>Sorry to Interrupt</Text>
          <Text style={styles.para}>An Email has been sent to your Email Address. Please verify to continue. </Text>

        
         </View>
       </Modal>
  )
}
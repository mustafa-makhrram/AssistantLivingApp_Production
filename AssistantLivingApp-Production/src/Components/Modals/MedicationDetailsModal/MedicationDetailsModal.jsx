import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
import Modal from "react-native-modal";
import { MaterialIcons } from '@expo/vector-icons';
export default function MedicationDetailsModal({isVisible,onBackdropPress,Med}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme, gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor, gradientbg });

  return (
     <Modal
         isVisible={isVisible}
         onBackdropPress={onBackdropPress}
         backdropColor="rgba(0, 0, 0, 0.5)" // Transparent black background color
         animationIn="slideInUp"
         animationOut="slideOutDown"
         animationInTiming={500} // Slow open duration (1000ms = 1 second)
         animationOutTiming={1000}
       >
         <View style={styles.modalbox}>
<TouchableOpacity onPress={onBackdropPress} style={styles.btn}>
    <MaterialIcons name="close" size={24} color={Tcolor}/>
</TouchableOpacity>

          <Text style={styles.title}>{Med?.medication_name}</Text>
          <View>
            <Text style={styles.txt}>Dosage: <Text style={{fontFamily:'PoppinsL'}}>{Med?.Dosage}</Text></Text>
            <Text style={styles.txt}>Instructions:</Text>
            <Text style={styles.txt2}>{Med?.Instructions}</Text>
            <Text style={styles.txt}>Medication Time:</Text>
            <Text style={styles.txt2}>{Med?.scheduledTime} on {Med?.Medication_Date}</Text>
            <Text style={styles.txt}>Side Effects:</Text>
            <Text style={styles.txt2}>{Med?.SideEffects}</Text>
            <Text style={styles.txt}>Storage Condition:</Text>
            <Text style={styles.txt2}>{Med?.StorageCondition}</Text>

          </View>

         </View>
       </Modal>
  )
}
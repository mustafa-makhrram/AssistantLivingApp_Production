import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
import Modal from "react-native-modal";
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import CustomTextinput from '../../CustomTextInput/CustomTextinput';
import { LinearGradient } from 'expo-linear-gradient';
import { RemarksUpdate } from '../../../utils/RemarksUpdate/RemarksUpdate';
export default function RemarksModal({isVisible,onBackdropPress,Id,OldRemarks,navigation}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme, gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor, gradientbg });
    const [Remarks, setRemarks] = useState(OldRemarks)
    const [Loader, setLoader] = useState(false)
console.log('the id is',Id)

const handleSubmit = async () => {
    try {
      setLoader(true);
      console.log('The remarks are:', Remarks);
      console.log('The id is:', Id);
      
      await RemarksUpdate(Id, Remarks);
      
      setLoader(false);
      onBackdropPress(); // Close the modal after submission
      navigation.navigate('CaregiverTab', {
        screen: 'Users',
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setLoader(false);
    }
  };
  

  return (
     <Modal
         isVisible={isVisible}
        //  onBackdropPress={onBackdropPress}
         backdropColor="rgba(0, 0, 0, 0.5)" // Transparent black background color
         animationIn="slideInUp" 
         animationOut="slideOutDown"
         animationInTiming={500} // Slow open durat'ion (1000ms = 1 second)
         animationOutTiming={1000}
       >
         <View style={styles.modalbox}>
<TouchableOpacity onPress={onBackdropPress} style={styles.btn}>
    <MaterialIcons name="close" size={24} color="black" />
</TouchableOpacity>
<Text style={styles.title}>Add Remarks</Text>
<View style={{marginTop:10}}>
       <CustomTextinput value={Remarks} onChangeText={setRemarks} multiline={true} PColor={'gray'} placeholder={'Add your Remarks'}/>
</View>
  <TouchableOpacity
        activeOpacity={0.7}
        style={styles.btn2}
        onPress={handleSubmit}
        disabled={Loader == true ? true : false}
      >
        <LinearGradient
          style={styles.gradient2}
          colors={[primary, primary, secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {Loader == false ? (
            <Text style={styles.sub4}>Submit</Text>
          ) : (
            <FontAwesome5 name="spinner" size={24} color="white" />
          )}
        </LinearGradient>
      </TouchableOpacity>
         </View>
       </Modal>
  )
}
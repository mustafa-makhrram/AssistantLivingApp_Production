import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import createStyles from "./styles";
import { useTheme } from "../../../../Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeleteJobs from "../../../utils/DeleteJobs/DeleteJobs";

const DeleteModal = ({
  isVisible,
  navigation,
    setMessage,
    setAlerter,
    fetchOffers,
    setAlertType,
    setLoader,

  selectedid,
  onBackdropPress,
  ModalFunction,
}) => {
  const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } =
    useTheme();
  const styles = createStyles({
    Tcolor,
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
  });

   

  const Deleter = async () => {
    console.log("Deleting", { selectedid });

    try {
        const mydata = await AsyncStorage.getItem("User");
        const data = JSON.parse(mydata);
        console.log("Data:", data);
        const email = data.Email;
        const DOcid = selectedid;

        // Set loader true before deletion starts
        setLoader(true);

        // Call DeleteJobs without awaiting it since it uses callbacks
        DeleteJobs({
            email: email,
            DOcid: DOcid,
            onSuccess: (id) => {
                setMessage('Job Deleted Successfully');
                setAlerter(true);
                setAlertType('SUCCESS');
                setLoader(false);
                setTimeout(() => {
                    setAlerter(false);
                    fetchOffers();
                    ModalFunction();
                }, 1500);
            },
            onError: (error) => {
                console.log("Deletion Error:", error); // Log for debugging
                setMessage('Error Occurred');
                setAlerter(true);
                setAlertType('WARNING');
                setLoader(false);
                setTimeout(() => {
                    setAlerter(false);
                }, 1500);
            }
        });

    } catch (error) {
        console.error("Error in Deleter:", error);
        setMessage('Unexpected Error');
        setAlerter(true);
        setAlertType('WARNING');
        setLoader(false);
        setTimeout(() => {
            setAlerter(false);
        }, 1500);
    }
};

  return (
    <Modal
      isVisible={isVisible}
    //   onBackdropPress={onBackdropPress}
      backdropColor="rgba(0, 0, 0, 0.5)" // Transparent black background color
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500} // Slow open duration (1000ms = 1 second)
      animationOutTiming={1000}
      //   style={styles.modal}
    >
      <View style={styles.modalbox}>
 <TouchableOpacity style={styles.delbtn} onPress={ModalFunction}>
        <MaterialCommunityIcons name="close" size={20} color={primary} />
        </TouchableOpacity>
        <Text style={styles.txtdel2}>Are you sure you want to delete this Job?</Text>

<View style={styles.row}>
<TouchableOpacity style={styles.btndel} onPress={ModalFunction}>
<Text style={styles.txtdel}>No</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.btndel} onPress={()=>Deleter()}>
<Text style={styles.txtdel}>Yes</Text>
</TouchableOpacity>

</View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

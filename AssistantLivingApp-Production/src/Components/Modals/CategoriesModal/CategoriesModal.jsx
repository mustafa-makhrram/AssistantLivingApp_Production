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
import OffersPopup from "./OffersPopup";
import MatrimonialPopup from "./MatrimonialPopup";
import JobsPopup from "./JobsPopup";
import ProposalPopup from "./ProposalPopup";
import BusinessPersonPopup from "./BusinessPersonPopup";
const CategoriesModal = ({
  isVisible,
  navigation,
  onBackdropPress,
  ModalFunction,
  Category,
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

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropColor="rgba(0, 0, 0, 0.5)" // Transparent black background color
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500} // Slow open duration (1000ms = 1 second)
      animationOutTiming={1000}
      //   style={styles.modal}
    >
      <View style={styles.modalbox}>
        {Category === "Offers" && (
          <OffersPopup
            onBackdropPress={onBackdropPress}
            navigation={navigation}
          />
        )}
        {Category === "Jobs" && (
          <JobsPopup
            onBackdropPress={onBackdropPress}
            navigation={navigation}
          />
        )}
        {Category === "Matrimonial" && (
          <MatrimonialPopup
            onBackdropPress={onBackdropPress}
            navigation={navigation}
          />
        )}
        {Category == "Proposals" && (
          <ProposalPopup
            onBackdropPress={onBackdropPress}
            navigation={navigation}
          />
        )}
          {Category == "Business" && (
          <BusinessPersonPopup
            onBackdropPress={onBackdropPress}
            navigation={navigation}
          />
        )}
      </View>
    </Modal>
  );
};

export default CategoriesModal;

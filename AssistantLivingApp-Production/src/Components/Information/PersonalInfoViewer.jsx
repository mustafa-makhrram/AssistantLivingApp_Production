import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "../../../Theme";
import createStyles from "./styles";
import CustomTextinput from "../CustomTextInput/CustomTextinput";
import { format } from "date-fns";
export default function PersonalInfoViewer({ item }) {
  const {
    Tcolor,
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
    gradientbg,
  } = useTheme();
  const styles = createStyles({
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
    Tcolor,
    gradientbg,
  });
  const formatDate = (dob) => {
    try {
      if (dob?.seconds) {
        // Firestore Timestamp
        return format(new Date(dob.seconds * 1000), "dd MMM yyyy"); // Convert seconds to milliseconds and format
      } else if (typeof dob === "string") {
        // Handle date in "1/1/2023" or similar formats
        const parsedDate = new Date(dob);
        if (!isNaN(parsedDate)) {
          return format(parsedDate, "dd MMM yyyy"); // Format if valid
        }
      } else if (dob instanceof Date) {
        // Handle JavaScript Date object
        return format(dob, "dd MMM yyyy"); // Format directly
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }

    return dob; // Return the original value if formatting fails
  };
  // console.log('date is', item.Dob)
  return (
    <View style={styles.info}>
    {item.Gender === "Female" && 
  (item.MaritalStatus === "Married" || item.MaritalStatus === "Widowed") && (
    <View>
      <Text style={styles.title2}>Partner Name </Text>
      <CustomTextinput
        title="Husband Name"
        value={item?.HusbandName}
        disabler={true}
      />
    </View>
  )
}

<Text style={styles.title2}>Surname</Text>
<CustomTextinput title=" Surname" value={item?.Surname} disabler={true} />
      <Text style={styles.title2}>Father Name</Text>
      <CustomTextinput
        title="Father Name"
        value={item?.FatherName}
        disabler={true}
      />

   
      <Text style={styles.title2}>Mother Name</Text>
      <CustomTextinput
        title="Mother Name"
        value={item?.MotherName}
        disabler={true}
      />
      <Text style={styles.title2}>Date of Birth</Text>
      <CustomTextinput
        title="Date of Birth"
        value={formatDate(item?.Dob)}
        disabler={true}
      />

<Text style={styles.title2}>Marital Status</Text>
      <CustomTextinput
        title="Marital Status"
        value={item?.MaritalStatus}
        disabler={true}
      />
      <Text style={styles.title2}>Grand Father Name (Dada)</Text>
      <CustomTextinput
        title="Grand Father Name (Dada)"
        value={item?.GrandFatherName}
        disabler={true}
      />
      <Text style={styles.title2}>Grand Father Name (Nana)</Text>
      <CustomTextinput
        title="Grand Father Name (Nana)"
        value={item?.Nana}
        disabler={true}
      />
      <Text style={styles.title2}>Phone Number</Text>
      <CustomTextinput
        title="Phone Number"
        value={item?.PhoneNumber}
        disabler={true}
      />
    </View>
  );
}

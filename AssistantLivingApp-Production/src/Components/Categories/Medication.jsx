import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Entypo, Feather, FontAwesome6, Fontisto, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";
import { useTheme } from "../../../Theme";
import createStyles from "./styles";
import { UpdateMedicineStatus } from "../../utils/UpdateMedicineStatus/UpdateMedicineStatus";
import MedicationDetailsModal from "../Modals/MedicationDetailsModal/MedicationDetailsModal";

export default function Medication({
  Status,
  Medications,
  setMedications,
  MedLoading,
  Category,
  setCategory,
  Token,
  RaspberrryPiID,
  isVisible,
  setIsVisible,
  navigation,
}) {
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

  const [timeLeft, setTimeLeft] = useState(null);
  const timeoutRef = useRef(null);
const [SelectedMedication, setSelectedMedication] = useState();
const [MedicationDetails, setMedicationDetails] = useState(false)

  const convertTo24HourFormat = (timeStr) => {
    if (!timeStr) return "00:00";
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const categorizeMedications = () => {
    const now = new Date();
    const upcoming = [], missed = [], taken = [];

    Medications?.forEach((med) => {
      const date = med?.Medication_Date;
      const time = convertTo24HourFormat(med.scheduledTime);
      const scheduledDateTime = new Date(`${date}T${time}`);

      if (med.box_opened && ["On-time", "Late"].includes(med.adherenceStatus)) {
        taken.push(med);
      } else if (
        scheduledDateTime < now &&
        !med.box_opened &&
        med.adherenceStatus === "Missed"
      ) {
        missed.push(med);
      } else {
        upcoming.push(med);
      }
    });

    return { upcoming, missed, taken };
  };

  const { upcoming, missed, taken } = categorizeMedications();

  const updateAdherenceStatus2 = async (medication) => {
    try {
      const date = medication?.Medication_Date;
      const time = convertTo24HourFormat(medication?.scheduledTime);
      const scheduled = new Date(`${date}T${time}`);
      const now = new Date();
      const takentime = new Date().toISOString();
      const diffInMinutes = Math.abs((now - scheduled) / (1000 * 60));
      const newStatus = diffInMinutes > 10 ? "Late" : "On-time";

      const updatedMedications = await Promise.all(
        Medications?.map(async (med) => {
          if (med.id === medication.id) {
            const updatedMed = {
              ...med,
              takenTime: takentime,
              taken: true,
              adherenceStatus: newStatus,
              box_opened: true,
            };
            await UpdateMedicineStatus({ id: med.id, Med: updatedMed });
            return updatedMed;
          }
          return med;
        })
      );

      setMedications(updatedMedications);
      Alert.alert("Success", `Marked as taken (${newStatus})`);
    } catch (error) {
      console.error("Error updating medication status:", error);
      Alert.alert("Error", "Something went wrong while updating status");
    }
  };

const updateAdherenceStatus = async (medication) => {
  console.log('calling this,',medication);

  if (Status === "Caregiver") {
    console.log('medication:',medication.adherenceStatus);
if (medication.adherenceStatus == 'Missed'){
   const message = {
      to: Token,
      sound: 'default', // ✅ Only 'default' is allowed for remote Expo push
      title: 'You have a Missed Medication💊',
      body: `Please take ${medication.medication_name} now.`,

      data: { 
        type: "Emergency",
        priority: 'medium',
        title: 'You have a Missed Medication💊',
        body: `Please take ${medication.medication_name} now.`,
        Timestamp: new Date().toISOString(),
        channelId: 'take_medication_channel', // ✅ This is just for your app logic
        sound: 'takemedication',              // ✅ Only used internally (not by Expo server)
      },

      // ❌ Remove `trigger` - it's not valid for Expo remote push
      trigger: { seconds: 2, channelId: "take_medication_channel" },
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const responseJson = await response.json();
      console.log('📨 Push notification response:', responseJson);
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
    }
}

else{
    const message = {
      to: Token,
      sound: 'default', // ✅ Only 'default' is allowed for remote Expo push
      title: 'Time to Take Medication💊',
      body: `Please take ${medication.medication_name} now.`,

      data: { 
        type: "Emergency",
        priority: 'medium',
        title: 'Time to Take Medication💊',
        body: `Please take ${medication.medication_name} now.`,
        Timestamp: new Date().toISOString(),
        channelId: 'take_medication_channel', // ✅ This is just for your app logic
        sound: 'takemedication',              // ✅ Only used internally (not by Expo server)
      },

      // ❌ Remove `trigger` - it's not valid for Expo remote push
      trigger: { seconds: 2, channelId: "take_medication_channel" },
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const responseJson = await response.json();
      console.log('📨 Push notification response:', responseJson);
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
    }
  }
    Alert.alert("Reminder Sent", "Medication reminder sent to the user");
    return;
  }

  Alert.alert("Confirm", `Have you taken ${medication.medication_name}?`, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Yes",
      onPress: () => updateAdherenceStatus2(medication),
    },
  ]);
};


  const MedicationModalOpener = (med) => {
    setSelectedMedication(med)
    setMedicationDetails(true)
  }
  useEffect(() => {
    if (upcoming.length === 0) return;

    const firstMed = upcoming[0];
    const date = firstMed?.Medication_Date;
    const time = convertTo24HourFormat(firstMed?.scheduledTime);
    const scheduledTime = new Date(`${date}T${time}`).getTime();
    const now = new Date().getTime();
    const diff = scheduledTime - now;

    if (diff <= -10 * 60 * 1000) {
      setMedications((prev) => {
        const index = prev.findIndex((med) => med.id === firstMed.id);
        if (index === -1) return prev;

        const target = prev[index];
        if (
          !target.box_opened &&
          !["On-time", "Late", "Missed"].includes(target.adherenceStatus)
        ) {
          const updated = { ...target, adherenceStatus: "Missed" };
          UpdateMedicineStatus({ id: updated.id, Med: updated });

          const newList = [...prev];
          newList[index] = updated;
          return newList;
        }
        return prev;
      });
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const newDiff = scheduledTime - now;

      if (newDiff <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);

        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            setMedications((prev) => {
              const index = prev.findIndex((med) => med.id === firstMed.id);
              if (index === -1) return prev;

              const target = prev[index];
              if (
                !target.box_opened &&
                !["On-time", "Late", "Missed"].includes(target.adherenceStatus)
              ) {
                const updated = { ...target, adherenceStatus: "Missed" };
                UpdateMedicineStatus({ id: updated.id, Med: updated });

                const newList = [...prev];
                newList[index] = updated;
                return newList;
              }
              return prev;
            });

            timeoutRef.current = null;
          }, 10 * 60 * 1000);
        }
      } else {
        const hours = String(Math.floor(newDiff / 3600000)).padStart(2, "0");
        const minutes = String(Math.floor((newDiff % 3600000) / 60000)).padStart(2, "0");
        const seconds = String(Math.floor((newDiff % 60000) / 1000)).padStart(2, "0");
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [upcoming]);

  return (
    <View>
<MedicationDetailsModal isVisible={MedicationDetails} onBackdropPress={()=>setMedicationDetails(false)} Med={SelectedMedication} navigation={navigation}/>
      
      {MedLoading ? (
        <ActivityIndicator size="large" color={primary} style={{ marginTop: 30 }} />
      ) : (
        <View  style={styles.section}>
          {Status === "Caregiver" && (
            <View style={styles.adherenceblock}>
              <View style={styles.row}>
              <Text style={styles.title}>Medication Adherence</Text>
              <TouchableOpacity onPress={()=>navigation.navigate("AllMedications",{
                RaspberrryPiID:RaspberrryPiID,
              })}>
              <Entypo name="eye" size={24} color={primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.rowalign}>
                <View style={styles.ontime}>
                  <Text style={styles.label}>
                    {taken.filter((m) => m.adherenceStatus === "On-time").length}
                  </Text>
                  <Text style={styles.label2}>On-Time</Text>
                </View>
                <View style={styles.late}>
                  <Text style={styles.label}>
                    {taken.filter((m) => m.adherenceStatus === "Late").length}
                  </Text>
                  <Text style={styles.label2}>Late</Text>
                </View>
                <View style={styles.missed}>
                  <Text style={styles.label}>{missed.length}</Text>
                  <Text style={styles.label2}>Missed</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.row2}>
            <Text style={styles.title}>Medication</Text>
            <MaterialIcons name="medical-services" size={24} color="black" />
          </View>

          <Text style={styles.title2}>UPCOMING MEDICATIONS: <Text style={{fontSize:18}}>⏳</Text></Text>
        {upcoming.length > 0 ? (
  upcoming.slice(0, 3).map((med, i) => {
    const medTime = new Date(
      `${med.Medication_Date}T${convertTo24HourFormat(med.scheduledTime)}`
    ).getTime();
    const now = new Date().getTime();
    const diff = (medTime - now) / (1000 * 60); // difference in minutes
    const isTouchable = diff <= 10;
    const countdown = i === 0 && timeLeft ? timeLeft : "";

    return (
      <View
        key={i}
        style={[
          styles.tableRow2,
          { backgroundColor: isTouchable ? "#e3e3e3" : "transparent" },
        ]}
      >

       
<View style={styles.row9}>
        <View style={styles.row3}>
          <TouchableOpacity onPress={() => MedicationModalOpener(med)} style={styles.icon}>
            <MaterialIcons name="help" size={24} color={Tcolor} />
          </TouchableOpacity>
          <Text style={styles.name}>
            {med.medication_name} {med.scheduledTime}
          </Text>

       
        </View>
           <View>
             {countdown !== "" && (
          <Text style={[styles.label2, { color: primary }]}>
            {countdown}
          </Text>
        
        )}
        </View>
        </View>

      
        {isTouchable && (
          <TouchableOpacity style={styles.btn} onPress={() => updateAdherenceStatus(med)}>
            <Text style={styles.btnText}>
              {Status === "Caregiver" ? "Send Reminder" : "Take Medicine"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  })
) : (
  <Text style={styles.noMedsText}>No Upcoming medications</Text>
)}

<View style={styles.row3}>
          <Text style={styles.title2}>MISSED MEDICATIONS:</Text>
          <View style={{...styles.icon,marginLeft:10}}>
        <MaterialCommunityIcons name="close-box-multiple" size={24} color="black" />
          </View>
          </View>
          {missed.length > 0 ? (
            missed.slice(0, 3).map((med, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={styles.row3}>
                  <TouchableOpacity  onPress={()=>MedicationModalOpener(med)} style={styles.icon}>
                <MaterialIcons name="help" size={24} color={Tcolor} />
                </TouchableOpacity>
                <Text style={styles.name}>
                  {med.medication_name} {med.scheduledTime}
                </Text>
                </View>
                <TouchableOpacity style={styles.btn} onPress={() => updateAdherenceStatus(med)}>
                  <Text style={styles.btnText}>
                    {Status === "Caregiver" ? "Send Reminder" : "Take Medicine"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noMedsText}>No missed medications</Text>
          )}
<View style={styles.row3}>
          <Text style={styles.title2}>MEDICATIONS TAKEN TODAY:</Text>
          <View style={{...styles.icon,marginLeft:10}}>
       <MaterialIcons name="library-add-check" size={24} color="black" />
          </View>
</View>
         <View>
  {taken.length > 0 ? (
    <>
      <View style={styles.tableHeader}>
        <Text style={styles.columnHeader}>#</Text>
        <Text style={styles.columnHeader}>Medicine</Text>
        <Text style={styles.columnHeader}>Status</Text>
      </View>

      {taken.slice(0, 3).map((med, i) => (
        <View
          key={i}
          style={[
            styles.tableRow,
            {
              backgroundColor:
                med.adherenceStatus === "On-time" ? 'rgba(144, 238, 144, 0.5)' : "lightyellow",
            },
          ]}
        >
          <Text style={styles.time}>{i + 1}</Text>
          <Text style={styles.name2}>{med.medication_name}</Text>
          <Text style={styles.time}>{med.adherenceStatus}</Text>
        </View>
      ))}
    </>
  ) : (
    <Text style={styles.noMedsText}>
      No medications taken today
    </Text>
  )}
</View>

        </View>
      )}
    </View>
  );
}

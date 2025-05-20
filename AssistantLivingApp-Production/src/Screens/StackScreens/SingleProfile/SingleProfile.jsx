import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import PorfolioModal from "../../../Components/Modals/ProfileModals/ProfileModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmergencyButton from "../../../Components/Categories/EmergencyButton";
import Medication from "../../../Components/Categories/Medication";
import Room from "../../../Components/Categories/Room";
import Bed from "../../../Components/Categories/Bed";
import LastMovement from "../../../Components/Categories/LastMovement";
import RecentActivity from "../../../Components/Categories/RecentActivity";
import fetchMyRoomStatus from "../../../utils/FetchRoomStatus/FetchMyRoomStatus";
import fetchMyMedicines from "../../../utils/FetchMedicines/FetchMyMedicines";
import fetchMyBedStatus from "../../../utils/FetchBedStatus/FetchMyBedStatus";
import fetchMyUltrasonicData from "../../../utils/FetchUltrasonicData/FetchMyUltrasonicData";
import MPUSensor from "../../../Components/Categories/MPUSensor";
import fetchMyMPUData from "../../../utils/FetchMPUData/FetchMyMPUData";
import RemarksModal from "../../../Components/Modals/RemarksModal/RemarksModal";
const SingleProfile = ({ navigation, route }) => {
  const { Data } = route.params;
  const [PersonalInfo, setPersonalInfo] = useState(true);
  const [OtherInfo, setOtherInfo] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [AddressInfo, setAddressInfo] = useState(false);

  const {
    Tcolor,
    primary,
    secondary,
    AppName,
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
  const [isVisible, setisVisible] = useState(false);
  const [Category, setCategory] = useState("");
  const [isRoomVisible, setisRoomVisible] = useState(false);
  const [isBedVisible, setisBedVisible] = useState(false);
  const [isLastMovementVisible, setisLastMovementVisible] = useState(false);
  const [isRemarksVisible, setisRemarksVisible] = useState(false);

  const ModalOpener = () => {
    setisVisible(!isVisible);
  };

  const [Medications, setMedications] = useState([]);
  const [RoomData, setRoomData] = useState([]);
  const [BedData, setBedData] = useState([]);
  const [RoomLoading, setRoomLoading] = useState(false);
  const [MedLoading, setMedLoading] = useState(false);
  const [BedLoading, setBedLoading] = useState(false);
  const [UltrasonicData, setUltrasonicData] = useState([]);

  const [UltrasonicLoading, setUltrasonicLoading] = useState(false);
  const [MPUData, setMPUData] = useState([]);
  const [MPULoading, setMPULoading] = useState(false);

  // Fetching medications
  const fetchMedicines = async () => {
    try {
      setMedLoading(true);
      const medications = await fetchMyMedicines(Data?.RaspberrryPiID);
      // Filter only valid meds
      const validMeds = medications.filter(
        (med) =>
          med?.Medication_Date && med?.scheduledTime && med?.medication_name
      );
      setMedications(validMeds);
      setMedLoading(false);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  // Fetching room data
  const fetchRoomData = async () => {
    try {
      console.log("fetching room data");
      console.log("room data fetching with id", Data?.RaspberrryPiID);
      setRoomLoading(true);

      const MyRoomData = await fetchMyRoomStatus(Data?.RaspberrryPiID);
      setRoomData(MyRoomData);
      setRoomLoading(false);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  // Fetching ultrasonic data
  const fetchUltrasonicData = async () => {
    try {
      console.log("fetching ultrasonic data");
      console.log("room data fetching with id", Data?.RaspberrryPiID);
      setUltrasonicLoading(true);

      const myultra = await fetchMyUltrasonicData(Data?.RaspberrryPiID);
      setUltrasonicData(myultra);
      setUltrasonicLoading(false);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  // Fetching MPU data
  const fetchMPUData = async () => {
    try {
      console.log("fetching MPU data");
      console.log("MPU data fetching with id", Data?.RaspberrryPiID);
      setMPULoading(true);

      const myMPU = await fetchMyMPUData(Data?.RaspberrryPiID);
      setMPUData(myMPU);
      setMPULoading(false);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  // Fetching bed data
  const fetchBedData = async () => {
    try {
      console.log("fetching bed data");
      console.log("bed data fetching with id", Data.RaspberrryPiID);
      setBedLoading(true);

      const mybed = await fetchMyBedStatus(Data?.RaspberrryPiID);
      setBedData(mybed);
      setBedLoading(false);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  // Fetching all data
  const CallingAll = async () => {
    console.log("Calling fetchers with id:", Data?.RaspberrryPiID);
    await fetchRoomData();
    await fetchMedicines();
    await fetchBedData();
    await fetchUltrasonicData();
    await fetchMPUData();
    console.log("finished");
  };
  useEffect(() => {
    if (!Data?.RaspberrryPiID) return; // wait until id is available
    const callfunc = async () => {
      await CallingAll();
    };
    callfunc();
  }, [Data]);

  const Sharebtn = async (item) => {
    Share.share({
      message: `Hi, I am ${Data?.Name} using ${AppName}. Connect with me on ${AppName}.`,
    })
      .then((result) => {
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log(`Shared via ${result.activityType}`);
          } else {
            console.log("Shared successfully");
          }
        } else if (result.action === Share.dismissedAction) {
          console.log("Share dismissed");
        }
      })
      .catch((error) => {
        console.error("Error sharing:", error.message);
      });
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <PorfolioModal
          RaspberrryPiID={Data?.RaspberrryPiID}
          navigation={navigation}
          isVisible={isVisible}
          Sharebtn={Sharebtn}
          onBackdropPress={ModalOpener}
          ModalFunction={ModalOpener}
        />

        <View>
          <SafeAreaView style={styles.absoluterow}>
            {isRemarksVisible && (
              <RemarksModal
                isVisible={isRemarksVisible}
                onBackdropPress={() => setisRemarksVisible(!isRemarksVisible)}
                setIsVisible={setisRemarksVisible}
                Id={Data.id}
                OldRemarks={Data.CaregiverRemarks}
                navigation={navigation}
              />
            )}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.back}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={"#fff"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => ModalOpener()} style={styles.back}>
              <MaterialCommunityIcons
                name="dots-grid"
                size={24}
                color={"#fff"}
              />
            </TouchableOpacity>
          </SafeAreaView>
          <Image source={{ uri: Data?.Profile }} style={styles.profileImage} />
        </View>

        <View style={styles.bottombox}>
          <View style={styles.rowalign}>
            <Text style={styles.name}>{Data?.Name}</Text>
            <TouchableOpacity
              onPress={() => setisRemarksVisible(!isRemarksVisible)}
              style={{ marginRight: 10 }}
            >
              <FontAwesome name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.aboutme}>{Data?.Category}</Text>
          {Data?.Bio && Data?.Bio.length < 100 && (
            <Text style={styles.aboutme2}>
              {isExpanded ? Data?.Bio : `${Data?.Bio?.substring(0, 100)}`}
            </Text>
          )}

          {/* Button to toggle between Read More and Read Less */}
          {Data?.Bio && Data?.Bio.length > 100 && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={[styles.button]}>
                {isExpanded ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title2}>Raspberry Pi ID:</Text>
          <Text style={styles.aboutme2}>
            {Data?.RaspberrryPiID?.join(", ")}
          </Text>

          <Medication
            navigation={navigation}
            Token={Data?.ExpoToken}
            MedLoading={MedLoading}
            RaspberrryPiID={Data?.RaspberrryPiID}
            setMedLoading={setMedLoading}
            Status={"Caregiver"}
            Medications={Medications}
            setMedications={setMedications}
          />

          <View style={styles.rowalign}>
            <Room
              navigation={navigation}
              disabled={false}
              RoomData={RoomData}
              setRoomData={setRoomData}
              RoomLoading={RoomLoading}
              setRoomLoading={setRoomLoading}
              Category={Category}
              setCategory={setCategory}
              isVisible={isRoomVisible}
              setIsVisible={setisRoomVisible}
            />
            <Bed
              navigation={navigation}
              BedData={BedData}
              setBedData={setBedData}
              BedLoading={BedLoading}
              token={Data?.ExpoToken}
              setBedLoading={setBedLoading}
              disabled={false}
              Category={Category}
              setCategory={setCategory}
              isVisible={isBedVisible}
              setIsVisible={setisBedVisible}
            />
          </View>

          <LastMovement
            navigation={navigation}
            UltrasonicLoading={UltrasonicLoading}
            setUltrasonicLoading={setUltrasonicLoading}
            setUltrasonicData={setUltrasonicData}
            UltrasonicData={UltrasonicData}
            disabled={false}
            Status={"Caregiver"}
            Category={Category}
            setCategory={setCategory}
            isVisible={isLastMovementVisible}
            setIsVisible={setisLastMovementVisible}
          />
          <MPUSensor
            navigation={navigation}
            MPULoading={MPULoading}
            setMPULoading={setMPULoading}
            setMPUData={setMPUData}
            MPUData={MPUData}
            disabled={false}
            token={Data?.ExpoToken}
            Status={"Caregiver"}
            Category={Category}
            setCategory={setCategory}
            isVisible={isLastMovementVisible}
            setIsVisible={setisLastMovementVisible}
          />

          <RecentActivity
            disabled={false}
            navigation={navigation}
            motionEvents={RoomData}
            mpuEvents={MPUData}
            pressureEvents={BedData}
            ultrasonicevents={UltrasonicData}
            MedicationEvents={Medications}
            Status={"Caregiver"}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SingleProfile;

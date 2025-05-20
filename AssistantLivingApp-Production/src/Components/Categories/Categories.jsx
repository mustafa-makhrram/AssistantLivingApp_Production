import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../Theme";
import createStyles from "./styles";
import CategoriesModal from "../Modals/CategoriesModal/CategoriesModal";
import Medication from "./Medication";
import Room from "./Room";
import RecentActivity from "./RecentActivity";
import Bed from "./Bed";
import LastMovement from "./LastMovement";
import fetchMyMedicines from "../../utils/FetchMedicines/FetchMyMedicines";
import fetchMyRoomStatus from "../../utils/FetchRoomStatus/FetchMyRoomStatus";
import fetchMyBedStatus from "../../utils/FetchBedStatus/FetchMyBedStatus";

export default function Categories({ navigation, id }) {
  const [RoomLoading, setRoomLoading] = useState(false);
  const [MedLoading, setMedLoading] = useState(false);
  const [BedLoading, setBedLoading] = useState(false);
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
  const [Category, setCategory] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [Medications, setMedications] = useState([]);
  const [RoomData, setRoomData] = useState([]);
  const [BedData, setBedData] = useState([]);
  const fetchMedicines = async () => {
    try {
      setMedLoading(true);
      const medications = await fetchMyMedicines(id);
      // Optional: Filter only valid meds
      const validMeds = medications.filter(
        (med) =>
          med?.Medication_Date && med?.scheduledTime && med?.medication_name
      );
      // console.log('the valid meds:', validMeds)
      setMedications(validMeds);
      setMedLoading(false);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  const fetchRoomData = async () => {
    try {
      console.log("fetching room data");
      console.log("room data fetching with id", id);
      setRoomLoading(true);

      const MyRoomData = await fetchMyRoomStatus(id);
      setRoomData(MyRoomData);
      setRoomLoading(false);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const fetchBedData = async () => {
    try {
      console.log("fetching bed data");
      console.log("bed data fetching with id", id);
      setBedLoading(true);

      const mybed = await fetchMyBedStatus(id);
      setBedData(mybed);
      setBedLoading(false);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const CallingAll = async () => {
    console.log("Calling fetchers with id:", id);
    await fetchRoomData();
    await fetchMedicines();
    await fetchBedData();
    console.log("finished");
  };
  useEffect(() => {
    if (!id) return; // wait until id is available
    const callfunc = async () => {
      await CallingAll();
    };
    callfunc();
  }, [id]); 

  return (
    <View style={styles.container}>
      <CategoriesModal
        navigation={navigation}
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        Category={Category}
      />
      <Medication
        navigation={navigation}
        MedLoading={MedLoading}
        setMedLoading={setMedLoading}
        Medications={Medications}
        setMedications={setMedications}
        Category={Category}
        setCategory={setCategory}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <Text style={styles.title2}>Activity Status:</Text>
      <View style={styles.rowalign}>
        <Room
          navigation={navigation}
          RoomLoading={RoomLoading}
          setRoomLoading={setRoomLoading}
          RoomData={RoomData}
          setRoomData={setRoomData}
          Category={Category}
          disabled={true}
          setCategory={setCategory}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
        <Bed
          navigation={navigation}
          BedData={BedData}
          setBedData={setBedData}
          BedLoading={BedLoading}
          setBedLoading={setBedLoading}
          Category={Category}
          setCategory={setCategory}
          disabled={true}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      </View>

      {/* <LastMovement
        navigation={navigation}
        Category={Category}
        setCategory={setCategory}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      /> */}
      {/* <Text style={styles.title}>Recent Activity:</Text> */}

      {/* <Advertiser navigation={navigation} Data={SlidingData1}  /> */}

      {/* <View style={styles.rowalign}>
        <BusinessOppurtunities
          navigation={navigation}
          Category={Category}
          setCategory={setCategory}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
        <Proposals
          navigation={navigation}
          Category={Category}
          setCategory={setCategory}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      </View>
     */}
      {/* <RecentActivity navigation={navigation} motionEvents={RoomData} pressureEvents={BedData} />  */}
    </View>
  );
}

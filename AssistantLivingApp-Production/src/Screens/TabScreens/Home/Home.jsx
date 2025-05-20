import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import * as Notifications from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";
import HomeHeader from "../../../Components/HomeHeader/HomeHeader";
import Categories from "../../../Components/Categories/Categories";
import { LocalUserData } from "../../../utils/LocalUserData/LocalUserData";
const Home = ({ navigation }) => {
  const [Profile, setProfile] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnOqeI8JnUvnvpz9RaT_yBzYM7VHSvowT_PQ&s"
  );
  const [Name, setName] = useState("John Doe");
  const {
    Tcolor,
    primary,
    secondary,
    background,
    theme,
    logo,
    toggleTheme,
    AppName,
  } = useTheme();

  const styles = createStyles({
    primary,
    secondary,
    background,
    AppName,
    theme,
    logo,
    toggleTheme,
    Tcolor,
  });

  const [Loading, setLoading] = useState(false);

  const [Rasid, setRasid] = useState(null);
  const [SpeechAllowed, setSpeechAllowed] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await LocalUserData();
        if (data) {
          if (data.Profile !== Profile) setProfile(data.Profile);
          if (data.Name !== Name) setName(data.Name);
          if (data.RaspberrryPiID !== Rasid) {
            console.log("Setting Rasid:", data.RaspberrryPiID);
            setRasid(data.RaspberrryPiID);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);
  const TestFunc = () => {
    console.log("testing");
  };

  return (
    <SafeAreaView style={styles.container}>
      {Loading == true ? (
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            left: 0,
            right: 0,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: primary,
              textAlign: "center",
              fontFamily: "PoppinsR",
            }}
          >
            Processing your Command...
          </Text>
          <ActivityIndicator size={"large"} color={primary} style={{}} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={[primary, primary, primary]}
            style={styles.sub}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <HomeHeader
              navigation={navigation}
              SpeechAllowed={SpeechAllowed}
              Profile={Profile}
              Test={TestFunc}
              Loading={Loading}
              setLoading={setLoading}
            />
            <Text style={styles.name}>Greetings! {Name}</Text>
            <Text style={styles.para}>Welcome to {AppName}</Text>
          </LinearGradient>
          <Categories navigation={navigation} id={Rasid} />
        </ScrollView>
      )}

      {/* } */}
    </SafeAreaView>
  );
};

export default Home;

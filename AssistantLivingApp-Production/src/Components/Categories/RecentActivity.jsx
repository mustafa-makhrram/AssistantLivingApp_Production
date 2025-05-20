import { View, Text, TouchableOpacity } from "react-native";
import React,{useState,useEffect} from "react";
import { useTheme } from "../../../Theme";
import { LinearGradient } from "expo-linear-gradient";
import createStyles from "./styles";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
export default function RecentActivity({mpuEvents, navigation ,motionEvents, pressureEvents,MedicationEvents,disabled,ultrasonicevents}) {
  const iconcolor ='#36454F'
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

  const [recentActivities, setRecentActivities] = useState([]);
  console.log('the first recent activities',recentActivities[0])
  useEffect(() => {
    const allEvents = [
      ...motionEvents.map(event => ({
        ...event,
        type: 'Room Activity',
        Timing: event.timestamp
      })),
      ...pressureEvents.map(event => ({
        ...event,
        type: event.location === 'bed' ? 'Bed Activity' : 'Chair Activity',
        Timing: event.timestamp
      })),
      ...ultrasonicevents.map(event => ({
        ...event,
        type: 'Ultrasonic Activity',
        Timing: event.timestamp
      })),

      ...MedicationEvents
      .filter(event => event.box_opened === true)
      .map(event => ({
        ...event,
        type: 'Medication Activity',
        Timing: `${event.Medication_Date}T${event.scheduledTime}`,
      })),
    
      ...mpuEvents
      .filter(event => event.movementDetected === true)
      .map(event => ({
        ...event,
        type: 'MPU Detection',
        Timing: event.timestamp
      }))
    


    ];
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
  
    const recentEvents = allEvents.filter(event => {
      const eventTime = new Date(event?.Timing);
      return eventTime > oneDayAgo;
    });
  
    const sortedRecentEvents = recentEvents.sort((a, b) => new Date(b.Timing) - new Date(a.Timing));
  
    setRecentActivities(sortedRecentEvents);
  }, [motionEvents, pressureEvents, ultrasonicevents, MedicationEvents]);
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getActivityIcon = (activity) => {
    switch (activity) {
      case 'MPU Detection':
        return <FontAwesome5 name="walking" size={24} color={iconcolor} />;
      case 'Walking Upstairs':
        return <FontAwesome5 name="arrow-up" size={24}color={iconcolor} />;
      case 'Walking Downstairs':
        return <FontAwesome5 name="arrow-down" size={24} color={iconcolor} />;
      case 'Standing':
        return <FontAwesome5 name="male" size={24} color={iconcolor}/>;
      case 'Chair Activity':
        return <FontAwesome5 name="chair" size={24} color={iconcolor} />;
      case 'Bed Activity':
        return <FontAwesome5 name="bed" size={24} color={iconcolor} />;
      case 'Medication Activity':
        return <FontAwesome5 name="pills" size={24} color={iconcolor} />;
      case 'Ultrasonic Activity':
        return<MaterialIcons name="social-distance" size={24} color={iconcolor} />;
      case 'Room Activity':
        return <FontAwesome5 name="door-open" size={24} color={iconcolor} />;
      default:
        return <FontAwesome5 name="circle" size={24} color={iconcolor} />;
    }
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => navigation.navigate("RecentActivity",{
        Data:recentActivities
      })}
      // onPress={() => {
      //   navigation.navigate("BusinessPerson");
      // }}
    >
      <LinearGradient
        colors={["#FFDEE9", "#B5FFFC", "#E0FFFF"]}
        style={{ ...styles.section, width: "100%" }}
      >
        <Text style={styles.title}>Recent Activity</Text>
        {/* <Text style={styles.description}>
          <Text style={styles.title2}>Explore Business Listed:</Text> by the
          Community Business Members.
        </Text> */}

{recentActivities.length === 0 ? (
        <Text style={styles.description}>No recent activities recorded</Text>
      ) : (
        <View style={styles.timelineContainer}>

          {recentActivities.slice(0, 1).map((activity, index) => (
            <View key={activity.id || index} style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                {getActivityIcon(activity.type)}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.description2}>{activity.description} {activity.type} at</Text>
               
              </View>
              <Text style={styles.description2}>
                  {formatTimestamp(activity.Timing)}
                </Text>
            </View>
          ))}
        </View>
      )}
        
      </LinearGradient>
    </TouchableOpacity>
  );
}

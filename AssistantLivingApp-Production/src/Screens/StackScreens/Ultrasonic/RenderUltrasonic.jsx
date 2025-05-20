import { View, Text } from 'react-native'
import React from 'react'
import { AntDesign, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import createStyles from './styles';
import { useTheme } from '../../../../Theme';
export default function RenderUl({item}) {
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
    

 
  // Convert timestamp to formatted date
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp); 
    const options = { day: 'numeric', month: 'short' }; // 12 May
  
    const dayMonth = date.toLocaleDateString('en-US', options);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12 || 12; // convert to 12-hour format
    const formattedMinutes = minutes.toString().padStart(2, '0');
  
    return `${dayMonth} ${hours}:${formattedMinutes} ${ampm}`;
  };
  
  return (
    <View style={styles.box}>
        <View style={styles.rowalign}>
      <Text style={styles.title}>
  {item?.position?.replace(/_/g, ' ').toUpperCase()}
</Text>


      <Text style={styles.smalldescription}>{formatTimestamp(item.timestamp)}</Text>
      </View>
       <View style={styles.row3}>
            <AntDesign name="user" size={28} color={primary} />
      
            <Text style={styles.description3}>
              ---{item?.distance}---
              </Text>
              <FontAwesome5 name="object-group" size={24} color={primary} />
              <Text style={styles.description3}>
                     {item.eventType == 'retreat' ? 'Retreating' : item.eventType== 'approach' ? 'Approaching' : item.eventType == 'closer'? 'Moving Closer' : item.eventType }
</Text>
              </View>
   <Text style={styles.description}>
  <Text style={{ ...styles.description, fontFamily: 'PoppinsSB' }}>
    Location:
  </Text>{" "}
  {item?.location?.toLowerCase() === 'living_room'
    ? 'Living Room'
    : item?.location
        ? item.location.charAt(0).toUpperCase() + item.location.slice(1).toLowerCase()
        : ''}
</Text>

    
    </View>
  );
}

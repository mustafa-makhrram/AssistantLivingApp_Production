import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import createStyles from "./styles";
import { useTheme } from "../../../../Theme";
import { MaterialIcons } from "@expo/vector-icons";

export default function RenderNotifications({ item, navigation }) {
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
  console.log("item", item);
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const time = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const formattedDate = date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return `${time}`;
  };

  return (
    <View
      style={{
        ...styles.userCard,
        backgroundColor:
          item.priority == "high"
            ? "#FF474C"
            : item.priority == "medium"
            ? "#FFFFC5"
            : "#FFFFC5",
      }}
    >
      <View style={styles.align}>
        <Text style={{ ...styles.cat, alignSelf: "flex-end" }}>
          {formatDate(item.Timestamp)}
        </Text>

        <Text style={styles.userName}>{item?.title}</Text>
        <Text style={styles.cat}>{item?.body}</Text>
      </View>
    </View>
  );
}

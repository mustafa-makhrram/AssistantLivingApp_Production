import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect } from "react";
import { AntDesign, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import createStyles from "./styles";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  withSequence,
} from "react-native-reanimated";
import { useTheme } from "../../../Theme";
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ShakingAlertButton = ({ onPress, style, textStyle }) => {
  const { primary } = useTheme();
  const shake = useSharedValue(0);
  const color = useSharedValue(0);

  useEffect(() => {
    shake.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 50 }),
        withTiming(2, { duration: 50 }),
        withTiming(0, { duration: 50 })
      ),
      -1,
      true
    );

    color.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
    backgroundColor: interpolateColor(color.value, [0, 1], ["red", primary]),
  }));

  return (
    <AnimatedTouchable onPress={onPress} style={[style, animatedStyle]}>
      <Text style={textStyle}>SEND ALERT</Text>
    </AnimatedTouchable>
  );
};

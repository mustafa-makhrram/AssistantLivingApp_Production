import React, { useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, Image } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { scale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const CustomAlert = ({ message, visible, duration = 1500, type }) => {
  const translateY = useSharedValue(220); // Start outside of the screen

  useEffect(() => {
    if (visible) {
      // Show the alert
      translateY.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });

      // Hide the alert after the specified duration
      const hideTimeout = setTimeout(() => {
        translateY.value = withTiming(220, {
          duration: 300,
          easing: Easing.in(Easing.ease),
        });
      }, duration);

      return () => clearTimeout(hideTimeout); // Clean up timeout on unmount or re-render
    } else {
      // Ensure the alert is hidden when `visible` is false
      translateY.value = withTiming(220, {
        duration: 200,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [visible, translateY, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backgroundColor =
    type === 'SUCCESS'
      ? '#bcf7cc'
      : type === 'ERROR'
      ? '#f7bcbc'
      : type === 'WARNING'
      ? '#f7d6bc'
      : '#bcc9f7';

  const iconSource =
    type === 'SUCCESS'
      ? require('../../Assets/Images/success.png')
      : type === 'ERROR'
      ? require('../../Assets/Images/error.png')
      : type === 'WARNING'
      ? require('../../Assets/Images/warning.png')
      : require('../../Assets/Images/info.png');

  return (
    <Animated.View style={[styles.toastContainer, animatedStyle]}>
      <View style={[styles.sideBar, { backgroundColor }]} />
      <View style={[styles.circle, { backgroundColor }]}>
        <Image source={iconSource} style={styles.toastIcon} />
      </View>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 90, 
    alignSelf: 'center',
    width: width - 34,
    height: scale(60),
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 8,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    // Shadow for Android
    elevation: 3,
    zIndex: 1000, 
  },
  toastText: {
    color: '#000',
    textAlign: 'center',
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'PoppinsR', 
  },
  sideBar: {
    width: 5,
    height: '100%',
    marginLeft: 0.2,
    borderRadius: 10,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastIcon: {
    width: 16,
    height: 16,
  },
});

export default CustomAlert;

import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
const CaregiverSettings = () => {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } =
        useTheme();
    const styles = createStyles({
        Tcolor,
        primary,
        secondary,
        background,
        theme,
        logo,
        toggleTheme,
    });

  return (
    <SafeAreaView style={styles.container}>
      <Text>CaregiverSettings</Text>
    </SafeAreaView>
  )
}

export default CaregiverSettings
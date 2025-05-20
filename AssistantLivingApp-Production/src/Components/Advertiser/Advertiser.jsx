import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
export default function Advertiser({Type, navigation , Data}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme, gradientbg } = useTheme()
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor, gradientbg })
  return (
    <View>
      <Text>Advertiser</Text>
    </View>
  )
}
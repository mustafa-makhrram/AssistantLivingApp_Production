import { View, Text ,TextInput, TouchableOpacity} from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import Octicons from '@expo/vector-icons/Octicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
export default function SearchPeople({search,setSearch,Filter,setFilter}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
  return (
    <View style={styles.container}>
    
    <Octicons name="search" size={24} color={primary} />
    <TextInput
    style={styles.input}
    placeholder="Search"
    value={search}
    placeholderTextColor={'gray'}
    onChangeText={setSearch}
    />

    </View>
  )
}
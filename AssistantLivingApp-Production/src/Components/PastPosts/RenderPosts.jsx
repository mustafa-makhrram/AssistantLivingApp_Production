import { View, Text,TouchableOpacity,Image } from 'react-native'
import React,{useState} from 'react'
import { useTheme } from '../../../Theme';
import createStyles from './styles'

export default function RenderPosts({item}) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
  return (
    <View style={styles.postcontainer}>
         <Text style={styles.despost}>
        {isExpanded
          ? item.Content
          : `${item.Content?.substring(0, 250)}...`}
      </Text>

      {/* Show Read More/Read Less button if description exceeds 250 characters */}
      {item.Content.length > 250 && (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={[styles.readMore, { color: theme.primary }]}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
import { View, Text,TextInput,TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import Feather from '@expo/vector-icons/Feather';
export default function CommentInput({Comment,setComment,CommentHandler,placeholder}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor });

  return (
    <View>
         <View>
    <TextInput
    //   editable={!disabler}
    multiline
      style={styles.input}
    //   keyboardType={Keyboard}
      placeholder={placeholder|| 'Add your comment'}
      placeholderTextColor={'gray'}
      value={Comment}
      onChangeText={setComment}
    />
    {
        <TouchableOpacity onPress={()=>CommentHandler()} style={styles.eye}>
        {Comment!='' &&        <Feather name="send" size={24} color="black" />}
        </TouchableOpacity>
    }
  
  </View>
    </View>
  )
}
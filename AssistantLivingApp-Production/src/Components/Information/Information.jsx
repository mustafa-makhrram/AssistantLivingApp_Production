import { View, Text ,TouchableOpacity} from 'react-native'
import React,{useState} from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
export default function Information({PersonalInfo,setPersonalInfo,OtherInfo,setOtherInfo,AddressInfo,setAddressInfo}) {

    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
    const [PersonalColor, setPersonalColor] = useState(primary);
    const [AddressColor, setAddressColor] = useState('#ddd');
    const [OtherColor, setOtherColor] = useState('#ddd');
    const Personaler=()=>{
        setPersonalInfo(true);
        setAddressInfo(false);
        setOtherInfo(false);
        setPersonalColor(primary);
        setOtherColor('#ddd');
        setAddressColor('#ddd');
        }

    const Otherer=()=>{
        setPersonalInfo(false);
        setAddressInfo(false);
        setOtherInfo(true);
        setPersonalColor('#ddd');
        setOtherColor(primary);
        setAddressColor('#ddd');
        }

        const Addresser=()=>{
            setAddressInfo(true);
            setPersonalInfo(false);
            setOtherInfo(false);
            setPersonalColor('#ddd');
            setOtherColor('#ddd');
            setAddressColor(primary);
            }

  return (
    <View style={styles.rowcontainer}>
        <TouchableOpacity onPress={()=>Personaler()} style={styles.align}>
        <View style={styles.row}>
        {/* <FontAwesome name="user" size={24} color={PersonalColor} /> */}
        <Text style={{...styles.title,color:PersonalColor}}>Personal Info</Text>
        </View>
        <View style={{...styles.line,borderColor:PersonalColor,}}></View>

        </TouchableOpacity>

        <TouchableOpacity onPress={()=>Addresser()} style={styles.align}>
        <View style={styles.row}>
        {/* <FontAwesome name="user" size={24} color={AddressColor} /> */}
        <Text style={{...styles.title,color:AddressColor}}>Address Info</Text>
        </View>
        <View style={{...styles.line,borderColor:AddressColor,}}></View>

        </TouchableOpacity>

        <TouchableOpacity onPress={()=>Otherer()} style={styles.align}>
        <View style={styles.row}>
        {/* <FontAwesome name="user" size={24} color={OtherColor} /> */}
        <Text style={{...styles.title,color:OtherColor}}>Other Info</Text>
        </View>
        <View style={{...styles.line,borderColor:OtherColor,}}></View>
        </TouchableOpacity>
     
    </View>
  )
}
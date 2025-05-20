import { View, Text ,TouchableOpacity} from 'react-native'
import React,{useState} from 'react'
import { useTheme } from '../../../Theme';
import createStyles from './styles'

export default function BusinessTab({BusinessInfo,setBusinessInfo,AddressInfo,setAddressInfo,
    BusinessColor,setBusinessColor,AddressColor,setAddressColor,BusinessInfoEditor,AddressInfoEditor
}) {

    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg });
    // const [BusinessColor, setBusinessColor] = useState(primary);
    // const [AddressColor, setAddressColor] = useState('#ddd');
    // const BusinessInfoEditor=()=>{
    //     setBusinessInfo(true);
    //     setAddressInfo(false);
    //     setBusinessColor(primary);
    //     setAddressColor('#ddd');
    //     }


    //     const AddressInfoEditor=()=>{
    //         setAddressInfo(true);
    //         setBusinessInfo(false);
    //         setBusinessColor('#ddd');
    //         setAddressColor(primary);
    //         }

  return (
    <View style={styles.rowcontainer}>
        <TouchableOpacity onPress={()=>BusinessInfoEditor()} style={styles.align}>
        <View style={styles.row}>
        {/* <FontAwesome name="user" size={24} color={PersonalColor} /> */}
        <Text style={{...styles.title,color:BusinessColor}}>Business Info</Text>
        </View>
        <View style={{...styles.line,borderColor:BusinessColor,}}></View>

        </TouchableOpacity>

        <TouchableOpacity onPress={()=>AddressInfoEditor()} style={styles.align}>
        <View style={styles.row}>
        {/* <FontAwesome name="user" size={24} color={AddressColor} /> */}
        <Text style={{...styles.title,color:AddressColor}}>Address Info</Text>
        </View>
        <View style={{...styles.line,borderColor:AddressColor,}}></View>

        </TouchableOpacity>

      
     
    </View>
  )
}
import { View, Text,ScrollView,TouchableOpacity,Keyboard, ActivityIndicator } from 'react-native'
import React,{useState,useEffect} from 'react'
import { useTheme } from '../../../Theme'
import createStyles from './styles'
import CustomAlert from '../CustomAlert/CustomAlert'
import CustomTextinput from '../CustomTextInput/CustomTextinput'
import { LinearGradient } from 'expo-linear-gradient'
export default function BusinessAddressInfoViewer({Country,setCountry,State,setState,City,setCity,Area,setArea,PostalCode,setPostalCode,Address,setAddress,Submit,Alerter,Message,AlertType,Loader,setLoader}) {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme,gradientbg } = useTheme()
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor,gradientbg })

    // const [BusinessAddress, setBusinessAddress] = useState('');
    // const [BusinessArea, setBusinessArea] = useState('');
    // const [BusinessCity, setBusinessCity] = useState('');
    // const [BusinessState, setBusinessState] = useState('');
    // const [BusinessCountry, setBusinessCountry] = useState('');
    // const [BusinessPostalCode, setBusinessPostalCode] = useState('');
    // const [Loader, setLoader] = useState(false);

 
  return (
    <View>
          <ScrollView showsVerticalScrollIndicator={false}>
      {Alerter &&  <CustomAlert message={Message} visible={Alerter} type={AlertType} />} 
        <View style={styles.body}>
<CustomTextinput placeholder={'Country'} value={Country} onChangeText={setCountry} Importance={true}/>
<CustomTextinput placeholder={'State'} value={State} onChangeText={setState} Importance={true}/>
<CustomTextinput placeholder={'City'} value={City} onChangeText={setCity} Importance={true}/>
<CustomTextinput placeholder={'Area'} value={Area} onChangeText={setArea} Importance={true}/>
<CustomTextinput placeholder={'Postal Code'} value={PostalCode} onChangeText={setPostalCode} Importance={true}/>
<CustomTextinput placeholder={'Address'} value={Address} onChangeText={setAddress} Importance={true}/>
 <TouchableOpacity onPress={Submit} style={styles.btn2}>
                    
                      <LinearGradient
                        style={styles.gradient2}
                        colors={['#00853E', '#00A86B', '#00A86B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
          {
          Loader? <ActivityIndicator size="small" color="#fff" /> :   <Text style={styles.submitText}>Submit</Text>
          
          }
                      
                      </LinearGradient>
                    </TouchableOpacity>
            </View>
            </ScrollView>
    </View>
  )
}
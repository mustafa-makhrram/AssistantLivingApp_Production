import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({

    rowcontainer:{
        flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:scale(10),marginTop:scale(15)
    },
    end:{
  alignSelf:'flex-end',borderWidth:scale(1),borderColor:'#fff',borderRadius:scale(40),height:scale(40),width:scale(40),alignItems:"center",justifyContent:"center",
},
    round:{
        width:scale(40),height:scale(40),borderRadius:scale(50),backgroundColor:'transparent',justifyContent:'center',alignItems:'center',overflow:'hidden',
    },
    person:{
        resizeMode:"cover",width:'100%',height:'100%'
    },
    row:{
        flexDirection:'row',alignItems:'center',
    }
  });
};

export default createStyles;

import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
    inputbox:{
        width:'90%',height:scale(50),backgroundColor:'#ddd',alignItems:"center",marginVertical:scale(12),
        alignSelf:"center",borderRadius:scale(6)
    },
    input:{
        fontFamily:'PoppinsR',color:'black',backgroundColor:"#f1f4f5",minHeight:scale(40),paddingHorizontal:scale(10),
        borderRadius:scale(8),width:'90%',alignSelf:"center",marginBottom:scale(13),paddingVertical:scale(10)
    },
    eye:{
        position:"absolute",right:scale(20),top:scale(12)
    },
  });
};

export default createStyles;

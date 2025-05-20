import { Dimensions, Platform, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
    container:{
        flexDirection:"row",alignItems:"center",borderWidth:scale(0.7),
        borderColor:'#ddd',borderRadius:scale(9),margin:scale(10),padding:scale(10),width:'90%',
        alignSelf:"center"
    },
    input:{
        marginLeft:scale(10),fontSize:scale(15),fontFamily:'PoppinsR',width:devicewidth-scale(100),height:Platform.OS=='ios'? scale(30) : scale(40),
    }

  });
};

export default createStyles;

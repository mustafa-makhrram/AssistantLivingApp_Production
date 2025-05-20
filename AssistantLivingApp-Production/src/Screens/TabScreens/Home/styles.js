import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
container:{
    backgroundColor:theme.background,height:'100%',flex:1
},
sub:{
   padding:10,borderBottomLeftRadius:scale(20),borderBottomRightRadius:scale(20)
},
name:{
    fontFamily:'PoppinsM',fontSize:scale(25),color:'#fff',marginTop:scale(10),marginLeft:scale(10)
},
para:{
    fontFamily:'PoppinsR',fontSize:scale(13),color:'#fff',marginLeft:scale(10)
}

  });
};

export default createStyles;

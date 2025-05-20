import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
container:{
   alignItems:'center',justifyContent:'space-between',
   backgroundColor:theme.background,flexDirection:'row',paddingHorizontal:scale(10),paddingVertical:scale(10),
   elevation:4,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.25,shadowRadius: 3.84,width:"95%",alignSelf:"center",marginTop:scale(10),borderRadius:scale(32),zIndex:1000
},
title:{
    fontSize:scale(22),fontFamily:'PoppinsSB',color:theme.Tcolor,
},
back:{
    width:scale(40),height:scale(40),borderRadius:scale(50),backgroundColor:'rgba(128, 128, 128, 0.4)',justifyContent:'center',alignItems:'center'
  },
contact:{
    fontFamily:'PoppinsM',fontSize:scale(20),color:'white',marginTop:scale(10),textAlign:"center"
},
btn:{
    backgroundColor:theme.primary,padding:scale(5),borderRadius:scale(10),marginTop:scale(10),width:'90%',alignSelf:"center"
}

  });
};

export default createStyles;

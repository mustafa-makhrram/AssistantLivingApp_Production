import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
container:{
    flex:1,backgroundColor:theme.background
},
profileImage:{
  width:devicewidth,height:scale(300)
},
back:{
  width:scale(40),height:scale(40),borderRadius:scale(50),backgroundColor:'rgba(128, 128, 128, 0.7)',justifyContent:'center',alignItems:'center'
},
absoluterow:{
  position:'absolute',top:scale(10),left:scale(10),flexDirection:'row',zIndex:100,alignItems:"center",justifyContent:"space-between",width:devicewidth-scale(20)
},
name:{
  fontSize:scale(25),fontFamily:'PoppinsSB',color:theme.Tcolor,
},
title2:{
  fontSize:scale(20),fontFamily:'PoppinsSB',color:theme.Tcolor,
  marginTop:scale(10)
},
bottombox:{
  borderTopLeftRadius:scale(36),borderTopRightRadius:scale(36),backgroundColor:theme.background,height:'100%',zIndex:1000,top:scale(-30),paddingVertical:scale(20),paddingHorizontal:scale(10)

},
   end:{
  alignSelf:'flex-end',borderWidth:scale(1),borderColor:theme.primary,borderRadius:scale(40),height:scale(40),width:scale(40),alignItems:"center",justifyContent:"center",
},
row:{
flexDirection:"row",alignItems:'center',justifyContent:'space-between',
},
aboutme:{
  fontFamily:'PoppinsR',fontSize:scale(15),color:theme.Tcolor
},
aboutme2:{
  fontFamily:'PoppinsL',fontSize:scale(15),color:theme.Tcolor
},
button:{
  fontFamily:'PoppinsM',fontSize:scale(12),color:'#333'
}


  });
};

export default createStyles;

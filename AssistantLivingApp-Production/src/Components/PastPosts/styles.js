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
  fontSize:scale(18),fontFamily:'PoppinsM',color:theme.Tcolor,marginTop:scale(10)
},
bottombox:{
  borderTopLeftRadius:scale(36),borderTopRightRadius:scale(36),backgroundColor:'#fff',flex:1,zIndex:1000,top:scale(-30),padding:scale(20)

},
aboutme:{
  fontFamily:'PoppinsR',fontSize:scale(12),color:theme.Tcolor
},
aboutme2:{
  fontFamily:'PoppinsL',fontSize:scale(11),color:theme.Tcolor
},
button:{
  fontFamily:'PoppinsM',fontSize:scale(12),color:'#333'
},
postcontainer:{
    borderRadius:scale(20),backgroundColor:'#fff',marginRight:scale(10),padding:scale(10),elevation:scale(5),shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.25,shadowRadius:3.84,
   width:scale(230),marginVertical:scale(10),marginLeft:scale(10),textAlign:'left',minHeight:scale(150)
},
despost:{
    fontFamily:'PoppinsR',fontSize:scale(12),color:theme.Tcolor
},
readMore:{
    fontFamily:'PoppinsM',fontSize:scale(12),color:theme.Tcolor
}


  });
};

export default createStyles;

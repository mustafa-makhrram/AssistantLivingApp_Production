import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
container:{
    flex:1,backgroundColor:theme.background,
},
contact:{
    fontFamily:'PoppinsM',fontSize:scale(20),color:'white',marginTop:scale(10),textAlign:"center"
},
btn:{
    backgroundColor:theme.primary,padding:scale(5),borderRadius:scale(10),marginTop:scale(10),width:'90%',alignSelf:"center"
},
gradient:{
  height:scale(150),alignItems:"center",justifyContent:"center"
},
sign:{
  fontFamily:'PoppinsSB',fontSize:scale(35),color:'#fff',alignSelf:"center"
},
name:{
  fontFamily:'PoppinsSB',fontSize:scale(25),color:theme.Tcolor,
},
para:{
  fontFamily:'PoppinsR',fontSize:scale(15),color:'gray'
},
block:{
  marginHorizontal:scale(20),marginTop:scale(20)
},
block2:{
  flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginHorizontal:scale(20),marginVertical:scale(20)
},
block1:{
  flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:scale(15),elevation:3,shadowColor: '#333',shadowOpacity: 0.27,shadowOffset: { width: 0, height: 2 },shadowRadius: 5
  ,backgroundColor:theme.background,padding:scale(10),borderRadius:scale(5),width:'100%',borderWidth:scale(1),borderColor:theme.primary
},
block3:{
  flexDirection:"row",alignItems:"center"
},
icontxt:{
  fontFamily:'PoppinsR',fontSize:scale(18),color:theme.Tcolor,marginLeft:scale(20)
},
titlesub:{
fontFamily:'PoppinsM',fontSize:scale(18),color:'#fff',marginLeft:scale(10),
},
titlesub2:{
  fontFamily:'PoppinsR',fontSize:scale(14),color:'#fff',marginLeft:scale(10),
  },
button:{
  alignItems:"center", justifyContent:'center',height:scale(50),width:scale(50),borderRadius:scale(6),overflow:"hidden",backgroundColor:'#ff8564',
},
input:{
  fontFamily:'PoppinsR',color:'black',backgroundColor:"#f1f4f5",height:scale(40),paddingHorizontal:scale(10),
  borderRadius:scale(8),width:'90%',alignSelf:"center",marginBottom:scale(13),justifyContent:'space-between',flexDirection:"row",alignItems:"center"
},
input2:{
   fontFamily:'PoppinsR',color:'black',
},
input3:{
  fontFamily:'PoppinsR',color:theme.primary,marginLeft:scale(17)
},
nextbtn:{
  backgroundColor:theme.primary,padding:scale(10),borderRadius:scale(10),marginVertical:scale(10),width:'90%',alignSelf:"center",alignItems:"center",justifyContent:'center',flexDirection:"row",
  height:scale(50)
},
next:{
  fontFamily:'PoppinsM',fontSize:scale(15),color:'white',marginRight:scale(10)
},
inputpass:{
  fontFamily:'PoppinsR',color:'black',backgroundColor:"#f1f4f5",height:scale(40),paddingHorizontal:scale(10),borderRadius:scale(8),marginBottom:scale(25)
},
eye:{
  position:"absolute",right:scale(25),top:scale(9)
},
btn3:{
  alignItems:"center", justifyContent:'center',marginVertical:scale(10),width:'90%',alignSelf:"center",height:scale(50),borderRadius:scale(6),overflow:"hidden",
  // elevation:4,shadowColor: '#333',shadowOpacity: 0.5,shadowOffset: { width: 0, height: 2 },shadowRadius: 8
},
gradient2:{
  alignItems:"center", justifyContent:'center',width:"100%",height:'100%',flexDirection:"row",
 //  elevation:4,shadowColor: '#333',shadowOpacity: 0.5,shadowOffset: { width: 0, height: 2 },shadowRadius: 8
},
row:{
  flexDirection:"row",alignItems:"center",justifyContent:'space-between',alignSelf:'flex-start'
},
imagecontainer:{
  width:'90%',alignSelf:"center",height:scale(200),borderRadius:scale(10),overflow:"hidden",marginTop:scale(10),backgroundColor:'#f1f4f5',marginBottom:scale(13)
},
edit:{
  position:'absolute',alignSelf:"center",top:scale(90),backgroundColor:'rgba(0, 102, 0, 0.6)',padding:scale(5),borderRadius:scale(10)
},
image:{
  resizeMode:"cover",width:'100%',height:'100%'
},
header:{
  height:scale(250),backgroundColor:theme.primary,alignItems:"center",justifyContent:"center",borderBottomLeftRadius:scale(10),borderBottomRightRadius:scale(10),marginBottom:scale(10),paddingHorizontal:scale(20),
},
headerText:{
  fontFamily:'PoppinsSB',fontSize:scale(32),color:'#fff',alignSelf:"flex-start",marginTop:scale(30),marginBottom:scale(10)
},
end:{
  alignSelf:'flex-end',borderWidth:scale(1),borderColor:'#fff',borderRadius:scale(40),height:scale(40),width:scale(40),alignItems:"center",justifyContent:"center",
},
person:{
  width:scale(70),height:scale(70),borderRadius:scale(50),overflow:"hidden",backgroundColor:'#f1f4f5',alignItems:"center",justifyContent:"center"
},
logo:{
  width:'100%',height:'100%',resizeMode:'cover'
},

switch:{
  backgroundColor:'gray',height:scale(40),width:scale(80),borderRadius:scale(20),alignItems:"center",justifyContent:"center",marginRight:scale(10)
}
  });
};

export default createStyles;

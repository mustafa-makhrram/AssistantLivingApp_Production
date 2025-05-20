import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
container:{
    flex:1,backgroundColor:theme.background
},
contact:{
    fontFamily:'PoppinsM',fontSize:scale(20),color:'white',marginTop:scale(10),textAlign:"center"
},
btn:{
    backgroundColor:theme.primary,padding:scale(5),borderRadius:scale(10),marginTop:scale(10),width:'90%',alignSelf:"center"
},
container: {
  flex:1,height:deviceheight,backgroundColor:theme.background
  },

  sign:{
      fontFamily:'PoppinsSB',fontSize:scale(35),color:'#fff',alignSelf:"center"
  },
  gradient:{
      height:scale(150),alignItems:"center",justifyContent:"center"
  },
  bottomview:{
      borderTopLeftRadius:scale(18),borderTopRightRadius:scale(18),backgroundColor:theme.background,flex:1,top:scale(-20),paddingHorizontal:scale(30),paddingVertical:scale(30)
  },
  wel:{
      color:theme.Tcolor,fontSize:scale(16),fontFamily:'PoppinsR' ,
  },
  sub:{
      color:'darkgray',fontSize:scale(10),fontFamily:'PoppinsR' ,marginBottom:scale(25)

  },
  sub2:{
      color:'darkgray',fontSize:scale(11),fontFamily:'PoppinsL' ,marginLeft:scale(12)

  },
  sub3:{
      color:theme.primary,fontSize:scale(12),fontFamily:'PoppinsR' ,marginLeft:scale(62)

  },
  input:{
      fontFamily:'PoppinsR',color:'black',backgroundColor:"#f1f4f5",height:scale(40),paddingHorizontal:scale(10),borderRadius:scale(8),marginBottom:scale(25)
  },
  eye:{
      position:"absolute",right:scale(7),top:scale(9)
  },
  row:{
      alignItems:"center",flexDirection:"row"
  },
  box:{
      height:scale(18),width:scale(19),borderRadius:scale(4),borderColor:'gray',borderWidth:scale(0.6),alignItems:"center", justifyContent:"center"
  },
  btn:{
      alignItems:"center", justifyContent:'center',marginVertical:scale(50),width:'95%',alignSelf:"center",height:scale(50),borderRadius:scale(6),overflow:"hidden"
  },
  gradient2:{
       alignItems:"center", justifyContent:'center',width:"100%",height:'100%'
  },
  sub4:{
      fontFamily:'PoppinsR',fontSize:scale(16),color:'white'
  },
  bline:{
      backgroundColor:'gray',height:scale(0.6),width:'40%',
    },
    gray:{
      fontFamily:'PoppinsL',fontSize:scale(14),color:'gray',marginHorizontal:scale(10)
    },
    row2:{
      alignItems:"center",flexDirection:"row",alignSelf:"center"

    },
    iconbar:{
      justifyContent:'space-evenly',alignItems:'center',flexDirection:"row",marginTop:scale(30)
    },
    lotie:{
      width:scale(150),height:scale(150)
    }

  });
};

export default createStyles;

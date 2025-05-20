import { Dimensions, StyleSheet } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";

const devicewidth = Dimensions.get("window").width;
const deviceheight = Dimensions.get("window").height;

const createStyles = (theme) => {
  return StyleSheet.create({
    container: {
    flex:1,height:deviceheight,backgroundColor:theme.background
    },
    lotie:{
        width:scale(150),height:scale(150)
      },

    sign:{
        fontFamily:'PoppinsSB',fontSize:scale(28),color:'white'
    },
    gradient:{
        height:scale(150),padding:scale(40)
    },
    bottomview:{
        borderTopLeftRadius:scale(25),borderTopRightRadius:scale(25),backgroundColor:theme.background,flex:1,top:scale(-20),paddingHorizontal:scale(30),paddingVertical:scale(30),
       
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
        alignItems:"center", justifyContent:'center',marginTop:scale(50),width:'95%',alignSelf:"center",height:scale(50),borderRadius:scale(6),overflow:"hidden",
        // elevation:4,shadowColor: '#333',shadowOpacity: 0.5,shadowOffset: { width: 0, height: 2 },shadowRadius: 8
    },
    gradient2:{
         alignItems:"center", justifyContent:'center',width:"100%",height:'100%',
        //  elevation:4,shadowColor: '#333',shadowOpacity: 0.5,shadowOffset: { width: 0, height: 2 },shadowRadius: 8
    },
    sub4:{
        fontFamily:'PoppinsR',fontSize:scale(16),color:'white'
    },
    sub5:{
        fontFamily:'PoppinsR',fontSize:scale(14),color:theme.primary
    },
    bline:{
        backgroundColor:'gray',height:scale(0.6),width:'40%',
      },
      gray:{
        fontFamily:'PoppinsL',fontSize:scale(14),color:'gray',marginRight:scale(5)
      },
      row2:{
        alignItems:"center",flexDirection:"row",alignSelf:"center"

      },
      iconbar:{
        justifyContent:'space-evenly',alignItems:'center',flexDirection:"row",marginTop:scale(30)
      }

  });
};

export default createStyles;

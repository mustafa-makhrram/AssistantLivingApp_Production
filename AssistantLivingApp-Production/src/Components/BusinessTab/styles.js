import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
    rowcontainer:{
        flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:scale(20)
        // borderWidth:scale(0.7),borderColor:'#ddd',borderRadius:scale(22),padding:scale(10)
    },
    container:{
        flex:1,backgroundColor:theme.background
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
     editbtn:{
       position:'absolute',top:scale(10),right:scale(10),backgroundColor:'#ddd',padding:scale(5),borderRadius:scale(22),
     },
    body:{
        marginTop:scale(10),padding:scale(10),backgroundColor:theme.background
      },
      btn2:{
        alignItems:"center", justifyContent:'center',marginTop:scale(20),width:'90%',alignSelf:"center",height:scale(50),borderRadius:scale(6),overflow:"hidden",
        // elevation:4,shadowColor: '#333',shadowOpacity: 0.5,shadowOffset: { width: 0, height: 2 },shadowRadius: 8
      },
      gradient2:{
         alignItems:"center", justifyContent:'center',width:"100%",height:'100%',
        //  elevation:4,shadowColor: '#333',shadowOpacity: 0.5,shadowOffset: { width: 0, height: 2 },shadowRadius: 8
      },
      submitText:{
        color:'#fff',fontFamily:'PoppinsM',fontSize:scale(16)
      },
    row:{
        flexDirection:"row",alignItems:"center",
    },
    title:{
        fontFamily:'PoppinsM',fontSize:scale(19),color:theme.Tcolor,marginLeft:scale(10)
    },
    align:{
        alignItems:"center"

    },
    line:{
        borderWidth:scale(0.9),width:'100%',marginTop:scale(7)
    },
    imagebox:{
     overflow:'hidden',   height:scale(240),width: devicewidth-65,borderRadius:scale(10),backgroundColor:'#eee',alignItems:"center",justifyContent:"center",marginBottom:scale(13),marginRight:scale(10)
    },
    image:{
width:'100%',resizeMode:'cover',height:'100%'
    },
    info:{
        marginTop:scale(10),flex:1

    },
    absolutebtn:{
        position:'absolute',backgroundColor:'#ddd',padding:scale(5),top:scale(110),borderRadius:scale(10),alignItems:"center",justifyContent:"center",
    },
    title2:{
        fontFamily:'PoppinsM',fontSize:scale(14),color:theme.Tcolor,marginLeft:scale(15),
    },
    title3:{
        fontFamily:'PoppinsL',fontSize:scale(14),color:'red',marginLeft:scale(15),fontStyle:'italic'
    },
  });
};

export default createStyles;

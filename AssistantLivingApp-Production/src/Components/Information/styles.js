import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
    rowcontainer:{
        flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:scale(10)
        // borderWidth:scale(0.7),borderColor:'#ddd',borderRadius:scale(22),padding:scale(10)
    },
    row:{
        flexDirection:"row",alignItems:"center",
    },
    title:{
        fontFamily:'PoppinsM',fontSize:scale(15),color:theme.Tcolor,marginLeft:scale(10)
    },
    align:{
        alignItems:"center"

    },
    line:{
        borderWidth:scale(0.9),width:'100%',marginTop:scale(7)
    },
    info:{
        marginTop:scale(10),flex:1

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

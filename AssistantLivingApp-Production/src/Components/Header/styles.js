import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({

    rowcontainer:{
        
        flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:scale(10),
        paddingBottom:scale(10),backgroundColor:theme.background,elevation:2,
        shadowColor: 'gray',shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,shadowRadius: 1,marginTop:scale(10),borderRadius:scale(20),paddingHorizontal:scale(10),
        paddingVertical:scale(10),width:devicewidth-scale(20),marginBottom:scale(20)
    },
    head:{
fontFamily:'PoppinsSB',fontSize:scale(22),color:theme.Tcolor
    },
    back:{
        width:scale(40),height:scale(40),borderRadius:scale(50),backgroundColor:'rgba(128, 128, 128, 0.7)',justifyContent:'center',alignItems:'center'
      },
    round:{
        width:scale(60),height:scale(60),borderRadius:scale(50),backgroundColor:'#50C878',justifyContent:'center',alignItems:'center',overflow:'hidden',
    },
    person:{
        resizeMode:"cover",width:'100%',height:'100%'
    },
    row:{
        flexDirection:'row',alignItems:'center',
    }
  });
};

export default createStyles;

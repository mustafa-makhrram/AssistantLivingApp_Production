import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
    modal:{
      backgroundColor:'#fff',height:scale(200)
    },
    modalbox: {
        width: devicewidth - 60,
        backgroundColor: 'white',
        // height: scale(100),
        // alignSelf: "center",
        top:scale(80),
        // paddingVertical:scale(12),
        overflow:'hidden',
        position:"absolute",
        borderTopLeftRadius:scale(16),
        borderBottomLeftRadius:scale(16),
        borderBottomRightRadius:scale(16),
        // borderRadius: scale(16),
        // padding: scale(12),
        elevation: 4, // for Android shadow
        // iOS shadow properties
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    btn:{
        flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%",padding:scale(12),
    },
    line:{
        width:'100%',height:1,backgroundColor:'#333',alignSelf:"center"
    },
    txt:{
        fontFamily:"PoppinsM",fontSize:scale(16),color:theme.primary
    }
  });
};

export default createStyles;

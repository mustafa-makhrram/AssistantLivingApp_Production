import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
    modal:{
      backgroundColor:'#fff',height:scale(200)
    },
    title:{
fontFamily:'PoppinsM',fontSize:scale(20),color:theme.primary,alignSelf:"center",
    },
    modalbox: {
        width: devicewidth - 60,
        backgroundColor: theme.background,
       
        overflow:'hidden',
        borderRadius:scale(16),
        padding:scale(12),
      minHeight:scale(300),
        elevation: 4, // for Android shadow
        // iOS shadow properties
        alignSelf:"center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    btn:{
       alignSelf:'flex-end',paddingTop:scale(12),
    },
    line:{
        width:'100%',height:1,backgroundColor:'#333',alignSelf:"center"
    },
    txt:{
        fontFamily:"PoppinsM",fontSize:scale(16),color:theme.Tcolor
    },
    txt2:{
      fontFamily:"PoppinsL",fontSize:scale(14),color:theme.Tcolor
  },
    btn2:{
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
  });
};

export default createStyles;

import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      // width:devicewidth-100
      // height: deviceheight,
    },
    gradient2:{
      height:'100%',width:"100%",
      //    paddingHorizontal: scale(12),
      // paddingVertical: scale(8),
    },
    toggle:{
      overflow:'hidden',
width:scale(57),height:scale(32),borderRadius:scale(28),borderColor:theme.Tcolor,borderWidth:scale(1),marginLeft:scale(20),flexDirection:"row",alignItems:'center',padding:scale(4),justifyContent:'space-between',
    },
    round:{
      width:scale(22),height:scale(22),borderRadius:scale(30)
          },
    texts: {
      fontSize: 40,
      color: 'red',
    },
    img: {
      height:scale(24),width:scale(200),marginTop:scale(30)

    },
    logo:{
        overflow:"hidden",
        margin:12,flexDirection:"row",alignItems:"center"
        // backgroundColor:'red'
    },

    head:{
      fontSize:scale(22),fontFamily:'PoppinsT', color:theme.Tcolor
    },
    SideBar:{
marginTop:scale(50),alignItems:"center",flexDirection:'column',justifyContent:'space-between'
    },
    icon:{
      marginRight:scale(22)
    },
    iconsetting:{
      marginRight:scale(15)

    },  iconlanguage:{
      marginRight:scale(10)

    },
    
    icon2:{
     position:"absolute",right:scale(12)

    },
    menuItemText:{
      color:theme.Tcolor,fontFamily:'PoppinsL',fontSize:scale(15)
    },
    menuItem:{
      flexDirection:"row",alignItems:"center",paddingVertical:scale(12),width:'100%',marginBottom:scale(5),paddingHorizontal:scale(12)
    },
    ml:{
      marginLeft:scale(39)
    },
    ml2:{
      marginLeft:scale(69)
    },
    settingsfont:{
      fontFamily:'PoppinsL',fontSize:scale(13),color:theme.Tcolor
    },
    settingsfontbtn:{
      flexDirection:'row',alignItems:'center',marginBottom:scale(5),width:'100%',paddingVertical:scale(10),paddingHorizontal:scale(12)
    },
    languagebtn:{
      flexDirection:'row',alignItems:'center',marginBottom:scale(5),width:'100%',paddingVertical:scale(10)
    },
    languagefont:{
      fontFamily:'PoppinsL',fontSize:scale(10),color:theme.Tcolor
    },
    bgimage:{
      overflow:'hidden',objectFit:"fill"
    }
  });
};

export default createStyles;

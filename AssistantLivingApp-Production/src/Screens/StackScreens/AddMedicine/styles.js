import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
container:{
    flex:1,backgroundColor:theme.background
},

header: {
  backgroundColor: '#4CAF50',
  padding: scale(16),
  alignItems: 'center',
  // borderBottomLeftRadius: 20,
  // borderBottomRightRadius: 20,
},
headerText: {
  fontSize: scale(20),
  color: '#fff',
  fontFamily:'PoppinsM'
},
searchBar: {
  marginTop: 20,
  marginHorizontal: 15,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  elevation: 3,
  paddingHorizontal: 15,
  paddingVertical: 8,
},
input: {
  fontSize: 16,
},
listContainer: {
  paddingHorizontal: 15,
  paddingVertical: 10,
},
userCard: {
  backgroundColor: '#ddd',
  marginBottom: scale(8),
  padding: scale(12),
  borderRadius: scale(10),
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
},
userName: {
  fontSize: scale(14),
  fontFamily:'PoppinsM',
  color: theme.Tcolor,
},
row:{
  flexDirection:'row',alignItems:'center'
},
round:{
  width:scale(50),height:scale(50),borderRadius:scale(25),backgroundColor:'#fff',justifyContent:'center',alignItems:'center',overflow:'hidden',marginRight:scale(10)
},
profileImage:{
  resizeMode:"cover",width:"100%",height:'100%'
},
align:{
  alignItems:"flex-start"
},
cat:{
  fontSize:scale(12),color:theme.Tcolor,fontFamily:'PoppinsL'
},
absolute:{
  position:'absolute',top:scale(5),right:scale(5)
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
//   input:{
//     fontFamily:'PoppinsR',color:'black',backgroundColor:"#f1f4f5",height:scale(40),paddingHorizontal:scale(10),
//     borderRadius:scale(8),width:'90%',alignSelf:"center",marginBottom:scale(13)
// },
eye:{
    position:"absolute",right:scale(28),top:scale(12)
},

btn:{
    alignItems:"center", justifyContent:'center',marginTop:scale(50),width:'90%',alignSelf:"center",height:scale(50),borderRadius:scale(6),overflow:"hidden",
    // elevation:4,shadowColor: '#333',shadowOpacity: 0.5,shadowOffset: { width: 0, height: 2 },shadowRadius: 8
},
gradient2:{
     alignItems:"center", justifyContent:'center',width:"100%",height:'100%',
    //  elevation:4,shadowColor: '#333',shadowOpacity: 0.5,shadowOffset: { width: 0, height: 2 },shadowRadius: 8
},
sub4:{
    fontFamily:'PoppinsR',fontSize:scale(16),color:'white'
},
timelist:{
   padding:scale(10),borderRadius:scale(10),marginBottom:scale(10),flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:scale(20),backgroundColor:'#eee'
}
  });
};

export default createStyles;

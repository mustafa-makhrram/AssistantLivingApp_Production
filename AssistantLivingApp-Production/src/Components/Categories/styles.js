import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
container:{
    // flex:1,backgroundColor:theme.background
    // flex: 1,
    // backgroundColor: "red",
    padding: 10,
},
row:{
    flexDirection:'row',justifyContent:'space-between',margin:scale(10),alignItems:"center"
},
row3:{
    flexDirection:'row',alignItems:"center"
},
row9:{
    flexDirection:'row',alignItems:"center", justifyContent:'space-between',width:'100%',marginBlock:scale(10)
},
row2:{
  flexDirection:'row',justifyContent:'space-between',alignItems:"center"
},
offers:{
    height:'100%',width:'100%',alignItems:"center",justifyContent:"center"
},
box:{
height:scale(500),width:'30%',backgroundColor:"red"
},
center:{
    justifyContent:'center',alignItems:'center'
},
rowaligner:{
flexDirection:"row",alignItems:"flex-start",width:devicewidth
},
section: {
    padding: 20,
    overflow: "hidden",
    // elevation:4,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    minHeight:scale(70),
    borderRadius: 15,
    marginBottom: scale(10),
  },


  section2: {
    // padding: 20,
    
    elevation:4,
    // alignItems:'center',
    marginTop:scale(30),
    alignSelf:'center',
    width:'90%',
    // position:'absolute',
    justifyContent:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height:scale(60),
    borderRadius: 25,
    alignItems:'center',
    marginBottom: scale(10),
  },
  emergencytitle: {
    fontSize: scale(22),
    fontFamily: "PoppinsSB",
    alignSelf: "center",
    color: "#fff",
  },
  rowalign:{
flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:'100%'
  },
  smallSection: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: scale(18),
fontFamily:'PoppinsSB',color:theme.Tcolor,
    // color: "#333",
    // marginBottom: scale(5),
  },
  title2:{
fontFamily:'PoppinsSB',
color:theme.Tcolor, fontSize:scale(15),textDecorationLine:'underline',marginBottom:scale(5)
  },

  // section: {
  //   padding: scale(15),
  //   borderRadius: scale(15),
  //   marginBottom: scale(10),
  //   width: "100%",
  // },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(10),
  },
  title: {
    fontSize: scale(18),
    fontFamily: "PoppinsSB",
    color: '#000'
  },
  title2: {
    fontSize: scale(18),
    fontFamily: "PoppinsSB",
    color:theme.Tcolor,
  },

  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    width: '100%',
    alignItems: "center",
    paddingBottom: scale(5),
    marginBottom: scale(5),
  },
  columnHeader: {
    fontSize: scale(14),
    fontFamily: "PoppinsSB",
    color: "gray",
    // width: devicewidth * 0.3,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    marginBottom: scale(5),
    width:devicewidth,
    alignSelf:'center',
  },
   tableRow2: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    marginBottom: scale(5),
    width:devicewidth,
    alignSelf:'center',
  },
  noMedsText: {
    fontSize: scale(14),
    fontFamily: "PoppinsM",
    fontStyle:'italic',
    color:theme.Tcolor,
    textAlign: "left",
  },
  column: {
    fontSize: scale(14),
    fontFamily: "PoppinsM",
    color:theme.Tcolor,
    width: devicewidth * 0.3,
    textAlign: "center",
  },
  name: {
    fontSize: scale(13),
    fontFamily:'PoppinsM',color:theme.Tcolor,

  },
  name2: {
    fontSize: scale(13),
    fontFamily:'PoppinsM',color:'#333',

  },
  time: {
    fontSize: scale(14),
    fontFamily:'PoppinsR',color:'#333',
    // marginBottom: scale(5),
  },
  description: {
    fontSize: scale(15),
    fontFamily:'PoppinsR',color:'#000',
    marginLeft: scale(10),

    // marginBottom: scale(10),
  },

  description3: {
    fontSize: scale(15),
    fontFamily:'PoppinsR',color:'#000',
    marginHorizontal: scale(10),

    // marginBottom: scale(10),
  },
  ontime:{
backgroundColor:'rgba(144, 238, 144, 0.5)',alignItems:"center",justifyContent:"center",width:'32%',height:scale(50),borderRadius:10

  },
  late:{
    backgroundColor:'rgba(226, 223, 25, 0.3)',alignItems:"center",justifyContent:"center",width:'32%',height:scale(50),borderRadius:10
    
      },

      missed:{
        backgroundColor:'rgba(243, 99, 231, 0.3)',alignItems:"center",justifyContent:"center",width:'32%',height:scale(50),borderRadius:10
        
          },
  label:{
    fontSize: scale(18),
    fontFamily:'PoppinsSB',color:'#000',
    
  },
  label2:{
    fontSize: scale(14),
    fontFamily:'PoppinsR',color:'#000',
  },

  adherenceblock:{
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation:3,
    width:devicewidth-40,alignSelf:"center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    padding: scale(10),
    marginBottom: scale(10),
  },
  description2: {
    fontSize: scale(15),
    fontFamily:'PoppinsR',color:'#36454F',
    marginLeft: scale(10),

    // marginBottom: scale(10),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  icon: {
   marginRight: scale(10),
  },
  exploreButton: {
    backgroundColor: theme.Tcolor,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  exploreText: {
    color: "#fff",
    fontWeight: "bold",
  },
  downloadButton: {
    backgroundColor:theme.Tcolor,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  downloadText: {
    color: "#fff",
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#444",
    marginTop: 10,
  },
  phone: {
    fontSize: 14,
    color: "#444",
    marginTop: 5,
  },
  backButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor:'#fff',
    borderRadius: 10,
    // elevation:4,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // padding: scale(10),
    // marginBottom: scale(10),
  },
  btn:{
    backgroundColor: "#1AA7EC",
    borderRadius: 8,
    padding: scale(10),
    alignItems: "center",
    // marginTop: scale(10),
  },
  btnText:{
    color: "#fff",
    fontWeight: "bold",
  },
  });
};

export default createStyles;

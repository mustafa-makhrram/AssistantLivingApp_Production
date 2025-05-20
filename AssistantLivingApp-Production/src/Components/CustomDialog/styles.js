import { Dimensions, StyleSheet } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

const devicewidth = Dimensions.get("window").width;
const deviceheight = Dimensions.get("window").height;

const createStyles = (theme) => {
  return StyleSheet.create({
    dialog: {
      borderRadius: scale(11),
      backgroundColor: "red",
      width: "90%",
      paddingHorizontal: scale(10),
      height: scale(30),
      alignSelf: "center",
    },
    modalbox: {
      width: devicewidth - 60,
      backgroundColor: "white",
      paddingHorizontal: scale(12),
      overflow: "hidden",
      paddingVertical: scale(20),

      borderRadius: scale(10),

      elevation: 4,

      alignSelf: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    titleContainer: {
      flexDirection: "column",
    },
    title: {
      fontSize: scale(20),
      fontFamily: "PoppinsM",
      // alignSelf:"center",
      color: theme.Tcolor,
    },
    subtitle: {
      fontSize: scale(10),
      fontFamily: "PoppinsR",
      marginBottom: scale(10),
      color: "#333",
    },
    btn:{
      alignItems:"center", justifyContent:'center',marginVertical:scale(10),width:'80%',alignSelf:"center",height:scale(45),borderRadius:scale(6),overflow:"hidden",
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
    input:{
      fontFamily:'PoppinsR',color:'black',backgroundColor:"#f1f4f5",height:scale(40),paddingHorizontal:scale(10),
      borderRadius:scale(8),width:'100%',alignSelf:"center",marginBottom:scale(13)
  },
    tabRow: {
      alignItems: "flex-start",
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    activeTab: {
      fontWeight: "bold",
      color: "purple",
      textDecorationLine: "underline",
    },
    activeTab2: {
      // fontWeight: "bold",
      fontFamily: "PoppinsM",
      color: "red",
      textDecorationLine: "underline",
    },
    inactiveTab: {
      color: "#888",
    },
    divider: {
      height: 1,
      backgroundColor: "#333",
      // marginVertical: 10,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 5,
    },
    label: {
      fontSize: 14,
      color: "#888",
    },
    value: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#000",
    },
    completedChip: {
      backgroundColor: "#d4f4e4",
      color: "green",
      borderRadius: 5,
    },
    surfaceChip: {
      backgroundColor: "#e6e6e6",
      color: "#000",
      borderRadius: 5,
    },
    notesLabel: {
      fontSize: 14,
      fontWeight: "bold",
      marginTop: 10,
    },
    notesText: {
      fontSize: 12,
      color: "#555",
      marginTop: 5,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      width: "100%",
    },
    completeButton: {
      backgroundColor: "#ace1af",
      margin: 5,
    },
    issueButton: {
      backgroundColor: "#f8d7da",
      margin: 5,
    },
    skipButton: {
      backgroundColor: "#fdfd96",
      margin: 5,
    },
    closeButton: {
      backgroundColor: "#e9967a",
      margin: 5,
    },
  });
};

export default createStyles;

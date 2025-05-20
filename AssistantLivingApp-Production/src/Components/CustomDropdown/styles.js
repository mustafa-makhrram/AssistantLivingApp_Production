import { Dimensions, StyleSheet } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const createStyles = (theme) => {
  return StyleSheet.create({
    container: {
        // marginVertical: 10,
        width:'90%',alignSelf :"center",marginBottom:scale(13),

      },
      dropdownButton: {
        flexDirection: 'row',
        height:scale(40),
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f1f4f5',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        // borderWidth: 1,
        // borderColor: '#ccc',
      },
      selectedText: {
        fontSize: 16,
        color: '#333',
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
      dropdown: {
        position: 'absolute',
        top: '50%',
        left: '5%',
        right: '5%',
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      item: {
        padding: 15,
        // borderBottomWidth: 1,
        // borderBottomColor: '#f0f0f0',
      },
      itemText: {
        fontSize: scale(14),
        fontFamily:'PoppinsR',
        color: '#333',
      },

  });
};

export default createStyles;

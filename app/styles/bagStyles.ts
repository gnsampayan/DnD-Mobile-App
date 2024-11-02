import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 50,
    },
    headerLeft: {
      flexDirection: 'row',
      gap: 5,
    },
    headerText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    },
    headerIcons: {
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    headerIcon: {
      color: 'white',
    },
    grid: {
      paddingVertical: 10,
    },
    itemModalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    itemContainer: {
      margin: 5,
      aspectRatio: 1,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      overflow: 'hidden',
      flexGrow: 0,
      flexShrink: 0,
    },
    itemTextContainer: {
      padding: 5,
      borderRadius: 8,
    },
    itemText: {
      fontSize: 14,
    },
    quantityContainer: {
      padding: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: 8,
    },
    quantityText: {
      fontSize: 12,
      color: 'black',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    addItemContainer: {
      margin: 5,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      overflow: 'hidden',
    },
    addItemButton: {
      flex: 1,
      aspectRatio: 1,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
      minWidth: '80%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
    },
    modalInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 4,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: 20,
      gap: 10,
    },
    modalButtonReset: {
      backgroundColor: 'darkred',
      borderRadius: 4,
      paddingHorizontal: 15,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    modalButton: {
      backgroundColor: 'gray',
      borderRadius: 4,
      paddingHorizontal: 15,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    modalButtonAdd: {
      backgroundColor: '#007AFF',
      borderRadius: 4,
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    itemImageBackground: {
      flex: 1,
      backgroundColor: 'white',
      resizeMode: 'contain',
    },
    itemContent: {
      padding: 5,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderWidth: 2,
      borderColor: 'white',
      borderStyle: 'solid',
      borderRadius: 8,
    },
    itemModalContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      padding: 20,
      paddingTop: 60,
      position: 'relative',
    },
    closeButton: {
      backgroundColor: '#fff',
      borderRadius: 50,
      padding: 10,
      marginTop: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemModalImage: {
      width: '100%',
      height: 200,
      resizeMode: 'contain',
    },
    itemModalNoImage: {
      width: '100%',
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ddd',
    },
    itemModalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
      width: '100%',
    },
    itemModalButton: {
      backgroundColor: '#007AFF',
      borderRadius: 4,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    itemModalButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    imagePickerButton: {
      backgroundColor: '#007AFF',
      borderRadius: 4,
      paddingVertical: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    imagePickerButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    selectedImage: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
      borderRadius: 8,
      alignSelf: 'center',
      marginBottom: 10,
    },
    quantityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    quantityButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 4,
      padding: 10,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    incrementByTen: {
      borderWidth: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderColor: 'black',
      borderRadius: 4,
      padding: 10,
      marginRight: 10,
    },
    decrementByTen: {
      borderWidth: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderColor: 'black',
      borderRadius: 4,
      padding: 10,
      marginLeft: 10,
    },
    quantityInput: {
      height: 40,
      width: 100,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 4,
      textAlign: 'center',
      fontSize: 18,
      marginHorizontal: 10,
    },
    modalOverlayTouchable: {
      flex: 1,
    },
    detailsInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    itemModalDetails: {
      fontSize: 14,
      marginBottom: 20,
    },
    headerTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    closeButtonContainer: {
      position: 'absolute',
      width: '100%',
      bottom: 40,
      left: 20,
    },

  });

  export default styles;
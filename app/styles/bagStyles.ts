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
      flexDirection: 'column',
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
      flex: 1,
      margin: 5,
      aspectRatio: 1,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      overflow: 'hidden',
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
      flex: 1,
      margin: 5,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
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
      justifyContent: 'flex-end',
    },
    modalButtonCancel: {
      marginRight: 10,
    },
    modalButtonReset: {
      backgroundColor: '#ff0000',
      borderRadius: 4,
      paddingHorizontal: 15,
      paddingVertical: 10,
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
    },
    itemModalContainer: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
      alignItems: 'center',
      position: 'relative',
      justifyContent: 'space-between',
      height: 'auto',
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
      backgroundColor: '#007AFF',
      borderRadius: 4,
      padding: 10,
      marginHorizontal: 5,
    },
    quantityButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
    },
    quantityInput: {
      height: 40,
      width: 60,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 4,
      textAlign: 'center',
      fontSize: 18,
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

  });

  export default styles;
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
    // Styles for header icons
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
    itemContainer: {
      flex: 1,
      margin: 5,
      aspectRatio: 1, // Ensure the item is square
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#eee',
      borderRadius: 8,
    },
    itemText: {
      fontSize: 14,
    },
    // Styles for the add item container (plus icon button)
    addItemContainer: {
      flex: 1,
      margin: 5,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ccc',
      borderRadius: 8,
    },
    // Modal overlay to center the modal content
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    // Modal container
    modalContainer: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
    },
    // Modal title
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    // Modal text
    modalText: {
      fontSize: 16,
      marginBottom: 20,
    },
    modalDetails: {
      fontSize: 16,
      marginBottom: 20,
      color: 'black',
    },
    // Modal input fields
    modalInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 4,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    // Modal buttons container
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    // Modal cancel button
    modalButtonUse: {
      marginRight: 10,
      backgroundColor: 'green',
      padding: 10,
      borderRadius: 8,
    },
    // Modal add/reset button
    modalButtonAdd: {
      backgroundColor: '#007AFF',
      borderRadius: 4,
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    // Modal button text
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    // Add these styles
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
    itemContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemModalImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      borderRadius: 8,
      alignSelf: 'center',
      marginBottom: 10,
    },
    itemModalNoImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      borderRadius: 8,
      alignSelf: 'center',
      marginBottom: 10,
    },
    // Add this style to your existing styles
    detailsInput: {
      height: 100, // Adjust height as needed
      textAlignVertical: 'top', // Align text to the top
      borderColor: '#ccc', // Optional: border color
      borderWidth: 1, // Optional: border width
      borderRadius: 5, // Optional: border radius
      padding: 10, // Optional: padding
    },
    costInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    costInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    costInputLabel: {
      marginRight: 10,
      fontWeight: 'bold',
    },
    costInput: {
      flex: 1,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 4,
      marginRight: 10,
      paddingHorizontal: 10,
    },
    footerButton: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 8,
    },  
    footerButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });

  export default styles;
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
    headerTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
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
    itemTextContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 8,
      padding: 10,
    },
    itemText: {
      fontSize: 16,
      color: 'white',
      fontWeight: 'normal',
    },
    // Styles for the add item container (plus icon button)
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
      justifyContent: 'center',
      paddingTop: 20,
      gap: 10,
    },
    // Modal cancel button
    modalButtonCommit: {
      marginRight: 10,
      backgroundColor: 'rgba(0, 122, 255, 0.1)', // #007AFF with 10% opacity
      borderColor: '#007AFF',
      borderWidth: 2,
      padding: 10,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
    },
    // Modal add/reset button
    modalButtonAdd: {
      backgroundColor: 'darkgreen',
      borderRadius: 4,
      paddingHorizontal: 15,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
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
    // Modal button text
    modalButtonTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    modalButtonTextBlack: {
      color: 'black',
      fontWeight: 'bold',
    },
    modalCostContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    costTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
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
      width: '100%',
      height: '100%',
    },
    itemModalImageContainer: {
      aspectRatio: 1,
      borderRadius: 8,
      width: '100%',
      padding: 10,
      alignItems: 'center',
    },
    itemModalImage: {
      width: '100%',
      height: undefined,
      aspectRatio: 1,
      resizeMode: 'contain',
      borderRadius: 8,
      alignSelf: 'center',
      marginBottom: 20,
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
    footerButtonContainer: {
      borderRadius: 8,
      margin: 5,
      overflow: 'hidden',
      
    },  
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    footerButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
      textTransform: 'capitalize',
    },
  });

  export default styles;
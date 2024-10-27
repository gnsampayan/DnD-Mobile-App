import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        padding: 10,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 10,
        textTransform: 'capitalize',
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        color: '#fff',
        fontSize: 14,
    },
    section: {
        marginBottom: 10,
    },
    addSpellButton: {
        margin: 5,
        aspectRatio: 1,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
        flexGrow: 0,
        flexShrink: 0,
    },
    spellButtonBackground: {
        flex: 1,
        backgroundColor: 'white',
        resizeMode: 'contain',
    },
    spellBlock: {
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
    addCantripButton: {
        margin: 5,
        aspectRatio: 1,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
        flexGrow: 0,
        flexShrink: 0,
    },
    cantripButtonBackground: {
        flex: 1,
        backgroundColor: 'black',
    },
    cantripBlock: {
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
    cantripModal: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        minWidth: '80%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    modalButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default styles;
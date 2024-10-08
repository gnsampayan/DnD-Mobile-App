import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f8f8f8', // Light gray for header
        marginTop: 50,
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 10,
        gap: 10,
    },
    hpText: {
        fontSize: 18,
    },
    characterStatsButton: {
        backgroundColor: '#4A90E2', // Subtle blue for button
        borderRadius: 5,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    userAccountButton: {
        backgroundColor: '#4A4A4A', // Dark gray for a more serious look
        borderRadius: 5,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        gap: 10,
    },
    section2: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
    section3: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        backgroundColor: '#1A1A1A', // Very dark grey, almost black
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        borderRadius: 8,
    },
    image: {
        width: '100%', // Make the image fill the width of the section
        height: '100%', // Set height to fill the container
    },
    section4: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
    section5: {
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingTop: 0,
    },
    melee: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
    ranged: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    weapon: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        height: '100%',
        aspectRatio: 1,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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
        justifyContent: 'space-between',
    },
    modalButtonAdd: {
        backgroundColor: '#007AFF',
        borderRadius: 4,
        padding: 10,
        flex: 1,
        marginLeft: 5,
    },
    modalButtonSubtract: {
        backgroundColor: '#8b00a0',
        borderRadius: 4,
        padding: 10,
        flex: 1,
        marginRight: 5,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Ensure it takes full height
        backgroundColor: 'transparent', // Set to transparent or desired color
    },
    equipment: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    equipmentItem: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
    },
});

export default styles;
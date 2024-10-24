import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
    },
    statsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        padding: 10,
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
        color: 'white',
        fontWeight: 'bold',
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
        borderRadius: 8,
        height: '100%',
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'solid',
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
        gap: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
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
        gap: 10,
    },
    modalButtonsColumn: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 20,
    },
    modalSideBySide: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalButtonAdd: {
        backgroundColor: '#007AFF',
        borderRadius: 4,
        padding: 10,
        flex: 1,
    },
    modalColumn: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 10,
    },
    modalButtonReplenish: {
        backgroundColor: '#007AFF',
        borderRadius: 4,
        padding: 10,
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
        fontSize: 18,
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
        backgroundColor: 'black',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'solid',
    },
    equipmentItemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 8,
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    meleeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    characterStatsContainer: {
        padding: 10,
    },
    hpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        gap: 5,
    },
    firstRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    rowIconTitle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 5,
    },
    firstRowContents: {
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        padding: 10,
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'solid',
        flex: 1,
    },
    levelContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        padding: 10,
        gap: 5,
    },
    levelContainerHighlighted: {
        borderWidth: 2,
        borderColor: 'gold',
    },
    firstRowText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    modalText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    modalResetButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 4,
        padding: 10,
        alignSelf: 'flex-start',
        marginRight: 5,
    },
    modalResetButtonText: {
        color: 'red',
        fontWeight: 'normal',
        textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerIcon: {
        color: 'white',
    },
    abilityContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        aspectRatio: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 8,
        position: 'relative',
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'solid',
    },
    abilityValueContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 1,
        borderRadius: 8,
        marginBottom: 10,
    },
    abilityOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 8,
        overflow: 'hidden',
    },
    abilityName: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 5,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    abilityValue: {
        fontSize: 36,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    abilityBackgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 8,
    },
    gridRow: {
        justifyContent: 'flex-start',
        gap: 10,
    },
    gridContainer: {
        gap: 10,
        justifyContent: 'flex-start',
    },
    skillsGridContainer: {
        gap: 10,
        justifyContent: 'flex-start',
    },
    abilityModifier: {
        color: 'black',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        textAlign: 'left',
        fontSize: 12,
        fontWeight: 'bold',
    },
    abilityModifierContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 8,
    },
    abilityModifierFooter: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 5,
    },
    savingThrowsContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderRadius: 8,
        position: 'relative',
        padding: 10,
    },
    savingThrowsTitle: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    savingThrowsGrid: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
    },
    savingThrowSquare: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        margin: 5,
        aspectRatio: 1,
    },
    savingThrowModifier: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    savingThrowAbility: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'normal',
    },
    skillContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        position: 'relative',
        padding: 5,
    },
    skillValue: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    skillName: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'normal',
        textAlign: 'center',
        width: '100%',
    },
    skillsContainer: {
        gap: 10,
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderStyle: 'solid',
        marginBottom: 10,
    },
    skillsTitle: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    characterStatsTitle: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    acText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    modalSubtitle: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    availableAbilityPoints: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    availableAbilityPointsContainer: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    availableAbilityPointsHighlighted: {
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        padding: 5,
        borderRadius: 4,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    availableAbilityPointsNotHighlighted: {
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: 5,
        borderRadius: 8,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    modalConfirmButton: {
        backgroundColor: '#007AFF',
        borderRadius: 4,
        padding: 10,
        marginTop: 10,
    },
    modalLabel: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    modalHeaderText: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    modalInputLabel: {
        fontSize: 12,
        color: 'black',
        fontWeight: 'normal',
    },
    modalRowContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 10,
    },
    formContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 10,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 4,
        padding: 10,
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        borderRadius: 4,
        padding: 10,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    twoHandedWeapon: {
        borderWidth: 2,
        borderColor: 'gold',
        borderRadius: 8,
        padding: 0,
    },
    
    twoHandedLabel: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        color: 'gold',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 'bold',
        padding: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        marginLeft: 5,
        marginBottom: 5,
    },
});

export default styles;
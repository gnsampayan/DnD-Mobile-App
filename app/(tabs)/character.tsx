import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    Alert,
    Dimensions,
    ImageBackground,
    ImageSourcePropType,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/meStyles';
import { Ionicons } from '@expo/vector-icons';
import StatsDataContext from '../context/StatsDataContext';
import DropDownPicker from 'react-native-dropdown-picker';
import classItems from '../data/classData.json';

// Import default images
import defaultHelmetImage from '@equipment/default-helmet.png';
import defaultCapeImage from '@equipment/default-cape.png';
import defaultArmorImage from '@equipment/default-armor.png';
import defaultGauntletsImage from '@equipment/default-gauntlets.png';
import defaultBootsImage from '@equipment/default-boots.png';
import defaultNecklaceImage from '@equipment/default-necklace.png';
import defaultRingImage from '@equipment/default-ring.png';
import defaultMeleeWeaponImage from '@equipment/default-melee.png';
import defaultOffhandWeaponImage from '@equipment/default-offhand.png';
import defaultRangedWeaponImage from '@equipment/default-ranged.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import raceBonuses from '../data/raceData.json';

interface EquipmentItem {
    id: string;
    name: string;
    defaultImage: ImageSourcePropType;
    customImageUri?: string;
    section: number;
}

interface Ability {
    id: number;
    name: string;
    value: number;
}

interface AllocationHistory {
    [level: number]: {
        [abilityId: number]: number;
    };
}

interface StatsData {
    xp: number;
    level: number;
    abilities: Ability[];
    allocationsPerLevel: AllocationHistory;
    race?: string;
    class?: string;
    hpIncreases: { [level: number]: number };
    hitDice: number;
}

// Define a function to clear AsyncStorage
const clearAsyncStorage = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Failed to clear AsyncStorage:', error);
    }
};

export default function MeScreen() {
    // Define equipment items
    const initialEquipmentItems: EquipmentItem[] = [
        // Section 2 items
        { id: 'helmet', name: 'Helmet', defaultImage: defaultHelmetImage as ImageSourcePropType, section: 2 },
        { id: 'cape', name: 'Cape', defaultImage: defaultCapeImage as ImageSourcePropType, section: 2 },
        { id: 'armor', name: 'Armor', defaultImage: defaultArmorImage as ImageSourcePropType, section: 2 },
        { id: 'gauntlets', name: 'Gauntlets', defaultImage: defaultGauntletsImage as ImageSourcePropType, section: 2 },
        { id: 'boots', name: 'Boots', defaultImage: defaultBootsImage as ImageSourcePropType, section: 2 },
        // Section 4 items
        { id: 'necklace', name: 'Necklace', defaultImage: defaultNecklaceImage as ImageSourcePropType, section: 4 },
        { id: 'ring1', name: 'Ring 1', defaultImage: defaultRingImage as ImageSourcePropType, section: 4 },
        { id: 'ring2', name: 'Ring 2', defaultImage: defaultRingImage as ImageSourcePropType, section: 4 },
        // Section 5 items
        { id: 'mainMelee', name: 'Main Melee', defaultImage: defaultMeleeWeaponImage as ImageSourcePropType, section: 5 },
        { id: 'offhandMelee', name: 'Offhand Melee', defaultImage: defaultOffhandWeaponImage as ImageSourcePropType, section: 5 },
        { id: 'mainRanged', name: 'Main Ranged', defaultImage: defaultRangedWeaponImage as ImageSourcePropType, section: 5 },
    ];
    // State variables
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>(initialEquipmentItems);
    const [characterModalVisible, setCharacterModalVisible] = useState(false);

    // Use context for statsData
    const { statsData, updateStatsData } = useContext(StatsDataContext) as {
        statsData: StatsData;
        updateStatsData: (data: StatsData) => void;
    };

    if (!statsData) {
        // Render a loading indicator or return null
        return null;
    }

    const { hitDice = 0 } = statsData || {};

    // State variables for DropDownPicker
    const [openRace, setOpenRace] = useState(false);
    const [openClass, setOpenClass] = useState(false);
    const [raceValue, setRaceValue] = useState<string | null>(statsData.race || null);
    const [classValue, setClassValue] = useState<string | null>(statsData.class || null);
    // State to track if race and class have been confirmed
    const [isRaceConfirmed, setIsRaceConfirmed] = useState<boolean>(!!statsData.race);
    const [isClassConfirmed, setIsClassConfirmed] = useState<boolean>(!!statsData.class);




    useEffect(() => {
        // Load custom images for equipment items
        const loadEquipmentImages = async () => {
            const updatedItems = await Promise.all(
                equipmentItems.map(async (item) => {
                    try {
                        const base64Image = await AsyncStorage.getItem(`equipmentImage-${item.id}`);
                        if (base64Image) {
                            return {
                                ...item,
                                customImageUri: `data:image/jpeg;base64,${base64Image}`,
                            };
                        }
                    } catch (e) {
                        console.error(`Failed to load image for ${item.name}:`, e);
                    }
                    return item;
                })
            );
            setEquipmentItems(updatedItems);
        };

        loadEquipmentImages();

        // Load the main image URI
        const loadMainImage = async () => {
            try {
                const base64Image = await AsyncStorage.getItem('mainImage');
                if (base64Image) {
                    setImageUri(`data:image/jpeg;base64,${base64Image}`);
                }
            } catch (e) {
                console.error('Failed to load main image:', e);
            }
        };

        loadMainImage();

        // Initalize race and class
        setRaceValue(statsData.race || null);
        setClassValue(statsData.class || null);
    }, []);

    const handleImageLongPress = () => {
        if (imageUri) {
            Alert.alert('Image Options', 'What would you like to do?', [
                {
                    text: 'Replace Image',
                    onPress: pickMainImage,
                },
                {
                    text: 'Delete Image',
                    onPress: deleteMainImage,
                    style: 'destructive',
                },
                { text: 'Cancel', style: 'cancel' },
            ]);
        } else {
            pickMainImage();
        }
    };

    // Pick image for the main character
    const pickMainImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need permission to access your media library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: true, // Request base64 encoding
        });

        if (!result.canceled) {
            const base64Image = result.assets[0].base64;

            if (base64Image) {
                try {
                    await AsyncStorage.setItem('mainImage', base64Image);
                    setImageUri(`data:image/jpeg;base64,${base64Image}`);
                } catch (error) {
                    console.error('Failed to save main image:', error);
                }
            }
        }
    };


    const handleEquipmentLongPress = (equipmentId: string) => {
        const item = equipmentItems.find((item) => item.id === equipmentId);

        if (item) {
            Alert.alert(
                'Image Options',
                item.customImageUri ? 'What would you like to do with the image?' : 'You can add an image.',
                [
                    ...(item.customImageUri
                        ? [
                            {
                                text: 'Replace Image',
                                onPress: () => pickEquipmentImage(equipmentId),
                            },
                            {
                                text: 'Delete Image',
                                onPress: () => deleteEquipmentImage(equipmentId),
                            },
                        ]
                        : [
                            {
                                text: 'Add Image',
                                onPress: () => pickEquipmentImage(equipmentId),
                            },
                        ]),
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
        }
    };

    const pickEquipmentImage = async (equipmentId: string) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need permission to access your media library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: true, // Request base64 encoding
        });

        if (!result.canceled) {
            const base64Image = result.assets[0].base64;

            if (base64Image) {
                try {
                    await AsyncStorage.setItem(`equipmentImage-${equipmentId}`, base64Image);
                    setEquipmentItems((prevItems) =>
                        prevItems.map((item) =>
                            item.id === equipmentId
                                ? { ...item, customImageUri: `data:image/jpeg;base64,${base64Image}` }
                                : item
                        )
                    );
                } catch (error) {
                    console.error('Failed to save equipment image:', error);
                }
            }
        }
    };

    const deleteMainImage = async () => {
        try {
            await AsyncStorage.removeItem('mainImage');
            setImageUri(null);
        } catch (error) {
            console.error('Failed to delete main image:', error);
        }
    };

    const deleteEquipmentImage = async (equipmentId: string) => {
        try {
            await AsyncStorage.removeItem(`equipmentImage-${equipmentId}`);
            setEquipmentItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === equipmentId ? { ...item, customImageUri: undefined } : item
                )
            );
        } catch (error) {
            console.error('Failed to delete equipment image:', error);
        }
    };

    const handleSaveRaceAndClass = () => {
        Alert.alert(
            'Confirm Selections',
            'Changes you make are permanent and cannot be changed. Do you want to proceed?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => {
                        // Confirm race selection
                        if (!isRaceConfirmed && !isClassConfirmed) {
                            setIsRaceConfirmed(true);
                            setIsClassConfirmed(true);
                            const selectedClass = classItems.find((item) => item.value === classValue);
                            const newHitDice = selectedClass ? selectedClass.hitDice : 0;
                            const updatedStatsData = {
                                ...statsData,
                                race: raceValue || '',
                                class: classValue || '',
                                hitDice: newHitDice,
                            };
                            updateStatsData(updatedStatsData);
                            handleRaceAndClassBonus(updatedStatsData);
                        }
                    },
                },
            ],
            { cancelable: false },
        );
    };
    const handleRaceAndClassBonus = (updatedStatsData: StatsData) => {
        const selectedRaceBonus = raceBonuses.find(bonus => bonus.race === updatedStatsData.race);

        if (selectedRaceBonus) {
            const updatedAbilities = updatedStatsData.abilities.map(ability => {
                const abilityName = ability.name.toLowerCase() as keyof typeof selectedRaceBonus.bonuses;
                const bonusValue = selectedRaceBonus.bonuses[abilityName] || 0;
                return {
                    ...ability,
                    value: ability.value + bonusValue
                };
            });
            updateStatsData({
                ...updatedStatsData,
                abilities: updatedAbilities
            });
        }
    };

    const handleDeleteCharacter = () => {
        setRaceValue(null);
        setClassValue(null);
        setImageUri(null);
        setIsRaceConfirmed(false);
        setIsClassConfirmed(false);
        updateStatsData({
            ...statsData,
            race: null || '',
            class: null || '',
            hitDice: 0,
            hpIncreases: {},
            xp: 0,
            level: 1,
            abilities: [
                { id: 1, name: 'Strength', value: 8 },
                { id: 2, name: 'Dexterity', value: 8 },
                { id: 3, name: 'Constitution', value: 8 },
                { id: 4, name: 'Intelligence', value: 8 },
                { id: 5, name: 'Wisdom', value: 8 },
                { id: 6, name: 'Charisma', value: 8 },
            ],
            allocationsPerLevel: { 1: {} },
        });
        // Clear AsyncStorage
        clearAsyncStorage();
    };


    // Calculate half of the screen width
    const screenWidth = Dimensions.get('window').width;
    const section3Width = (1 / 2) * screenWidth;

    return (
        <View style={styles.container}>
            {/* Section 1: Header */}
            <View style={styles.header}>
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.userAccountButton}>
                        <Ionicons name="settings" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Section 2, 3, and 4: Main Content */}
            <View style={styles.mainContent}>
                {/* Section 2 */}
                <View style={styles.section2}>
                    {equipmentItems
                        .filter((item) => item.section === 2)
                        .map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.equipmentItem}
                                onPress={() => { }}
                                onLongPress={() => handleEquipmentLongPress(item.id)}
                            >
                                <ImageBackground
                                    source={
                                        item.customImageUri
                                            ? { uri: item.customImageUri }
                                            : item.defaultImage
                                    }
                                    style={styles.equipmentItemImage}
                                >
                                    {/* Optional: Add overlay or text */}
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                </View>

                {/* Section 3 */}
                <TouchableOpacity onLongPress={handleImageLongPress} onPress={() => setCharacterModalVisible(true)}>
                    <View style={[styles.imageContainer, { width: section3Width }]}>
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.emptyImageContainer}>
                                <Text>No Image available</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Section 4 */}
                <View style={styles.section4}>
                    {equipmentItems
                        .filter((item) => item.section === 4)
                        .map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.equipmentItem}
                                onPress={() => { }}
                                onLongPress={() => handleEquipmentLongPress(item.id)}
                            >
                                <ImageBackground
                                    source={
                                        item.customImageUri
                                            ? { uri: item.customImageUri }
                                            : item.defaultImage
                                    }
                                    style={styles.equipmentItemImage}
                                >
                                    {/* Optional: Add overlay or text */}
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                </View>
            </View>

            {/* Section 5: Bottom Section */}
            <View style={styles.section5}>
                <View style={styles.meleeContainer}>
                    {equipmentItems
                        .filter((item) => item.section === 5 && (item.id === 'mainMelee' || item.id === 'offhandMelee'))
                        .map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.weapon}
                                onPress={() => { }}
                                onLongPress={() => handleEquipmentLongPress(item.id)}
                            >
                                <ImageBackground
                                    source={
                                        item.customImageUri ? { uri: item.customImageUri } : item.defaultImage
                                    }
                                    style={styles.equipmentItemImage}
                                >
                                    {/* Optional: Add overlay or text */}
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                </View>
                {equipmentItems
                    .filter((item) => item.section === 5 && item.id === 'mainRanged')
                    .map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.weapon}
                            onPress={() => { }}
                            onLongPress={() => handleEquipmentLongPress(item.id)}
                        >
                            <ImageBackground
                                source={
                                    item.customImageUri ? { uri: item.customImageUri } : item.defaultImage
                                }
                                style={styles.equipmentItemImage}
                            >
                                {/* Optional: Add overlay or text */}
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
            </View>
            {/* Character Modal */}
            <Modal animationType="fade" transparent={true} visible={characterModalVisible}>
                <TouchableWithoutFeedback onPress={() => setCharacterModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Character Settings</Text>
                                <TouchableOpacity onPress={() => {
                                    Alert.alert('Are you sure you want to delete this character?', 'This action cannot be undone.', [
                                        {
                                            text: 'Cancel',
                                            style: 'cancel'
                                        },
                                        {
                                            text: 'Delete',
                                            style: 'destructive',
                                            onPress: async () => {
                                                handleDeleteCharacter();
                                            }
                                        }
                                    ])
                                }}>
                                    <Text style={{
                                        color: 'red',
                                        padding: 10,
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        borderWidth: 1,
                                        borderColor: 'red',
                                        borderRadius: 5
                                    }}>Delete Character</Text>
                                </TouchableOpacity>
                                <View style={styles.formContainer}>
                                    <View style={[styles.modalRowContainer, { zIndex: 3000 }]}>
                                        <Text style={styles.modalLabel}>Race:</Text>
                                        {isRaceConfirmed ? (
                                            <Text style={styles.modalLabel}>{statsData.race}</Text>
                                        ) : (
                                            <DropDownPicker
                                                open={openRace}
                                                value={raceValue}
                                                items={raceBonuses.map((race) => ({ label: race.race, value: race.race }))}
                                                setOpen={setOpenRace}
                                                setValue={setRaceValue}
                                                placeholder="Select a race"
                                                containerStyle={{ height: 40, width: 200 }}
                                                style={{ backgroundColor: '#fafafa' }}
                                                dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                                                zIndex={3000}
                                            />
                                        )}
                                    </View>
                                    <View style={[styles.modalRowContainer, { zIndex: 2000 }]}>
                                        <Text style={styles.modalLabel}>Class:</Text>
                                        {isClassConfirmed ? (
                                            <>
                                                <Text style={styles.modalLabel}>{statsData.class}</Text>
                                                <View style={[styles.modalRowContainer, { zIndex: 1000 }]}>
                                                    <Text style={styles.modalLabel}>Hit Dice: {hitDice}</Text>
                                                </View>
                                            </>
                                        ) : (
                                            <DropDownPicker
                                                open={openClass}
                                                value={classValue}
                                                items={classItems}
                                                setOpen={setOpenClass}
                                                setValue={setClassValue}
                                                placeholder="Select a class"
                                                containerStyle={{ height: 40, width: 200 }}
                                                style={{ backgroundColor: '#fafafa' }}
                                                dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                                                zIndex={2000}
                                            />
                                        )}
                                    </View>
                                    {(!isRaceConfirmed || !isClassConfirmed) && (
                                        <TouchableOpacity
                                            style={styles.submitButton}
                                            onPress={() => {
                                                handleSaveRaceAndClass();
                                            }}
                                        >
                                            <Text style={styles.submitButtonText}>Save Changes</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>



                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
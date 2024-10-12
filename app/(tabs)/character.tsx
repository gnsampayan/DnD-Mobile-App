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
import * as FileSystem from 'expo-file-system';
import styles from '../styles/meStyles';
import { Ionicons } from '@expo/vector-icons';
import StatsDataContext from '../context/StatsDataContext';
import DropDownPicker from 'react-native-dropdown-picker';

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

export default function MeScreen() {
    // State variables
    const [imageUri, setImageUri] = useState<string | null>(null);
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

    // Define race items
    const raceItems = [
        { label: 'Human', value: 'Human' },
        { label: 'Elf', value: 'Elf' },
        { label: 'Dwarf', value: 'Dwarf' },
        { label: 'Halfling', value: 'Halfling' },
        { label: 'Gnome', value: 'Gnome' },
        { label: 'Half-Elf', value: 'Half-Elf' },
        { label: 'Half-Orc', value: 'Half-Orc' },
        { label: 'Tiefling', value: 'Tiefling' },
        { label: 'Dragonborn', value: 'Dragonborn' },
    ];

    // Define class items with hitDice
    const classItems = [
        { label: 'Artificer', value: 'Artificer', hitDice: 8 },
        { label: 'Barbarian', value: 'Barbarian', hitDice: 12 },
        { label: 'Bard', value: 'Bard', hitDice: 8 },
        { label: 'Cleric', value: 'Cleric', hitDice: 8 },
        { label: 'Druid', value: 'Druid', hitDice: 8 },
        { label: 'Fighter', value: 'Fighter', hitDice: 10 },
        { label: 'Monk', value: 'Monk', hitDice: 8 },
        { label: 'Paladin', value: 'Paladin', hitDice: 10 },
        { label: 'Ranger', value: 'Ranger', hitDice: 10 },
        { label: 'Rogue', value: 'Rogue', hitDice: 8 },
        { label: 'Sorcerer', value: 'Sorcerer', hitDice: 6 },
        { label: 'Warlock', value: 'Warlock', hitDice: 8 },
        { label: 'Wizard', value: 'Wizard', hitDice: 6 },
    ];

    // Update statsData.race when raceValue changes
    useEffect(() => {
        if (raceValue !== statsData.race) {
            updateStatsData({
                ...statsData,
                race: raceValue || '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [raceValue]);

    // Update statsData.class and hitDice when classValue changes
    useEffect(() => {
        if (classValue !== statsData.class) {
            // Find the selected class item
            const selectedClass = classItems.find((item) => item.value === classValue);
            const newHitDice = selectedClass ? selectedClass.hitDice : 0;

            updateStatsData({
                ...statsData,
                class: classValue || '',
                hitDice: newHitDice,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classValue]);

    // Initialize classValue and hitDice when statsData.class changes (e.g., on load)
    useEffect(() => {
        if (statsData.class) {
            setClassValue(statsData.class);
            const selectedClass = classItems.find((item) => item.value === statsData.class);
            if (selectedClass) {
                updateStatsData({
                    ...statsData,
                    hitDice: selectedClass.hitDice
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statsData.class]);

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

    const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>(initialEquipmentItems);

    useEffect(() => {
        // Load custom images for equipment items
        const loadEquipmentImages = async () => {
            const updatedItems = await Promise.all(
                equipmentItems.map(async (item) => {
                    try {
                        const fileUri = `${FileSystem.documentDirectory}equipmentImages/${item.id}.png`;
                        const fileInfo = await FileSystem.getInfoAsync(fileUri);
                        if (fileInfo.exists) {
                            return { ...item, customImageUri: fileUri };
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
        const loadImageUri = async () => {
            try {
                const fileUri = `${FileSystem.documentDirectory}mainImage.png`;
                const fileInfo = await FileSystem.getInfoAsync(fileUri);
                if (fileInfo.exists) {
                    setImageUri(fileUri);
                }
            } catch (e) {
                console.error('Failed to load main image:', e);
            }
        };
        loadImageUri();
    }, []);

    const handleImagePress = () => {
        if (imageUri) {
            Alert.alert('Image Options', 'What would you like to do?', [
                {
                    text: 'Replace Image',
                    onPress: pickMainImage,
                },
                {
                    text: 'Delete Image',
                    onPress: async () => {
                        setImageUri(null);
                        await FileSystem.deleteAsync(`${FileSystem.documentDirectory}mainImage.png`, { idempotent: true });
                    },
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
        });

        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;
            const localUri = `${FileSystem.documentDirectory}mainImage.png`;

            try {
                await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}`, { intermediates: true });
                await FileSystem.copyAsync({ from: selectedImageUri, to: localUri });
                setImageUri(localUri);
            } catch (error) {
                console.error('Failed to save main image:', error);
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
        });

        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;
            const localUri = `${FileSystem.documentDirectory}equipmentImages/${equipmentId}.png`;

            try {
                await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}equipmentImages`, { intermediates: true });
                await FileSystem.copyAsync({ from: selectedImageUri, to: localUri });
                const timestamp = new Date().getTime();
                setEquipmentItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === equipmentId
                            ? { ...item, customImageUri: `${localUri}?t=${timestamp}` }
                            : item
                    )
                );
            } catch (error) {
                console.error('Failed to save equipment image:', error);
            }
        }
    };

    const deleteEquipmentImage = async (equipmentId: string) => {
        const localUri = `${FileSystem.documentDirectory}equipmentImages/${equipmentId}.png`;

        try {
            await FileSystem.deleteAsync(localUri, { idempotent: true });
            setEquipmentItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === equipmentId ? { ...item, customImageUri: undefined } : item
                )
            );
        } catch (error) {
            console.error('Failed to delete equipment image:', error);
        }
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
                <TouchableOpacity onLongPress={handleImagePress} onPress={() => setCharacterModalVisible(true)}>
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
                                <View style={[styles.modalRowContainer, { zIndex: 3000 }]}>
                                    <Text style={styles.modalLabel}>Race: {statsData.race ? statsData.race : 'None'}</Text>
                                    <DropDownPicker
                                        open={openRace}
                                        value={raceValue}
                                        items={raceItems}
                                        setOpen={setOpenRace}
                                        setValue={setRaceValue}
                                        placeholder="Select a race"
                                        containerStyle={{ height: 40, width: 200 }}
                                        style={{ backgroundColor: '#fafafa' }}
                                        dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                                        zIndex={3000}
                                    />
                                </View>
                                <View style={[styles.modalRowContainer, { zIndex: 2000 }]}>
                                    <Text style={styles.modalLabel}>Class: {statsData.class ? statsData.class : 'None'}</Text>
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
                                </View>
                                <View style={[styles.modalRowContainer, { zIndex: 1000 }]}>
                                    <Text style={styles.modalLabel}>Hit Dice: {hitDice}</Text>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
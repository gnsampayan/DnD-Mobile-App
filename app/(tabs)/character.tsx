import React, { useState, useEffect } from 'react';
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
    FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; // Import FileSystem
import styles from '../styles/meStyles';
import { Ionicons } from '@expo/vector-icons';

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

interface EquipmentItem {
    id: string;
    name: string;
    defaultImage: ImageSourcePropType;
    customImageUri?: string;
    section: number;
}

export default function MeScreen() {
    const [hp, setHp] = useState(20);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);

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

    const handleHpChange = (operation: 'add' | 'subtract') => {
        const changeValue = parseInt(inputValue) || 0;
        if (operation === 'add') {
            setHp((prevHp) => Math.max(prevHp + changeValue, 0));
        } else if (operation === 'subtract') {
            setHp((prevHp) => Math.max(prevHp - changeValue, 0));
        }
        setInputValue('');
        setModalVisible(false);
    };

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

    const [ac, setAc] = useState(10);

    useEffect(() => {
        const loadAcData = async () => {
            try {
                const dataString = await AsyncStorage.getItem('statsData');
                if (dataString) {
                    const data = JSON.parse(dataString);
                    if (Array.isArray(data.abilities)) {
                        const dexterity = data.abilities.find((ability: { name: string }) => ability.name === 'Dexterity');
                        if (dexterity && 'value' in dexterity) {
                            const dexModifier = Math.floor((dexterity.value - 10) / 2);
                            setAc(10 + dexModifier);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading AC data:', error);
            }
        };

        loadAcData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Section 1: Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.hpContainer}>
                    <Ionicons name="heart" size={24} color="red" />
                    <Text style={styles.hpText}>{hp > 0 ? `${hp}` : 'Death Saving Throw'}</Text>
                </TouchableOpacity>
                <View>
                    <Ionicons name="shield" size={24} color="white" />
                    <Text style={styles.acText}>{ac}</Text>
                </View>
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
                <TouchableOpacity onLongPress={handleImagePress}>
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

            {/* HP Change Modal */}
            <Modal animationType="fade" transparent={true} visible={modalVisible}>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Current HP: {hp}</Text>
                                    <TouchableOpacity
                                        style={styles.modalResetButton}
                                        onPress={() => {
                                            Alert.alert(
                                                "Reset HP",
                                                "Are you sure you want to reset your HP to 20?",
                                                [
                                                    {
                                                        text: "Cancel",
                                                        style: "cancel"
                                                    },
                                                    {
                                                        text: "Reset",
                                                        style: "destructive",
                                                        onPress: () => setHp(20)
                                                    }
                                                ]
                                            );
                                        }}
                                    >
                                        <Text style={styles.modalResetButtonText}>Reset</Text>
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Enter number"
                                    keyboardType="number-pad"
                                    placeholderTextColor="gray"
                                    onChangeText={setInputValue}
                                    value={inputValue}
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.modalButtonSubtract}
                                        onPress={() => handleHpChange('subtract')}
                                    >
                                        <Text style={styles.modalButtonText}>Subtract</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modalButtonAdd}
                                        onPress={() => handleHpChange('add')}
                                    >
                                        <Text style={styles.modalButtonText}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
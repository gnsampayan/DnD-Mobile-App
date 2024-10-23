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
import { Item, useItemEquipment } from '../context/ItemEquipmentContext';
import { CharacterContext, WeaponSlot } from '../context/equipmentActionsContext';

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

    // State variables for weapon modals
    const [mainHandModalVisible, setMainHandModalVisible] = useState(false);
    const [offHandModalVisible, setOffHandModalVisible] = useState(false);
    const [rangedHandModalVisible, setRangedHandModalVisible] = useState(false);

    // State variables for DropDownPicker for each slot
    const [openMainHandPicker, setOpenMainHandPicker] = useState(false);
    const [openOffHandPicker, setOpenOffHandPicker] = useState(false);
    const [openRangedHandPicker, setOpenRangedHandPicker] = useState(false);

    // Items and weapons
    const { mainHandWeapon, offHandWeapon, rangedHandWeapon, equipWeapon } = useContext(CharacterContext) as {
        mainHandWeapon: Item | null;
        offHandWeapon: Item | null;
        rangedHandWeapon: Item | null;
        equipWeapon: (slot: 'mainHand' | 'offHand' | 'rangedHand', weapon: Item | null) => void;
    };
    const { items } = useItemEquipment();
    const [weapons, setWeapons] = useState<{ label: string; value: string; image: string }[]>([]);

    // Local state variables for DropDownPicker values
    const [mainHandValue, setMainHandValue] = useState<string>(mainHandWeapon?.name || 'none');
    const [offHandValue, setOffHandValue] = useState<string>(offHandWeapon?.name || 'none');
    const [rangedHandValue, setRangedHandValue] = useState<string>(rangedHandWeapon?.name || 'none');


    // Update weapons whenever items change
    useEffect(() => {
        const weaponsList = items
            .filter((item) => item.type === 'Weapon')
            .map((item) => ({
                label: item.name,
                value: item.name.toLowerCase(),
                image: item.image || '',
            }));

        // Add 'None' option at the beginning of the list
        weaponsList.unshift({
            label: 'None',
            value: 'none', // Use 'none' as the value for the 'None' option
            image: '', // No image for 'None'
        });

        setWeapons(weaponsList);
    }, [items]);

    // Add this useEffect to check if equipped weapons are deleted
    useEffect(() => {
        // Check if the main hand weapon is still in the items list
        if (
            mainHandWeapon &&
            mainHandWeapon.name !== 'none' &&
            !items.some((item) => item.name.toLowerCase() === mainHandWeapon.name.toLowerCase())
        ) {
            // If not, unset the main hand weapon
            equipWeapon('mainHand', null);
            setMainHandValue('none');
            console.log('Main hand weapon was deleted and has been unequipped.');
        }

        // Check if the offhand weapon is still in the items list
        if (
            offHandWeapon &&
            offHandWeapon.name !== 'none' &&
            !items.some((item) => item.name.toLowerCase() === offHandWeapon.name.toLowerCase())
        ) {
            // If not, unset the offhand weapon
            equipWeapon('offHand', null);
            setOffHandValue('none');
            console.log('Offhand weapon was deleted and has been unequipped.');
        }
    }, [items, mainHandWeapon, offHandWeapon, equipWeapon]);

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

    // Function to handle equipping a weapon
    const handleEquipWeapon = (slot: WeaponSlot, weaponName: string | null) => {
        if (!weaponName) return;

        // Handle 'None' selection
        if (weaponName === 'none' || weaponName === null) {
            equipWeapon(slot, null);
            console.log(`No weapon equipped in ${slot === 'mainHand' ? 'Main Hand' : slot === 'offHand' ? 'Offhand' : 'Ranged Hand'}`);
            return;
        }

        // Find the selected weapon item
        const weapon = items.find((item) => item.name.toLowerCase() === weaponName.toLowerCase() && item.type === 'Weapon');

        if (!weapon) {
            Alert.alert('Weapon not found', 'The selected weapon does not exist.');
            return;
        }

        // Load weapon data
        const weaponData = require('../data/weapons.json');
        const weaponCategory = weaponData.weapons.find((category: { items: Item[] }) =>
            category.items.some((item: Item) => item.name.toLowerCase() === weapon.name.toLowerCase())
        );
        const weaponItem = weaponCategory?.items.find((item: Item) => item.name.toLowerCase() === weapon.name.toLowerCase());

        // Check if any slot has a Two-handed weapon equipped
        const isTwoHandedEquipped = (mainHandWeapon && weaponData.weapons.some((category: { items: Item[] }) =>
            category.items.some((item: Item) => item.name.toLowerCase() === mainHandWeapon.name.toLowerCase() && item.properties?.includes("Two-handed"))
        )) || (offHandWeapon && weaponData.weapons.some((category: { items: Item[] }) =>
            category.items.some((item: Item) => item.name.toLowerCase() === offHandWeapon.name.toLowerCase() && item.properties?.includes("Two-handed"))
        )) || (rangedHandWeapon && weaponData.weapons.some((category: { items: Item[] }) =>
            category.items.some((item: Item) => item.name.toLowerCase() === rangedHandWeapon.name.toLowerCase() && item.properties?.includes("Two-handed"))
        ));

        // Unequip Two-handed weapon if any slot has it equipped
        if (isTwoHandedEquipped) {
            equipWeapon('mainHand', null);
            equipWeapon('offHand', null);
            equipWeapon('rangedHand', null);
        }

        // Check if the weapon has the "Two-handed" property
        if (weaponItem?.properties?.includes("Two-handed")) {
            equipWeapon('mainHand', null);
            equipWeapon('offHand', null);
            equipWeapon('rangedHand', null);
        }

        equipWeapon(slot, weapon);
        if (slot === 'rangedHand') {
            console.log(`${weapon.name} is equipped in Ranged Hand`);
        } else {
            console.log(`${weapon.name} is equipped in ${slot === 'mainHand' ? 'Main Hand' : 'Offhand'}`);
        }
    };


    // Function to handle value change in DropDownPicker
    const handleMainHandValueChange = (value: string | null) => {
        if (value === 'none' || !value) {
            equipWeapon('mainHand', null);
        } else {
            const weapon = items.find((item) => item.name === value && item.type === 'Weapon');
            if (weapon) {
                equipWeapon('mainHand', weapon);
            }
        }
    };

    const handleOffHandValueChange = (value: string | null) => {
        if (value === 'none' || !value) {
            equipWeapon('offHand', null);
        } else {
            const weapon = items.find((item) => item.name === value && item.type === 'Weapon');
            if (weapon) {
                equipWeapon('offHand', weapon);
            }
        }
    };

    const handleRangedHandValueChange = (value: string | null) => {
        if (value === 'none' || !value) {
            equipWeapon('rangedHand', null);
        } else {
            const weapon = items.find((item) => item.name === value && item.type === 'Weapon');
            if (weapon) {
                equipWeapon('rangedHand', weapon);
            }
        }
    };
    const filterEquipableRangedWeapons = () => {
        const rangedCategories = ["Simple Ranged", "Martial Ranged"];
        const weaponData = require('../data/weapons.json');

        // Get the items created by the user in the bag
        const userItems = items.filter((item) => item.type === 'Weapon');

        // Filter the user items by checking if they belong to the ranged categories
        return [
            { label: 'None', value: 'none' },
            ...userItems
                .filter((userItem) =>
                    weaponData.weapons.some((category: { category: string; items: Item[] }) =>
                        rangedCategories.includes(category.category) &&
                        category.items.some((weapon) => weapon.name.toLowerCase() === userItem.name.toLowerCase())
                    )
                )
                .map((item) => ({ label: item.name, value: item.name.toLowerCase() }))
        ];
    };
    const filterEquipableMeleeWeapons = () => {
        const meleeCategories = ["Simple Melee", "Martial Melee"];
        const weaponData = require('../data/weapons.json');

        // Get the items created by the user in the bag
        const userItems = items.filter((item) => item.type === 'Weapon');
        return [
            { label: 'None', value: 'none' },
            ...userItems
                .filter((userItem) =>
                    weaponData.weapons.some((category: { category: string; items: Item[] }) =>
                        meleeCategories.includes(category.category) &&
                        category.items.some((weapon) => weapon.name.toLowerCase() === userItem.name.toLowerCase())
                    )
                )
                .map((item) => ({ label: item.name, value: item.name.toLowerCase() }))
        ];
    }

    const filterEquipableOffhandWeapons = () => {
        const meleeWeapons = filterEquipableMeleeWeapons();
        const weaponData = require('../data/weapons.json');

        // Filter the melee weapons to only include those with the "Light" property
        return meleeWeapons.filter((weapon) => {
            if (weapon.value === 'none') return true; // Keep the 'None' option
            const weaponDetails = weaponData.weapons
                .flatMap((category: { category: string; items: Item[] }) => category.items)
                .find((item: Item) => item.name.toLowerCase() === weapon.value);
            return weaponDetails && weaponDetails.properties?.includes("Light");
        });
    }

    // Calculate half of the screen width
    const screenWidth = Dimensions.get('window').width;
    const section3Width = (1 / 2) * screenWidth;

    return (
        <View style={styles.container}>
            {/* Section 1: Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'column', gap: 5, marginLeft: 10 }}>
                    <Text style={{ color: 'white', fontSize: 16, }}>{statsData.race}</Text>
                    <Text style={{ color: 'white', fontSize: 16, }}>{statsData.class ? statsData.class.charAt(0).toUpperCase() + statsData.class.slice(1) : ''}</Text>
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
                                style={[styles.equipmentItem, !item.customImageUri ? { padding: 15 } : {}]}
                                onPress={() => { }}
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
                <TouchableOpacity
                    style={{ borderWidth: 2, borderColor: 'white', borderStyle: 'solid', borderRadius: 8 }}
                    onLongPress={handleImageLongPress}
                    onPress={() => setCharacterModalVisible(true)}>
                    <View style={[styles.imageContainer, { width: section3Width }]}>
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.emptyImageContainer}>
                                {!statsData.race && !statsData.class ?
                                    <>
                                        <Ionicons name="body" size={24} color="white" />
                                        <Text style={{ color: 'white', marginBottom: 40, marginTop: 10, fontSize: 16, textAlign: 'center' }}>
                                            Tap to create your{'\n'}character
                                        </Text>
                                    </>
                                    : null}
                                <Ionicons name="image" size={24} color="white" />
                                <Text style={{ color: 'white', fontSize: 12, marginTop: 10 }}>Long press to add an image</Text>
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
                                style={[styles.equipmentItem, !item.customImageUri ? { padding: 15 } : {}]}
                                onPress={() => { }}
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
                    {/* Main Hand Weapon */}
                    <TouchableOpacity
                        style={[styles.weapon, !mainHandWeapon?.name ? { padding: 15 } : {}]}
                        onPress={() => setMainHandModalVisible(true)}
                    >
                        {mainHandWeapon?.name && mainHandWeapon?.name !== 'none' ? (
                            (() => {
                                const weapon = weapons.find((w) => w.value === mainHandWeapon.name.toLowerCase());
                                if (weapon && weapon.image && weapon.image !== '') {
                                    return (
                                        <Image
                                            source={{ uri: weapon.image }}
                                            style={styles.equipmentItemImage}
                                            resizeMode="contain"
                                        />
                                    );
                                } else {
                                    return (
                                        <View style={styles.equipmentItemImage}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 16,
                                                textAlign: 'center'
                                            }}>{weapon?.label || mainHandWeapon.name}</Text>
                                        </View>
                                    );
                                }
                            })()
                        ) : (
                            <Image
                                source={equipmentItems.find((item) => item.id === 'mainMelee')?.defaultImage}
                                style={styles.equipmentItemImage}
                                resizeMode="contain"
                            />
                        )}
                    </TouchableOpacity>

                    {/* Offhand Weapon */}
                    <TouchableOpacity
                        style={[styles.weapon, !offHandWeapon?.name ? { padding: 15 } : {}]}
                        onPress={() => setOffHandModalVisible(true)}
                    >
                        {offHandWeapon?.name && offHandWeapon?.name !== 'none' ? (
                            (() => {
                                const weapon = weapons.find((w) => w.value === offHandWeapon.name.toLowerCase());
                                if (weapon && weapon.image && weapon.image !== '') {
                                    return (
                                        <ImageBackground
                                            source={{ uri: weapon.image }}
                                            style={styles.equipmentItemImage}
                                        />
                                    );
                                } else {
                                    return <Text style={{
                                        color: 'white',
                                        fontSize: 16,
                                        marginTop: 10,
                                        marginLeft: 10
                                    }}>{weapon?.label}</Text>;
                                }
                            })()
                        ) : (
                            <ImageBackground
                                source={equipmentItems.find((item) => item.id === 'offhandMelee')?.defaultImage}
                                style={styles.equipmentItemImage}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                {equipmentItems
                    .filter((item) => item.section === 5 && item.id === 'mainRanged')
                    .map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.weapon, !rangedHandWeapon?.name ? { padding: 15 } : {}]}
                            onPress={() => { setRangedHandModalVisible(true) }}
                        >
                            {rangedHandWeapon?.name && rangedHandWeapon?.name !== 'none' ? (
                                (() => {
                                    const weapon = weapons.find((w) => w.value === rangedHandWeapon.name.toLowerCase());
                                    if (weapon && weapon.image && weapon.image !== '') {
                                        return (
                                            <ImageBackground
                                                source={{ uri: weapon.image }}
                                                style={styles.equipmentItemImage}
                                            />
                                        );
                                    } else {
                                        return <Text style={{
                                            color: 'white',
                                            fontSize: 16,
                                            marginTop: 10,
                                            marginLeft: 10
                                        }}>{weapon?.label}</Text>;
                                    }
                                })()
                            ) : (
                                <ImageBackground
                                    source={equipmentItems.find((item) => item.id === 'mainRanged')?.defaultImage}
                                    style={styles.equipmentItemImage}
                                />
                            )}
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
                                {/* Race Features */}
                                <View>
                                    <Text>Race Features</Text>
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.skills && <Text>Skills: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.skills}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.feat && <Text>Feat: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.feat}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.feyAncestry && <Text>Fey Ancestry: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.feyAncestry}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.trance && <Text>Trance: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.trance}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.stoneCunning && <Text>Stone Cunning: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.stoneCunning}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.darkvision && <Text>Darkvision: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.darkvision}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.lucky && <Text>Lucky: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.lucky}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.brave && <Text>Brave: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.brave}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.halflingNimbleness && <Text>Halfling Nimbleness: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.halflingNimbleness}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.gnomeCunning && <Text>Gnome Cunning: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.gnomeCunning}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.relentlessEndurance && <Text>Relentless Endurance: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.relentlessEndurance}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.savageAttacks && <Text>Savage Attacks: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.savageAttacks}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.hellishResistance && <Text>Hellish Resistance: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.hellishResistance}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.infernalLegacy && <Text>Infernal Legacy: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.infernalLegacy}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.draconicAncestry && <Text>Draconic Ancestry: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.draconicAncestry}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.breathWeapon && <Text>Breath Weapon: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.breathWeapon}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.damageResistance && <Text>Damage Resistance: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.damageResistance}</Text>}
                                    {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.language && <Text>Language: {raceBonuses.find(bonus => bonus.race === statsData.race)?.features.language}</Text>}
                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Weapon Modal */}
            {/* Main Hand Weapon Modal */}
            <Modal animationType="fade" transparent={true} visible={mainHandModalVisible}>
                <TouchableWithoutFeedback onPress={() => {
                    setMainHandModalVisible(false);
                    setMainHandValue('none');
                    setOpenMainHandPicker(false);
                }}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer} >
                            <Text>Select Main Hand Weapon</Text>
                            <DropDownPicker
                                open={openMainHandPicker}
                                value={mainHandValue}
                                items={filterEquipableMeleeWeapons()}
                                setOpen={setOpenMainHandPicker}
                                setValue={setMainHandValue}
                                onChangeValue={handleMainHandValueChange}
                                placeholder="Select a weapon"
                                containerStyle={{ height: 40, width: '100%' }}
                                style={{ backgroundColor: '#fafafa' }}
                                dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                            />
                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    backgroundColor: 'lightblue',
                                    borderRadius: 8,
                                    marginTop: 10,
                                    alignSelf: 'center',
                                    // Start of Selection
                                }}
                                onPress={() => {
                                    handleEquipWeapon('mainHand', mainHandValue);
                                    setMainHandModalVisible(false);
                                }}
                            >
                                <Text>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Offhand Weapon Modal */}
            <Modal animationType="fade" transparent={true} visible={offHandModalVisible}>
                <TouchableWithoutFeedback onPress={() => {
                    setOffHandModalVisible(false);
                    setOffHandValue('none');
                    setOpenOffHandPicker(false);
                }}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text>Select Offhand Weapon</Text>
                            <DropDownPicker
                                open={openOffHandPicker}
                                value={offHandValue}
                                items={filterEquipableOffhandWeapons()}
                                setOpen={setOpenOffHandPicker}
                                setValue={setOffHandValue}
                                onChangeValue={handleOffHandValueChange}
                                placeholder="Select a weapon"
                                containerStyle={{ height: 40, width: '100%' }}
                                style={{ backgroundColor: '#fafafa' }}
                                dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                            />
                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    backgroundColor: 'lightblue',
                                    borderRadius: 8,
                                    marginTop: 10,
                                    alignSelf: 'center',
                                }}
                                onPress={() => {
                                    handleEquipWeapon('offHand', offHandValue);
                                    setOffHandModalVisible(false);
                                }}
                            >
                                <Text>Equip Weapon</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Ranged Hand Weapon Modal */}
            <Modal animationType="fade" transparent={true} visible={rangedHandModalVisible}>
                <TouchableWithoutFeedback onPress={() => {
                    setRangedHandModalVisible(false);
                    setRangedHandValue('none');
                    setOpenRangedHandPicker(false);
                }}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text>Select Ranged Hand Weapon</Text>
                            <DropDownPicker
                                open={openRangedHandPicker}
                                value={rangedHandValue}
                                items={filterEquipableRangedWeapons()}
                                setOpen={setOpenRangedHandPicker}
                                setValue={setRangedHandValue}
                                onChangeValue={handleRangedHandValueChange}
                                placeholder="Select a weapon"
                                containerStyle={{ height: 40, width: '100%' }}
                                style={{ backgroundColor: '#fafafa' }}
                                dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                            />
                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    backgroundColor: 'lightblue',
                                    borderRadius: 8,
                                    marginTop: 10,
                                    alignSelf: 'center',
                                }}
                                onPress={() => {
                                    handleEquipWeapon('rangedHand', rangedHandValue);
                                    setRangedHandModalVisible(false);
                                }}
                            >
                                <Text>Equip Weapon</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

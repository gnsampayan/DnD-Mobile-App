import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, ImageBackground, Modal, TouchableWithoutFeedback, Button, Alert, ImageSourcePropType, ScrollView } from 'react-native';
import styles from '@/app/styles/spellbookStyles';
import classData from '@/app/data/classData.json';
import StatsDataContext from '../context/StatsDataContext';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cantripsData from '@/app/data/cantrips.json';
import chillTouchImage from '@images/cantrips/chill-touch.png';

// Cantrip images
import acidSplashImage from '@images/cantrips/acid-splash.png';
import bladeWardImage from '@images/cantrips/blade-ward.png';
import boomingBladeImage from '@images/cantrips/booming-blade.png';
import controlFlamesImage from '@images/cantrips/control-flames.png';
import createBonfireImage from '@images/cantrips/create-bonfire.png';
import dancingLightsImage from '@images/cantrips/dancing-lights.png';
import druidcraftImage from '@images/cantrips/druidcraft.png';
import eldritchBlastImage from '@images/cantrips/eldritch-blast.png';
import encodeThoughtsImage from '@images/cantrips/encode-thoughts.png';
import fireBoltImage from '@images/cantrips/fire-bolt.png';
import friendsImage from '@images/cantrips/friends.png';
import frostbiteImage from '@images/cantrips/frostbite.png';
import greenFlameBladeImage from '@images/cantrips/green-flame-blade.png';
import guidanceImage from '@images/cantrips/guidance.png';
import gustImage from '@images/cantrips/gust.png';
import infestationImage from '@images/cantrips/infestation.png';
import lightImage from '@images/cantrips/light.png';


import { Ionicons } from '@expo/vector-icons';
import { useActions } from '../context/actionsSpellsContext';

import endActionImage from '@actions/end-action-image-v3.png';
const endActionImageTyped: ImageSourcePropType = endActionImage as ImageSourcePropType;

const cantripImages = {
    'Acid Splash': acidSplashImage,
    'Blade Ward': bladeWardImage,
    'Booming Blade': boomingBladeImage,
    'Chill Touch': chillTouchImage,
    'Control Flames': controlFlamesImage,
    'Create Bonfire': createBonfireImage,
    'Dancing Lights': dancingLightsImage,
    'Druidcraft': druidcraftImage,
    'Eldritch Blast': eldritchBlastImage,
    'Encode Thoughts': encodeThoughtsImage,
    'Fire Bolt': fireBoltImage,
    'Friends': friendsImage,
    'Frostbite': frostbiteImage,
    'Green-Flame Blade': greenFlameBladeImage,
    'Guidance': guidanceImage,
    'Gust': gustImage,
    'Infestation': infestationImage,
    'Light': lightImage,
}

// TODO: Add learned spells from other wizards and scrolls
const learnedSpellsFromOtherWizards = 0;
const learnedSpellsFromScrolls = 0;


// Key for AsyncStorage
const CANTRIP_SLOTS_KEY = '@cantrip_slots';

type Cantrip = {
    name: string;
    classes: string[];
    school?: string;
    castingTime?: string;
    range?: string;
    duration?: string;
    components?: string[];
    damage?: { [key: string]: string } | null;
    savingThrow?: string | null;
    damageType?: string | null;
    description?: string;
    features?: string | Record<string, any>[];
}

interface CastingCost {
    action: number;
    bonusAction: number;
}

interface Feature {
    label: string;
    description: string;
}


export default function SpellbookScreen() {
    const [preparedSpellSlots, setPreparedSpellSlots] = useState<number | null>(null);
    const [cantripSlots, setCantripSlots] = useState<number | null>(null);
    const [allKnownSpellsSlots, setAllKnownSpellsSlots] = useState<number | null>(null);
    const [cantripModalVisible, setCantripModalVisible] = useState(false);
    const [cantripPressedIndex, setCantripPressedIndex] = useState<number | null>(null);
    const [openCantripChoice, setOpenCantripChoice] = useState(false);
    const [cantripChoiceValue, setCantripChoiceValue] = useState<string | null>(null);
    const [cantripChoiceDescription, setCantripChoiceDescription] = useState<string | null>(null);
    const [cantripSlotsData, setCantripSlotsData] = useState<(string | null)[]>([]);
    const [resetModalVisible, setResetModalVisible] = useState(false);

    const { currentActionsAvailable, currentBonusActionsAvailable, setCurrentActionsAvailable, setCurrentBonusActionsAvailable } = useActions();


    const { statsData, isSpellCaster } = useContext(StatsDataContext);


    const characterClass = classData.find(cls => cls.value.toLowerCase() === statsData?.class?.toLowerCase());

    useEffect(() => {
        getPreparedSpellSlotsAmount();
        getCantripSlotsAmount();
        getAllKnownSpellsSlotsAmount();
        loadCantripSlots();
    }, [isSpellCaster, statsData.level, statsData.abilities, statsData.class, statsData.race]);

    // Function to load cantrip slots from AsyncStorage
    const loadCantripSlots = async () => {
        try {
            const savedSlots = await AsyncStorage.getItem(CANTRIP_SLOTS_KEY);
            if (savedSlots !== null) {
                setCantripSlotsData(JSON.parse(savedSlots));
            } else {
                // Initialize slots as empty
                if (cantripSlots) {
                    setCantripSlotsData(Array(cantripSlots).fill(null));
                }
            }
        } catch (error) {
            console.error('Failed to load cantrip slots from storage', error);
        }
    };

    const getCantripImage = (cantripName: string) => {
        return cantripImages[cantripName as keyof typeof cantripImages] || null;
    }


    // Function to save cantrip slots to AsyncStorage
    const saveCantripSlots = async (slots: (string | null)[]) => {
        try {
            await AsyncStorage.setItem(CANTRIP_SLOTS_KEY, JSON.stringify(slots));
        } catch (error) {
            console.error('Failed to save cantrip slots to storage', error);
        }
    };

    useEffect(() => {
        // Whenever cantripSlots or cantripSlotsData changes, ensure they are in sync
        if (cantripSlots && cantripSlotsData.length !== cantripSlots) {
            setCantripSlotsData(Array(cantripSlots).fill(null));
        }
    }, [cantripSlots]);

    const getPreparedSpellSlotsAmount = () => {
        if (characterClass && isSpellCaster) {
            const preparedSlots = classFilterPreparedSpellBlocks();
            setPreparedSpellSlots(preparedSlots);
        }
    }

    const classFilterPreparedSpellBlocks = () => {
        const preparedSpellConfig: { [key: string]: { ability: string; levelModifier: (level: number) => number } } = {
            artificer: {
                ability: 'intelligence',
                levelModifier: (level) => Math.floor(level / 2),
            },
            cleric: {
                ability: 'wisdom',
                levelModifier: (level) => level,
            },
            druid: {
                ability: 'wisdom',
                levelModifier: (level) => level,
            },
            paladin: {
                ability: 'charisma',
                levelModifier: (level) => level,
            },
            wizard: {
                ability: 'intelligence',
                levelModifier: (level) => level,
            },
        };
        if (!characterClass) return null;
        const config = preparedSpellConfig[characterClass.value.toLowerCase()];
        if (!config) {
            // Not a spellcaster or spells are castable without preparation
            return null;
        }
        const preparedSlots = getAbilityModifier(config.ability) + config.levelModifier(statsData.level);
        return preparedSlots || 0;
    }


    const getAbilityModifier = (abilityName: string) => {
        const abilityValue = statsData.abilities.find(ability => ability.name.toLowerCase() === abilityName.toLowerCase());
        return abilityValue ? Math.floor((abilityValue.value - 10) / 2) : 0;
    }

    const numColumns = 3;
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = (windowWidth - (30 + (numColumns - 1) * 10)) / numColumns;

    const renderSpellBlock = () => (
        <TouchableOpacity style={[styles.addSpellButton, { width: itemWidth }]}>
            <ImageBackground
                style={styles.spellButtonBackground}
                source={{ uri: 'https://via.placeholder.com/150?text=&bg=EEEEEE' }}
                resizeMode="cover"
            >
                <View style={styles.spellBlock}>
                    <Text style={{ color: 'white' }}>Add Spell</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity >
    );

    const renderPreparedSpellBlocksForClass = () => {
        if (preparedSpellSlots !== null && preparedSpellSlots <= 0) {
            return (
                <View style={styles.section}>
                    <Text style={styles.label}>Prepared Spells</Text>
                    <Text style={styles.text}>You can't use any spells yet.</Text>
                </View>
            );
        } else if (preparedSpellSlots === null) {
            return null;
        } else {
            return (
                <View style={styles.section}>
                    <Text style={styles.label}>Prepared Spells</Text>
                    <FlatList
                        data={Array.from({ length: preparedSpellSlots || 0 }, (_, i) => i)}
                        renderItem={renderSpellBlock}
                        keyExtractor={(item) => item.toString()}
                        numColumns={numColumns}
                        key={numColumns}
                    />
                </View>
            )
        }
    }

    const getClassCantripsKnown = () => {
        const cantripsKnown = characterClass?.cantripsKnown && typeof characterClass.cantripsKnown === 'object' ?
            Object.entries(characterClass.cantripsKnown).reduce((acc, [level, cantrips]) =>
                Number(level) <= statsData.level ? cantrips : acc
                , 0) : 0;
        const cantripsAmount = cantripsKnown ? cantripsKnown : 0;
        return cantripsAmount;
    }
    const getCantripSlotsAmount = () => {
        if (characterClass && isSpellCaster) {
            const cantrips = getClassCantripsKnown();
            setCantripSlots(cantrips);
        }
    }

    const handleCantripPress = (index: number) => {
        setCantripModalVisible(true);
        setCantripPressedIndex(index);
    }
    const renderCantripBlock = (index: number) => {
        const canAfford = canAffordCantrip(cantripSlotsData[index] || '');
        const isEmpty = cantripSlotsData[index] === null || cantripSlotsData[index] === '';
        const darken = !isEmpty && !canAfford;
        return (
            <TouchableOpacity
                style={[styles.addCantripButton, { width: itemWidth, opacity: darken ? 0.5 : 1 }]}
                onPress={() => {
                    handleCantripPress(index);
                }}
                disabled={darken}
            >
                <ImageBackground
                    // Start of Selection
                    style={styles.cantripButtonBackground}
                    source={cantripSlotsData[index] ? getCantripImage(cantripSlotsData[index]) as ImageSourcePropType : { uri: 'https://via.placeholder.com/150' }}
                    resizeMode="cover"
                >
                    <View style={styles.cantripBlock}>
                        {cantripSlotsData[index] !== null && cantripSlotsData[index] !== '' ? (
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                {(cantripSlotsData[index] && getCantripImage(cantripSlotsData[index])) ? '' : cantripSlotsData[index]}
                            </Text>
                        ) : (
                            <Text style={{ color: 'white' }}>
                                Add Cantrip
                            </Text>
                        )}
                    </View>
                </ImageBackground>
            </TouchableOpacity >
        )
    }

    const renderCantripBlocks = () => {
        if (cantripSlots === null || cantripSlots === 0) {
            return null;
        } else {
            return (
                <View style={styles.section}>
                    <Text style={styles.label}>Cantrips</Text>
                    <FlatList
                        data={Array.from({ length: cantripSlots || 0 }, (_, i) => i)}
                        renderItem={({ item }) => renderCantripBlock(item)}
                        keyExtractor={(item) => item.toString()}
                        numColumns={numColumns}
                        key={numColumns}
                    />
                </View>
            )
        }
    }

    const getAllKnownSpellsSlotsAmount = () => {
        if (characterClass && isSpellCaster) {
            const allKnownSpells = classFilterAllKnownSpellsBlocks(characterClass?.value || null);
            setAllKnownSpellsSlots(allKnownSpells);
        }
    }

    const getClassPreparedSpellSlots = () => {
        const classSpellsKnown = characterClass?.spellsKnown && typeof characterClass.spellsKnown === 'object' ?
            Object.entries(characterClass.spellsKnown).reduce((acc, [level, spells]) =>
                Number(level) <= statsData.level ? spells : acc
                , 0) : 0;
        const classSpellsKnownAmount = classSpellsKnown ? classSpellsKnown : 0;
        return classSpellsKnownAmount;
    }

    const classFilterAllKnownSpellsBlocks = (characterClass: string | null) => {
        if (!characterClass) return 0;

        const lowerClass = characterClass.toLowerCase();

        const preparedSpellClasses = new Set(['bard', 'ranger', 'sorcerer', 'warlock']);
        const knownButNotPreparedClasses = new Set(['artificer', 'cleric', 'druid', 'paladin']);

        if (preparedSpellClasses.has(lowerClass)) {
            return getClassPreparedSpellSlots();
        }

        if (lowerClass === 'wizard') {
            return statsData.level + learnedSpellsFromOtherWizards + learnedSpellsFromScrolls;
        }

        if (knownButNotPreparedClasses.has(lowerClass)) {
            // All {Class} spells are known, but not prepared
            return null;
        }

        // Not a spellcaster
        return null;
    }

    const renderAllKnownSpells = () => {
        if (allKnownSpellsSlots !== null && preparedSpellSlots === null) {
            return null;
        } else {
            if (allKnownSpellsSlots === 0 && allKnownSpellsSlots !== null) {
                return (
                    <View style={styles.section}>
                        <Text style={styles.label}>Known Spells</Text>
                        <Text style={styles.text}>You can't learn any spells yet.</Text>
                    </View>
                )
            } else if (allKnownSpellsSlots === null) {
                return null;
            } else {
                return (
                    <View style={styles.section}>
                        <Text style={styles.label}>Known Spells</Text>
                        <FlatList
                            data={Array.from({ length: allKnownSpellsSlots || 0 }, (_, i) => i)}
                            renderItem={renderSpellBlock}
                            keyExtractor={(item) => item.toString()}
                            numColumns={numColumns}
                            key={numColumns}
                        />
                    </View>
                )
            }
        }
    }

    const renderCastableSpells = () => {
        if (allKnownSpellsSlots !== null && preparedSpellSlots === null) {
            if (allKnownSpellsSlots === 0 && allKnownSpellsSlots !== null) {
                return (
                    <View style={styles.section}>
                        <Text style={styles.label}>Spells</Text>
                        <Text style={styles.text}>You can't cast any spells yet.</Text>
                    </View>
                )
            } else if (allKnownSpellsSlots === null) {
                return null;
            } else {
                return (
                    <View style={styles.section}>
                        <Text style={styles.label}>Spells</Text>
                        <FlatList
                            data={Array.from({ length: allKnownSpellsSlots || 0 }, (_, i) => i)}
                            renderItem={renderSpellBlock}
                            keyExtractor={(item) => item.toString()}
                            numColumns={numColumns}
                            key={numColumns}
                        />
                    </View>
                )
            }
        } else {
            return null;
        }
    }

    const getAvailableCantrips = (currentClass: string): Cantrip[] => {
        return cantripsData.filter(cantrip =>
            cantrip.classes?.map(cls => cls.toLowerCase()).includes(currentClass.toLowerCase())
        ) as Cantrip[];
    }


    const getDamageFromCantrip = (cantripName: string): string => {
        const allCantrips = getAvailableCantrips(statsData.class || '');
        const selectedCantrip = allCantrips.find(cantrip => cantrip.name === cantripName);

        if (selectedCantrip && selectedCantrip.damage) {
            if (typeof selectedCantrip.damage === 'object') {
                return Object.entries(selectedCantrip.damage)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
            } else if (typeof selectedCantrip.damage === 'string') {
                return selectedCantrip.damage;
            }
        }
        return '-';
    }


    const renderCantripChoicesBasedOnLevel = () => {
        const availableCantrips = getAvailableCantrips(statsData.class || '');
        const unusedCantrips = availableCantrips.filter(cantrip => !cantripSlotsData.includes(cantrip.name));
        const handleCantripPreview = (cantrip: { name: string; description: string; features?: string | object[]; damage?: string }) => {
            setCantripChoiceValue(cantrip.name);
            setCantripChoiceDescription(cantrip.description || '');
        }

        // Function to normalize features
        const normalizeFeatures = (featuresData: any): Feature[] => {
            const normalizedFeatures: Feature[] = [];

            if (typeof featuresData === 'string') {
                // Handle single string feature
                normalizedFeatures.push({
                    label: 'Feature',
                    description: featuresData
                });
            }
            else if (Array.isArray(featuresData)) {
                if (
                    featuresData.length > 0 &&
                    typeof featuresData[0] === 'object' &&
                    !Array.isArray(featuresData[0])
                ) {
                    // Array of objects with 'effect' and 'details'
                    featuresData.forEach((item: any) => {
                        normalizedFeatures.push({
                            label: item.effect || 'Feature',
                            description: item.details || '',
                        });
                    });
                } else {
                    // Array of strings
                    featuresData.forEach((item: string, index: number) => {
                        normalizedFeatures.push({
                            label: `Feature ${index + 1}`,
                            description: item,
                        });
                    });
                }
            } else if (typeof featuresData === 'object' && featuresData !== null) {
                // Object with key-value pairs
                Object.keys(featuresData).forEach((key) => {
                    const value = featuresData[key];
                    if (typeof value === 'string') {
                        normalizedFeatures.push({
                            label: key.toString(),
                            description: value.toString(),
                        });
                    } else if (typeof value === 'object' && value !== null) {
                        // Flatten the object into a string without JSON artifacts
                        const flattenedDescription = Object.entries(value)
                            .map(([subKey, subValue]) => `${subKey}: ${subValue}`)
                            .join(', ');
                        normalizedFeatures.push({
                            label: key.toString(),
                            description: flattenedDescription,
                        });
                    } else {
                        normalizedFeatures.push({
                            label: key.toString(),
                            description: String(value),
                        });
                    }
                });
            }

            return normalizedFeatures;
        };

        // Function to render features
        const renderFeatures = (featuresData: any) => {
            if (!featuresData) return null;
            const features = normalizeFeatures(featuresData);

            return (
                <View style={{ marginVertical: 10 }}>
                    {features.map((feature, index) => {
                        // Ensure description is a string
                        const description =
                            typeof feature.description === 'string'
                                ? feature.description
                                : JSON.stringify(feature.description);

                        return (
                            <View key={index} style={{ marginBottom: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                    {feature.label}
                                </Text>
                                <Text style={{ fontSize: 14, lineHeight: 20 }}>
                                    {description}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            );
        };

        return (
            <View>
                {/* Ensure the cantrip slot is selected */}
                {cantripPressedIndex !== null && (
                    <>
                        {/* Show this when the cantrip slot is empty */}
                        {(cantripSlotsData[cantripPressedIndex] === '' ||
                            cantripSlotsData[cantripPressedIndex] === null) && (
                                <View>
                                    <DropDownPicker
                                        open={openCantripChoice}
                                        value={cantripChoiceValue}
                                        items={unusedCantrips.map((cantrip) => ({
                                            label: cantrip.name,
                                            value: cantrip.name,
                                        }))}
                                        setOpen={setOpenCantripChoice}
                                        setValue={setCantripChoiceValue}
                                        placeholder="Select a cantrip"
                                        style={{ marginBottom: 10 }}
                                        zIndex={1000}
                                        onChangeValue={(value) => {
                                            const selected = unusedCantrips.find(
                                                (cantrip) => cantrip.name === value
                                            );
                                            if (selected) {
                                                handleCantripPreview({
                                                    name: selected.name,
                                                    description: selected.description || '',
                                                    features: selected.features,
                                                });
                                            }
                                        }}
                                    />
                                    <ScrollView>
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Cantrip Slot:</Text>
                                            <Text>
                                                {(cantripPressedIndex !== null
                                                    ? cantripPressedIndex
                                                    : 0) + 1}
                                            </Text>
                                        </View>
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Description:</Text>
                                            <Text>{cantripChoiceDescription}</Text>
                                        </View>
                                        {cantripChoiceValue && (
                                            <View style={{ marginBottom: 10 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Features:</Text>
                                                {renderFeatures(
                                                    unusedCantrips.find(
                                                        cantrip => cantrip.name === cantripChoiceValue
                                                    )?.features
                                                )}
                                            </View>
                                        )}
                                    </ScrollView>
                                </View>
                            )}
                        {/* Show this when the cantrip slot is NOT empty */}
                        {cantripSlotsData[cantripPressedIndex] !== '' &&
                            cantripSlotsData[cantripPressedIndex] !== null && (
                                <ScrollView>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Cantrip Slot:</Text>
                                        <Text>
                                            {(cantripPressedIndex !== null
                                                ? cantripPressedIndex
                                                : 0) + 1}
                                        </Text>
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Damage:</Text>
                                        <Text>
                                            {getDamageFromCantrip(
                                                cantripSlotsData[cantripPressedIndex]
                                            )?.toString() || ''}
                                        </Text>
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Description:</Text>
                                        <Text>
                                            {availableCantrips.find(
                                                (cantrip) =>
                                                    cantrip.name ===
                                                    cantripSlotsData[cantripPressedIndex]
                                            )?.description || ''}
                                        </Text>
                                    </View>
                                    {availableCantrips.find(
                                        (cantrip) =>
                                            cantrip.name === cantripSlotsData[cantripPressedIndex]
                                    )?.features && (
                                            <View style={{ marginBottom: 10 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Features:</Text>
                                                {renderFeatures(
                                                    availableCantrips.find(
                                                        (cantrip) =>
                                                            cantrip.name === cantripSlotsData[cantripPressedIndex]
                                                    )?.features
                                                )}
                                            </View>
                                        )}
                                </ScrollView>
                            )}
                    </>
                )}
            </View>
        );
    }

    const setCantripInSlot = () => {
        if (cantripPressedIndex === null || !cantripChoiceValue) {
            Alert.alert('Empty Slot', 'Please select a cantrip and try again.');
            return;
        }

        const updatedCantripSlots = [...cantripSlotsData];

        updatedCantripSlots[cantripPressedIndex] = cantripChoiceValue;

        setCantripSlotsData(updatedCantripSlots);
        saveCantripSlots(updatedCantripSlots);
        setCantripModalVisible(false);
        setCantripChoiceValue(null);
        setCantripChoiceDescription(null);
        setCantripPressedIndex(null);
    }


    const castCantrip = () => {
        if (cantripPressedIndex === null) {
            Alert.alert('Empty Slot', 'Please select a cantrip slot to cast.');
            return;
        }

        const assignedCantrip = cantripSlotsData[cantripPressedIndex];
        if (!assignedCantrip) {
            Alert.alert('Empty Slot', 'No cantrip is assigned to this slot to cast.');
            return;
        }

        // Find the cantrip in cantrips.json
        const selectedCantrip = cantripsData.find(cantrip => cantrip.name === assignedCantrip);
        if (!selectedCantrip) {
            Alert.alert('Invalid Cantrip', 'The assigned cantrip does not exist.');
            return;
        }

        // Parse the casting time
        const { action, bonusAction } = parseCastingTime(selectedCantrip.castingTime);

        // Check if the user has enough actions and bonus actions
        if (currentActionsAvailable < action) {
            Alert.alert('Insufficient Actions', 'You do not have enough actions available.');
            return;
        }

        if (currentBonusActionsAvailable < bonusAction) {
            Alert.alert('Insufficient Bonus Actions', 'You do not have enough bonus actions available.');
            return;
        }

        // Deduct the action and bonus action costs
        setCurrentActionsAvailable(prev => prev - action);
        setCurrentBonusActionsAvailable(prev => prev - bonusAction);

        // Reset modal and selection states
        setCantripModalVisible(false);
        setCantripChoiceValue(null);
        setCantripChoiceDescription(null);
        setCantripPressedIndex(null);
    };

    const parseCastingTime = (castingTime: string): CastingCost => {
        let actionCost = 0;
        let bonusActionCost = 0;

        if (castingTime.includes("1 Bonus Action")) {
            bonusActionCost = 1;
        }
        if (castingTime.includes("1 Action")) {
            actionCost = 1;
        }

        return { action: actionCost, bonusAction: bonusActionCost };
    };

    const canAffordCantrip = (cantripName: string): boolean => {
        const selectedCantrip = cantripsData.find(cantrip => cantrip.name.toLowerCase() === cantripName.toLowerCase());
        if (!selectedCantrip || !selectedCantrip.castingTime) return false;

        const { action, bonusAction } = parseCastingTime(selectedCantrip.castingTime);

        return (
            currentActionsAvailable >= action &&
            currentBonusActionsAvailable >= bonusAction
        );
    };

    const endTurn = () => {
        setCurrentActionsAvailable(1);
        setCurrentBonusActionsAvailable(1);
    };

    const resetSpellbook = async () => {
        try {
            // Reset cantrip slots to an array of nulls
            const resetCantripSlots = Array(cantripSlots).fill(null).map(() => null);
            setCantripSlotsData(resetCantripSlots);
            await AsyncStorage.setItem(CANTRIP_SLOTS_KEY, JSON.stringify(resetCantripSlots));

            // Reset other spell slots and data as needed
            // You can implement similar reset logic for other spell slots if applicable

            // Close reset confirmation modal
            setResetModalVisible(false);
        } catch (error) {
            console.error('Failed to reset spellbook:', error);
        }
    };

    return (
        <>

            <View style={styles.container}>

                <View>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.headerTextContainer}>
                                <Ionicons
                                    name={currentActionsAvailable > 0 ? "ellipse" : "ellipse-outline"}
                                    size={16}
                                    color={currentActionsAvailable > 0 ? "green" : "rgba(0, 128, 0, 0.2)"}
                                />
                                <View style={styles.headerTextBox}>
                                    <Text style={[
                                        styles.headerText,
                                        currentActionsAvailable === 0 && { color: 'black' }
                                    ]}>
                                        x{currentActionsAvailable}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.headerTextContainer}>
                                <Ionicons
                                    name={currentBonusActionsAvailable > 0 ? "triangle" : "triangle-outline"}
                                    size={16}
                                    color={currentBonusActionsAvailable > 0 ? "rgba(255, 140, 0, 1)" : "rgba(255, 140, 0, 0.2)"}
                                />
                                <View style={styles.headerTextBox}>
                                    <Text style={[
                                        styles.headerText,
                                        currentBonusActionsAvailable === 0 && { color: 'black' }
                                    ]}>
                                        x{currentBonusActionsAvailable}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity onPress={() => setResetModalVisible(true)}>
                                <Ionicons
                                    name="warning"
                                    size={24}
                                    color="red"
                                    style={[styles.headerIcon, { color: 'white' }]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.title}>{statsData.class} Spellbook</Text>
                    {renderPreparedSpellBlocksForClass()}
                    {renderCantripBlocks()}
                    {renderAllKnownSpells()}
                    {renderCastableSpells()}
                </View>


                {/* Footer Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
                    {/* Footer Button */}
                    <ImageBackground source={endActionImageTyped} style={styles.footerButtonContainer} resizeMode="cover" >
                        <TouchableOpacity style={styles.footerButton} onPress={endTurn}>
                            <Text style={styles.footerButtonText}>Next Turn</Text>
                            <Ionicons name="refresh" size={28} color="white" style={{ marginLeft: 5 }} />
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </View>

            {/* Cantrip Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={cantripModalVisible}
            >
                <TouchableWithoutFeedback onPress={() => setCantripModalVisible(false)}>
                    <View style={[styles.modalOverlay, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.cantripModal, { height: '100%', width: '100%', paddingTop: 60, paddingBottom: 40, justifyContent: 'space-between' }]}>
                                <View>
                                    <Text style={[styles.title, { color: 'black' }]}>
                                        {cantripChoiceValue || (cantripPressedIndex !== null ? cantripSlotsData[cantripPressedIndex] : '')}
                                    </Text>

                                    <View style={{ paddingBottom: 10, zIndex: 1000 }}>
                                        {renderCantripChoicesBasedOnLevel()}
                                    </View>
                                </View>
                                {/* Buttons */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                    {cantripPressedIndex !== null && cantripSlotsData[cantripPressedIndex] !== null && cantripSlotsData[cantripPressedIndex] !== '' ? (
                                        <Button
                                            title="Cast"
                                            disabled={!cantripSlotsData[cantripPressedIndex] || !canAffordCantrip(cantripSlotsData[cantripPressedIndex])}
                                            onPress={() => castCantrip()}
                                        />
                                    ) : <Button
                                        title="Assign"
                                        color="green"
                                        disabled={cantripChoiceValue === null}
                                        onPress={() => {
                                            setCantripInSlot();
                                        }}
                                    />}
                                    <TouchableWithoutFeedback onPress={() => setCantripModalVisible(false)}>
                                        <Text style={{ color: 'black' }}>Close</Text>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={resetModalVisible}
            >
                <TouchableWithoutFeedback onPress={() => setResetModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.resetModal}>
                            <Text>Are you sure you want to reset your spellbook?</Text>
                            <Button
                                title="Reset"
                                color="red"
                                onPress={() => {
                                    resetSpellbook();
                                    setResetModalVisible(false);
                                }} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </>
    );
}
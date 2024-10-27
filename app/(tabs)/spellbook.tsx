// Start of Selection

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, ImageBackground, Modal, TouchableWithoutFeedback, Button, Alert, ImageSourcePropType } from 'react-native';
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

const cantripImages = {
    'Acid Splash': acidSplashImage,
    'Blade Ward': bladeWardImage,
    'Booming Blade': boomingBladeImage,
    'Chill Touch': chillTouchImage,
    'Control Flames': controlFlamesImage,
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
    features?: string | object[];
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
    const [cantripChoiceFeatures, setCantripChoiceFeatures] = useState<string | object[] | null>(null);

    // New state to manage cantrip assignments
    const [cantripSlotsData, setCantripSlotsData] = useState<(string | null)[]>([]);


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
                const availableCantrips = getAvailableCantrips(statsData.class || '');
                if (cantripSlots) {
                    setCantripSlotsData(Array(cantripSlots).fill(null).map(() => availableCantrips[0]?.name || null));
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
        if (preparedSpellSlots === 0 && preparedSpellSlots !== null) {
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
        console.log('Cantrip pressed', index);
        setCantripModalVisible(true);
        setCantripPressedIndex(index);
    }

    const renderCantripBlock = (index: number) => (
        <TouchableOpacity
            style={[styles.addCantripButton, { width: itemWidth }]}
            onPress={() => {
                handleCantripPress(index);
            }}
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
            cantrip.classes.map(cls => cls.toLowerCase()).includes(currentClass.toLowerCase())
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

    const getFeaturesFromCantrip = (cantripName: string): string => {
        const allCantrips = getAvailableCantrips(statsData.class || '');
        const selectedCantrip = allCantrips.find(cantrip => cantrip.name === cantripName);

        if (selectedCantrip && selectedCantrip.features) {
            if (typeof selectedCantrip.features === 'object') {
                return JSON.stringify(selectedCantrip.features, null, 2);
            } else if (typeof selectedCantrip.features === 'string') {
                return selectedCantrip.features;
            }
        }
        return '-';
    }

    const renderCantripChoicesBasedOnLevel = () => {
        const availableCantrips = getAvailableCantrips(statsData.class || '');
        const handleCantripPreview = (cantrip: { name: string; description: string; features?: string | object[]; damage?: string }) => {
            setCantripChoiceValue(cantrip.name);
            setCantripChoiceDescription(cantrip.description || '');
            setCantripChoiceFeatures(cantrip.features || null);
        }
        return (
            <View>
                {/* Makes sure the cantrip slot is selected */}
                {cantripPressedIndex !== null && (
                    <>
                        {/* Show this when the cantrip slot is empty */}
                        {(cantripSlotsData[cantripPressedIndex] === '' || cantripSlotsData[cantripPressedIndex] === null) && (
                            <>
                                <DropDownPicker
                                    open={openCantripChoice}
                                    value={cantripChoiceValue}
                                    items={availableCantrips.map(cantrip => ({
                                        label: cantrip.name,
                                        value: cantrip.name
                                    }))}
                                    setOpen={setOpenCantripChoice}
                                    setValue={setCantripChoiceValue}
                                    placeholder="Select a cantrip"
                                    style={{ marginBottom: 10 }}
                                    zIndex={1000}
                                    onChangeValue={(value) => {
                                        const selected = availableCantrips.find(cantrip => cantrip.name === value);
                                        if (selected) {
                                            handleCantripPreview({
                                                // Start of Selection
                                                name: selected.name,
                                                description: selected.description || '',
                                                features: (selected as Cantrip).features,
                                            });
                                        }
                                    }}
                                />
                                <Text>Selected Cantrip:</Text>
                                <Text>{cantripChoiceValue}</Text>
                                <Text>Description:</Text>
                                <Text>{cantripChoiceDescription}</Text>
                                {/* Features Section */}
                                <Text>Features:</Text>
                                <Text>
                                    {getFeaturesFromCantrip(cantripChoiceValue ?? '') || ''}
                                </Text>

                                <Button
                                    title="Assign"
                                    color="green"
                                    disabled={cantripChoiceValue === null}
                                    onPress={() => {
                                        setCantripInSlot();
                                    }}
                                />
                            </>
                        )}
                        {/* Show this when the cantrip slot is NOT empty */}
                        {cantripSlotsData[cantripPressedIndex] !== '' && cantripSlotsData[cantripPressedIndex] !== null && (
                            <View>
                                <Text>Selected Cantrip:</Text>
                                <Text>{cantripSlotsData[cantripPressedIndex]}</Text>
                                <Text>Damage:</Text>
                                <Text>
                                    {getDamageFromCantrip(cantripSlotsData[cantripPressedIndex])?.toString() || ''}
                                </Text>
                                <Text>Description:</Text>
                                <Text>{availableCantrips.find(cantrip => cantrip.name === cantripSlotsData[cantripPressedIndex])?.description || ''}</Text>
                                {/* Features Section */}
                                <Text>Features:</Text>
                                <Text>
                                    {getFeaturesFromCantrip(cantripSlotsData[cantripPressedIndex]) || ''}
                                </Text>
                            </View>
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
        setCantripChoiceFeatures(null);
        setCantripPressedIndex(null);
    }

    const removeCantripFromSlot = () => {
        if (cantripPressedIndex === null) {
            Alert.alert('Error', 'No cantrip slot selected.');
            return;
        }
        const updatedCantripSlots = [...cantripSlotsData];
        updatedCantripSlots[cantripPressedIndex] = '';
        setCantripSlotsData(updatedCantripSlots);
        saveCantripSlots(updatedCantripSlots);
        setCantripPressedIndex(null);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{statsData.class} Spellbook</Text>
            {renderPreparedSpellBlocksForClass()}
            {renderCantripBlocks()}
            {renderAllKnownSpells()}
            {renderCastableSpells()}
            {/* Cantrip Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={cantripModalVisible}
            >
                <TouchableWithoutFeedback onPress={() => setCantripModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.cantripModal}>
                            <Text style={[styles.title, { color: 'black' }]}>Cantrip Slot {(cantripPressedIndex !== null ? cantripPressedIndex : 0) + 1}</Text>
                            <View style={{ marginBottom: 10, zIndex: 1000 }}>
                                {renderCantripChoicesBasedOnLevel()}
                            </View>
                            {/* Unassign Button */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                {cantripPressedIndex !== null && cantripSlotsData[cantripPressedIndex] !== null && cantripSlotsData[cantripPressedIndex] !== '' && (
                                    <Button
                                        title="Unassign"
                                        color="red"
                                        onPress={() => {
                                            removeCantripFromSlot();
                                            setCantripModalVisible(false);
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>{/* Reset Confirmation Modal */}
        </View>
    );
}


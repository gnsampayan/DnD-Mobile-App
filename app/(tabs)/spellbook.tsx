// Start of Selection

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, ImageBackground, Modal, TouchableWithoutFeedback, Button, Alert } from 'react-native';
import styles from '@/app/styles/spellbookStyles';
import classData from '@/app/data/classData.json';
import StatsDataContext from '../context/StatsDataContext';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add learned spells from other wizards and scrolls
const learnedSpellsFromOtherWizards = 0;
const learnedSpellsFromScrolls = 0;

// TODO: Add cantrip choices for each class and add them to the cantripChoices.json file
const cantripChoices = {
    cleric: [
        { name: 'Light', description: 'Make an object glow like a torch.' },
        { name: 'Mending', description: 'Repair a single break or tear in an object.' },
        { name: 'Sacred Flame', description: 'Flame-like radiance descends on a creature.' },
        { name: 'Thaumaturgy', description: 'Manifest minor wonders, signs of supernatural power.' }
    ],
    bard: [
        { name: 'Dancing Lights', description: 'Create up to four torch-sized lights.' },
        { name: 'Mage Hand', description: 'Create a spectral hand that can manipulate objects.' },
        { name: 'Minor Illusion', description: 'Create a sound or an image of an object.' },
        { name: 'Vicious Mockery', description: 'Unleash a string of insults laced with magic.' }
    ],
    wizard: [
        { name: 'Acid Splash', description: 'Hurl a bubble of acid at one or two creatures.' },
        { name: 'Fire Bolt', description: 'Hurl a mote of fire at a creature or object.' },
        { name: 'Mage Hand', description: 'Create a spectral hand that can manipulate objects.' },
        { name: 'Prestidigitation', description: 'Perform minor magical tricks.' },
        { name: 'Ray of Frost', description: 'A frigid beam of blue-white light freezes a creature.' }
    ]
};

// Key for AsyncStorage
const CANTRIP_SLOTS_KEY = '@cantrip_slots';

export default function SpellbookScreen() {
    const [preparedSpellSlots, setPreparedSpellSlots] = useState<number | null>(null);
    const [cantripSlots, setCantripSlots] = useState<number | null>(null);
    const [allKnownSpellsSlots, setAllKnownSpellsSlots] = useState<number | null>(null);
    const [cantripModalVisible, setCantripModalVisible] = useState(false);
    const [cantripPressedIndex, setCantripPressedIndex] = useState<number | null>(null);
    const [openCantripChoice, setOpenCantripChoice] = useState(false);
    const [cantripChoiceValue, setCantripChoiceValue] = useState<string | null>(null);
    const [cantripChoiceDescription, setCantripChoiceDescription] = useState<string | null>(null);

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
                // Initialize with nulls if no data is saved
                if (cantripSlots) {
                    setCantripSlotsData(Array(cantripSlots).fill(null));
                }
            }
        } catch (error) {
            console.error('Failed to load cantrip slots from storage', error);
        }
    };

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

    const numColumns = 6;
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
                style={styles.cantripButtonBackground}
                source={{ uri: 'https://via.placeholder.com/150?text=&bg=EEEEEE' }}
                resizeMode="cover"
            >
                <View style={styles.cantripBlock}>
                    {cantripSlotsData[index] !== null && cantripSlotsData[index] !== '' ? (
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            {cantripSlotsData[index]}
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
    const renderCantripChoicesBasedOnLevel = () => {
        const currentClass = statsData.class?.toLowerCase() as keyof typeof cantripChoices;
        const allCantrips = cantripChoices[currentClass] || [];
        // Get all selected cantrips except the one in the current slot
        const selectedCantrips = cantripSlotsData.filter((cantrip, index) => cantrip && index !== cantripPressedIndex);
        // Available cantrips are all cantrips minus selected ones
        const availableCantrips = allCantrips.filter(cantrip => !selectedCantrips.includes(cantrip.name));
        const handleCantripPreview = (cantrip: { name: string; description: string }) => {
            setCantripChoiceValue(cantrip.name);
            setCantripChoiceDescription(cantrip.description);
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
                                            handleCantripPreview(selected);
                                        }
                                    }}
                                />
                                <Text>Selected Cantrip:</Text>
                                <Text>{cantripChoiceValue}</Text>
                                <Text>Description:</Text>
                                <Text>{cantripChoiceDescription}</Text>

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
                                <Text>Description:</Text>
                                <Text>{allCantrips.find(cantrip => cantrip.name === cantripSlotsData[cantripPressedIndex])?.description || ''}</Text>
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

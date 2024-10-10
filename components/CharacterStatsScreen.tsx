import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Keyboard, TouchableWithoutFeedback, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../app/styles/meStyles'; // Adjust the path if necessary
import abilitiesData from '../app/data/abilities.json';
import skillsData from '../app/data/skills.json';
import xpThresholds from '../app/data/xpthresholds.json';
import * as FileSystem from 'expo-file-system';

interface CharacterStatsScreenProps {
    onBack: () => void;
}


// Define the ability type
interface Ability {
    id: number;
    name: string;
    value: number;
}

interface Skill {
    id: number;
    name: string;
    isProficient: boolean;
    dependency: string;
}

// Define Allocation History Interface
interface AllocationHistory {
    [level: number]: {
        [abilityId: number]: number;
    };
}

const XP_DATA_FILE = `${FileSystem.documentDirectory}xpData.json`;

// Functions to get level and proficiency bonus
const getLevelFromXp = (xp: number): number => {
    let level = 1;
    for (let i = 0; i < xpThresholds.length; i++) {
        if (xp >= xpThresholds[i].xp) {
            level = xpThresholds[i].level;
        } else {
            break;
        }
    }
    return level;
};


const getAbilityPointsFromLevel = (level: number): number => {
    return level === 1 ? 14 : 14 + (level - 1) * 2;
};


// Add Proficiency Bonus Function
const getProficiencyBonus = (level: number): number => {
    if (level >= 17) return 6;
    if (level >= 13) return 5;
    if (level >= 9) return 4;
    if (level >= 5) return 3;
    return 2;
};


const CharacterStatsScreen: React.FC<CharacterStatsScreenProps> = ({ onBack }) => {
    const [level, setLevel] = useState<number>(1);
    const [xp, setXp] = useState<number>(0);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');

    // Load abilities and skills from JSON data
    const [abilities, setAbilities] = useState<Ability[]>(abilitiesData);
    const [skills, setSkills] = useState<Skill[]>(skillsData);

    // States for Ability Modification Modal
    const [abilityModalVisible, setAbilityModalVisible] = useState<boolean>(false);
    const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);

    // Allocation History
    const [allocationsPerLevel, setAllocationsPerLevel] = useState<AllocationHistory>({});

    // Function to load XP, level, abilities, and allocations from file
    const loadXpData = async () => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(XP_DATA_FILE);
            if (fileInfo.exists) {
                const content = await FileSystem.readAsStringAsync(XP_DATA_FILE);
                const data = JSON.parse(content);
                setXp(data.xp);
                setLevel(data.level);
                setAbilities(data.abilities);
                setAllocationsPerLevel(data.allocationsPerLevel || { 1: {} });
            } else {
                // If file doesn't exist, initialize with default values
                const initialAllocations: AllocationHistory = {
                    1: {},
                };
                await saveXpData(xp, level, abilities, initialAllocations);
            }
        } catch (error) {
            console.error("Error loading XP data:", error);
        }
    };


    // Function to save XP, level, abilities, and allocations to file
    const saveXpData = async (
        currentXp: number,
        currentLevel: number,
        currentAbilities: Ability[],
        allocations: AllocationHistory
    ) => {
        try {
            const data = {
                xp: currentXp,
                level: currentLevel,
                abilities: currentAbilities,
                allocationsPerLevel: allocations,
            };
            await FileSystem.writeAsStringAsync(
                XP_DATA_FILE,
                JSON.stringify(data)
            );
        } catch (error) {
            console.error("Error saving XP data:", error);
        }
    };

    // Load XP data on component mount
    useEffect(() => {
        loadXpData();
    }, []);

    // Update level and initialize allocations for new level
    useEffect(() => {
        const newLevel = getLevelFromXp(xp);
        if (newLevel !== level) {
            setLevel(newLevel);
            setAllocationsPerLevel((prev) => ({
                ...prev,
                [newLevel]: {},
            }));
            saveXpData(xp, newLevel, abilities, {
                ...allocationsPerLevel,
                [newLevel]: {},
            });
        }
    }, [xp]);

    // Save abilities and allocations data whenever abilities or allocations change
    useEffect(() => {
        saveXpData(xp, level, abilities, allocationsPerLevel);
    }, [abilities, allocationsPerLevel]);

    // Synchronize selectedAbility with the latest abilities state
    useEffect(() => {
        if (selectedAbility) {
            const updatedAbility = abilities.find(a => a.id === selectedAbility.id);
            if (updatedAbility) {
                setSelectedAbility(updatedAbility);
            } else {
                setSelectedAbility(null);
            }
        }
    }, [abilities]);

    // Handle XP addition or subtraction
    const handleXpChange = (operation: 'add' | 'subtract') => {
        const changeValue = parseInt(inputValue) || 0;
        if (operation === 'add') {
            setXp((prevXp) => prevXp + changeValue);
        } else if (operation === 'subtract') {
            setXp((prevXp) => Math.max(prevXp - changeValue, 0));
        }
        setInputValue('');
        setModalVisible(false);
    };

    // Prepare data for the Ability Grid
    const gridData = abilities;

    // Calculate Available Ability Points
    const getAvailableAbilityPoints = (): number => {
        const totalPoints = getAbilityPointsFromLevel(level);
        const usedPoints = abilities.reduce((acc, ability) => acc + (ability.value - 8), 0);
        return totalPoints - usedPoints;
    };


    const availableAbilityPoints = getAvailableAbilityPoints();

    // Function to handle ability increment
    const incrementAbility = () => {
        if (!selectedAbility) return;

        // Fetch the latest ability details from state
        const currentAbility = abilities.find(a => a.id === selectedAbility.id);
        if (!currentAbility) {
            Alert.alert("Error", "Selected ability not found.");
            return;
        }

        // Check available points
        if (availableAbilityPoints <= 0) {
            Alert.alert("No Available Points", "You have no available ability points to allocate.");
            return;
        }

        // Determine maximum increment based on level
        const maxIncrement = level === 1 ? 4 : 2;
        const currentAllocation = allocationsPerLevel[level]?.[selectedAbility.id] || 0;

        if (currentAllocation >= maxIncrement) {
            Alert.alert(
                "Max Increment Reached",
                `You cannot increase ${selectedAbility.name} more than ${maxIncrement} points this level.`
            );
            return;
        }

        // Update allocations
        const updatedAllocations = {
            ...allocationsPerLevel,
            [level]: {
                ...allocationsPerLevel[level],
                [selectedAbility.id]: currentAllocation + 1,
            },
        };
        setAllocationsPerLevel(updatedAllocations);

        // Update abilities
        const updatedAbilities = abilities.map((ability) => {
            if (ability.id === selectedAbility.id) {
                return { ...ability, value: ability.value + 1 };
            }
            return ability;
        });
        setAbilities(updatedAbilities);

        // Persist changes
        saveXpData(xp, level, updatedAbilities, updatedAllocations);

        // Check if available points reached 0
        if (availableAbilityPoints - 1 === 0) {
            Alert.alert("No More Points", "You have allocated all available ability points.");
        }
    };

    // Function to handle ability decrement
    const decrementAbility = () => {
        if (!selectedAbility) return;

        // Fetch the latest ability details from state
        const currentAbility = abilities.find(a => a.id === selectedAbility.id);
        if (!currentAbility) {
            Alert.alert("Error", "Selected ability not found.");
            return;
        }

        // Prevent decrementing below 8
        if (currentAbility.value <= 8) {
            Alert.alert("Minimum Value", "Ability value cannot be less than 8.");
            return;
        }

        // Check if decrementing is allowed based on available points
        const maxAvailablePoints = level === 1 ? 14 : 2;
        if (availableAbilityPoints >= maxAvailablePoints) {
            Alert.alert(
                "Maximum Available Points",
                "You cannot decrement further as you've reached the maximum available points."
            );
            return;
        }

        // At level 2+, ensure decrements respect allocation history
        if (level > 1) {
            const allocatedThisLevel = allocationsPerLevel[level]?.[selectedAbility.id] || 0;
            if (allocatedThisLevel <= 0) {
                Alert.alert(
                    "No Allocations to Revert",
                    `You have not allocated points to ${selectedAbility.name} this level.`
                );
                return;
            }
        }

        // Update allocations
        const currentAllocation = allocationsPerLevel[level]?.[selectedAbility.id] || 0;
        const updatedAllocations = {
            ...allocationsPerLevel,
            [level]: {
                ...allocationsPerLevel[level],
                [selectedAbility.id]: Math.max(currentAllocation - 1, 0),
            },
        };
        setAllocationsPerLevel(updatedAllocations);

        // Update abilities
        const updatedAbilities = abilities.map((ability) => {
            if (ability.id === selectedAbility.id) {
                return { ...ability, value: ability.value - 1 };
            }
            return ability;
        });
        setAbilities(updatedAbilities);

        // Persist changes
        saveXpData(xp, level, updatedAbilities, updatedAllocations);
    };

    // Function to reset ability
    const resetAbility = () => {
        if (!selectedAbility) return;
        const currentLevelAllocations = allocationsPerLevel[level]?.[selectedAbility.id] || 0;
        if (currentLevelAllocations > 0) {
            Alert.alert(
                "Reset Allocation",
                `Are you sure you want to reset ${selectedAbility.name} to base value?`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Reset",
                        style: "destructive",
                        onPress: () => {
                            // Remove all allocations for this ability at current level
                            const updatedAllocations = {
                                ...allocationsPerLevel,
                                [level]: {
                                    ...allocationsPerLevel[level],
                                    [selectedAbility.id]: 0,
                                },
                            };
                            setAllocationsPerLevel(updatedAllocations);

                            // Set ability value to base (8)
                            const updatedAbilities = abilities.map((ability) => {
                                if (ability.id === selectedAbility.id) {
                                    return { ...ability, value: 8 };
                                }
                                return ability;
                            });
                            setAbilities(updatedAbilities);

                            // Save changes
                            saveXpData(xp, level, updatedAbilities, updatedAllocations);
                        },
                    },
                ]
            );
        } else {
            // Simply reset the ability to base value
            const updatedAbilities = abilities.map((ability) => {
                if (ability.id === selectedAbility.id) {
                    return { ...ability, value: 8 };
                }
                return ability;
            });
            setAbilities(updatedAbilities);
            saveXpData(xp, level, updatedAbilities, allocationsPerLevel);
        }
    };

    // Function to reset XP and level
    const resetXpAndLevel = () => {
        // Reset XP and level
        setXp(0);
        setLevel(1);

        // Reset abilities to base values
        const resetAbilities = abilities.map((ability) => ({
            ...ability,
            value: 8,
        }));
        setAbilities(resetAbilities);

        // Reset allocations
        setAllocationsPerLevel({ 1: {} });

        // Save changes
        saveXpData(0, 1, resetAbilities, { 1: {} });

    };

    // Function to open Ability Modal
    const openAbilityModal = (ability: Ability) => {
        setSelectedAbility(ability);
        setAbilityModalVisible(true);
    };

    // Render Ability Grid Item
    const renderGridItem = ({ item }: { item: Ability }) => {
        const modifier = Math.floor((item.value - 10) / 2);
        return (
            <TouchableOpacity
                style={styles.abilityContainer}
                onPress={() => openAbilityModal(item)}
            >
                <Text style={styles.abilityName}>{item.name}</Text>
                <View style={styles.abilityValueContainer}>
                    <Text style={styles.abilityValue}>{item.value}</Text>
                </View>
                <View style={styles.abilityModifierFooter}>
                    <View style={styles.abilityModifierContainer}>
                        <Text style={styles.abilityModifier}>
                            {modifier >= 0 ? `+${modifier}` : modifier}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Render Skill Item
    const renderSkillItem = ({ item }: { item: Skill }) => {
        // Find the related ability based on the dependency
        const relatedAbility = abilities.find(
            (ability) => ability.name.toLowerCase() === item.dependency.toLowerCase()
        );

        // Calculate the ability modifier
        const abilityModifier = relatedAbility
            ? Math.floor((relatedAbility.value - 10) / 2)
            : 0;

        // Get the proficiency bonus based on the current level
        const proficiencyBonus = getProficiencyBonus(level);

        // Calculate the skill value
        const skillValue =
            abilityModifier + (item.isProficient ? proficiencyBonus : 0);

        return (
            <View style={styles.skillContainer}>
                <Text style={styles.skillValue}>
                    {skillValue >= 0 ? `+${skillValue}` : `${skillValue}`}
                </Text>
                <Text style={styles.skillName}>{item.name.substring(0, 5)}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header for Character Stats Screen */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Character Stats</Text>
                <View style={styles.headerButtons}>
                    {/* Placeholder for alignment */}
                </View>
            </View>

            {/* Character Stats Content */}
            <View style={styles.firstRow}>
                <TouchableOpacity
                    style={styles.firstRowContents}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.firstRowText}>Level: {level}</Text>
                    <Text style={styles.firstRowText}>XP: {xp}</Text>
                </TouchableOpacity>
            </View>

            {/* Saving Throws */}
            <View style={styles.savingThrowsContainer}>
                <Text style={styles.savingThrowsTitle}>Saving Throws</Text>
                <View style={styles.savingThrowsGrid}>
                    {abilities.map((ability) => {
                        const modifier = Math.floor((ability.value - 10) / 2);
                        return (
                            <View key={ability.id} style={styles.savingThrowSquare}>
                                <Text style={styles.savingThrowModifier}>
                                    {modifier >= 0 ? `+${modifier}` : modifier}
                                </Text>
                                <Text style={styles.savingThrowAbility}>
                                    {ability.name.substring(0, 3)}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Ability Grid */}
            <View style={styles.characterStatsContainer}>
                <Text style={styles.characterStatsTitle}>Abilities</Text>
                <Text style={styles.availableAbilityPoints}>
                    Available Ability Points: {availableAbilityPoints}
                </Text>
                <FlatList
                    data={gridData}
                    renderItem={renderGridItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={styles.gridRow}
                    contentContainerStyle={styles.gridContainer}
                />
            </View>

            {/* Skills */}
            <View style={styles.skillsContainer}>
                <Text style={styles.skillsTitle}>Skills</Text>
                <FlatList
                    data={skills}
                    renderItem={renderSkillItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={6}
                    columnWrapperStyle={styles.gridRow}
                    contentContainerStyle={styles.skillsGridContainer}
                />
            </View>

            {/* XP Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Current XP: {xp}</Text>
                                    <TouchableOpacity
                                        style={styles.modalResetButton}
                                        onPress={() => {
                                            Alert.alert(
                                                "Reset XP",
                                                "Are you sure you want to reset your XP to 0?",
                                                [
                                                    {
                                                        text: "Cancel",
                                                        style: "cancel"
                                                    },
                                                    {
                                                        text: "Reset",
                                                        style: "destructive",
                                                        onPress: () => resetXpAndLevel()
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
                                        onPress={() => handleXpChange('subtract')}
                                    >
                                        <Text style={styles.modalButtonText}>Subtract</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modalButtonAdd}
                                        onPress={() => handleXpChange('add')}
                                    >
                                        <Text style={styles.modalButtonText}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


            {/* Ability Modification Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={abilityModalVisible}
                onRequestClose={() => {
                    setAbilityModalVisible(false);
                    setSelectedAbility(null);
                }}
            >
                <TouchableWithoutFeedback onPress={() => setAbilityModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContainer}>
                                {selectedAbility && (
                                    <>
                                        <View style={styles.modalHeader}>
                                            <Text style={styles.modalTitle}>{selectedAbility.name}</Text>
                                            <TouchableOpacity onPress={resetAbility}>
                                                <Text style={styles.modalResetButton}>Reset</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.modalSubtitle}>
                                            Current Value: {selectedAbility.value}
                                        </Text>
                                        <Text style={styles.modalSubtitle}>
                                            Available Points: {availableAbilityPoints}
                                        </Text>
                                        <View style={styles.modalButtons}>
                                            <TouchableOpacity
                                                style={styles.modalButtonSubtract}
                                                onPress={decrementAbility}
                                            >
                                                <Text style={styles.modalButtonText}>-</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.modalButtonAdd}
                                                onPress={incrementAbility}
                                            >
                                                <Text style={styles.modalButtonText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};



export default CharacterStatsScreen;
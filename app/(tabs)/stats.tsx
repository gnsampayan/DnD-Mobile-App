import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Keyboard, TouchableWithoutFeedback, Alert, FlatList, ImageBackground } from 'react-native';
import styles from '../styles/meStyles'; // Adjust the path if necessary
import skillsData from '../data/skills.json';
import xpThresholds from '../data/xpThresholds.json';
import StatsDataContext from '../context/StatsDataContext';

import strengthImage from '@images/abilities/strength.png';
import dexterityImage from '@images/abilities/dexterity.png';
import constitutionImage from '@images/abilities/constitution.png';
import intelligenceImage from '@images/abilities/intelligence.png';
import wisdomImage from '@images/abilities/wisdom.png';
import charismaImage from '@images/abilities/charisma.png';
import { Ionicons } from '@expo/vector-icons';

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

interface StatsData {
    xp: number;
    level: number;
    abilities: Ability[];
    allocationsPerLevel: AllocationHistory;
}

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

const CharacterStatsScreen: React.FC<CharacterStatsScreenProps> = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [skills, setSkills] = useState<Skill[]>(skillsData);

    // States for Ability Modification Modal
    const [abilityModalVisible, setAbilityModalVisible] = useState<boolean>(false);
    const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);

    // Use context for statsData
    const { statsData, updateStatsData } = useContext(StatsDataContext) as { statsData: StatsData, updateStatsData: (data: StatsData) => void };
    const { xp, level, abilities, allocationsPerLevel } = statsData;

    // Calculate Available Ability Points
    const getAvailableAbilityPoints = (): number => {
        const totalPoints = getAbilityPointsFromLevel(level);
        const usedPoints = abilities.reduce((acc, ability) => acc + (ability.value - 8), 0);
        return totalPoints - usedPoints;
    };


    const availableAbilityPoints = getAvailableAbilityPoints();

    // Function to handle XP changes
    const handleXpChange = (operation: 'add' | 'subtract') => {
        const changeValue = parseInt(inputValue) || 0;
        let newXp = xp;
        if (operation === 'add') {
            newXp = xp + changeValue;
        } else if (operation === 'subtract') {
            newXp = Math.max(xp - changeValue, 0);
        }
        // Update level based on new XP
        const newLevel = getLevelFromXp(newXp);

        // If level changes, initialize allocations for new level
        let newAllocationsPerLevel = { ...allocationsPerLevel };
        if (newLevel !== level) {
            newAllocationsPerLevel = {
                ...allocationsPerLevel,
                [newLevel]: {},
            };
        }

        // Update statsData
        updateStatsData({
            ...statsData,
            xp: newXp,
            level: newLevel,
            allocationsPerLevel: newAllocationsPerLevel,
        });

        setInputValue('');
        setModalVisible(false);
    };

    // Function to handle ability increment
    const incrementAbility = () => {
        if (!selectedAbility) return;

        // Fetch the latest ability details from context
        const currentAbility = abilities.find((a) => a.id === selectedAbility.id);
        if (!currentAbility) {
            Alert.alert('Error', 'Selected ability not found.');
            return;
        }

        // Check available points
        if (availableAbilityPoints <= 0) {
            Alert.alert('No More Ability Points', 'Gain XP to level up and get more ability points.');
            return;
        }

        // Determine maximum increment based on level
        const maxIncrement = level === 1 ? 4 : 2;
        const currentAllocation = allocationsPerLevel[level]?.[selectedAbility.id] || 0;

        if (currentAllocation >= maxIncrement) {
            Alert.alert(
                'Max Increment Reached',
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

        // Update abilities
        const updatedAbilities = abilities.map((ability) => {
            if (ability.id === selectedAbility.id) {
                return { ...ability, value: ability.value + 1 };
            }
            return ability;
        });

        // Update statsData
        updateStatsData({
            ...statsData,
            abilities: updatedAbilities,
            allocationsPerLevel: updatedAllocations,
        });

        // Check if available points reached 0
        if (availableAbilityPoints - 1 === 0) {
            Alert.alert('No More Points', 'You have allocated all available ability points.');
        }
    };


    // Function to handle ability decrement
    const decrementAbility = () => {
        if (!selectedAbility) return;

        // Fetch the latest ability details from context
        const currentAbility = abilities.find((a) => a.id === selectedAbility.id);
        if (!currentAbility) {
            Alert.alert('Error', 'Selected ability not found.');
            return;
        }

        // Prevent decrementing below 8
        if (currentAbility.value <= 8) {
            Alert.alert('Minimum Value', 'Ability value cannot be less than 8.');
            return;
        }

        // Check if decrementing is allowed based on available points
        const maxAvailablePoints = level === 1 ? 14 : 2;
        if (availableAbilityPoints >= maxAvailablePoints) {
            Alert.alert(
                'Maximum Available Points',
                "You cannot decrement further as you've reached the maximum available points."
            );
            return;
        }

        // At level 2+, ensure decrements respect allocation history
        if (level > 1) {
            const allocatedThisLevel = allocationsPerLevel[level]?.[selectedAbility.id] || 0;
            if (allocatedThisLevel <= 0) {
                Alert.alert(
                    'No Allocations to Revert',
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

        // Update abilities
        const updatedAbilities = abilities.map((ability) => {
            if (ability.id === selectedAbility.id) {
                return { ...ability, value: ability.value - 1 };
            }
            return ability;
        });


        // Update statsData
        updateStatsData({
            ...statsData,
            abilities: updatedAbilities,
            allocationsPerLevel: updatedAllocations,
        });
    };

    // Function to reset XP and level
    const resetXpAndLevel = () => {
        // Reset XP and level
        const resetXp = 0;
        const resetLevel = 1;

        // Reset abilities to base values
        const resetAbilities = abilities.map((ability) => ({
            ...ability,
            value: 8,
        }));


        // Reset allocations
        const resetAllocations: AllocationHistory = { 1: {} };

        // Update statsData
        updateStatsData({
            xp: resetXp,
            level: resetLevel,
            abilities: resetAbilities,
            allocationsPerLevel: resetAllocations,
        });
    };

    // Function to open Ability Modal
    const openAbilityModal = (ability: Ability) => {
        setSelectedAbility(ability);
        setAbilityModalVisible(true);
    };

    // Render Ability Grid Item
    const renderGridItem = ({ item }: { item: Ability }) => {
        const modifier = Math.floor((item.value - 10) / 2);

        // Map ability names to their corresponding images
        const abilityImages: { [key: string]: any } = {
            Strength: strengthImage,
            Dexterity: dexterityImage,
            Constitution: constitutionImage,
            Intelligence: intelligenceImage,
            Wisdom: wisdomImage,
            Charisma: charismaImage,
        };

        return (
            <TouchableOpacity
                style={styles.abilityContainer}
                onPress={() => openAbilityModal(item)}
            >
                <ImageBackground
                    source={abilityImages[item.name]}
                    style={styles.abilityBackgroundImage}
                    imageStyle={{ borderRadius: 8 }}
                >
                    <View style={styles.abilityOverlay}>
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
                    </View>
                </ImageBackground>
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
        const skillValue = abilityModifier + (item.isProficient ? proficiencyBonus : 0);

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
            {/* Header */}
            <View style={styles.statsHeader}>
                {/* Character Stats Content */}
                <View style={styles.firstRow}>
                    <View style={styles.levelContainer}>
                        <Ionicons name="link-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
                        <Text style={styles.firstRowText}>Level: {level}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.firstRowContents}
                        onPress={() => {
                            if (availableAbilityPoints === 0) {
                                setModalVisible(true);
                            } else {
                                Alert.alert(
                                    "Spend Ability Points First",
                                    "You cannot gain XP when there are ability points available to allocate.",
                                    [{ text: "OK" }]
                                );
                            }
                        }}
                    >
                        <Text style={styles.firstRowText}>XP: {xp}</Text>
                    </TouchableOpacity>
                </View>
            </View>



            {/* Saving Throws */}
            <View style={styles.savingThrowsContainer}>
                <View style={styles.rowIconTitle}>
                    <Ionicons name="link-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
                    <Text style={styles.savingThrowsTitle}>Saving Throws</Text>
                </View>
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
                    Available: {availableAbilityPoints}
                </Text>
                <FlatList
                    data={abilities}
                    renderItem={renderGridItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={styles.gridRow}
                    contentContainerStyle={styles.gridContainer}
                />
            </View>

            {/* Skills */}
            <View style={styles.skillsContainer}>
                <View style={styles.rowIconTitle}>
                    <Ionicons name="link-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
                    <Text style={styles.skillsTitle}>Skills</Text>
                </View>
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
                                                'Reset XP',
                                                'Are you sure you want to reset your XP to 0?',
                                                [
                                                    {
                                                        text: 'Cancel',
                                                        style: 'cancel',
                                                    },
                                                    {
                                                        text: 'Reset',
                                                        style: 'destructive',
                                                        onPress: () => resetXpAndLevel(),
                                                    },
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
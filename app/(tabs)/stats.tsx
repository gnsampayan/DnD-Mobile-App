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
import raceBonuses from '../data/raceBonuses.json';

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
    race?: string;
    class?: string;
    hpIncreases: { [level: number]: number };
    hitDice: number;
}

// Functions to get level  bonus
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
    return level === 1 ? 6 : 6 + (level - 1) * 2;
};


const CharacterStatsScreen: React.FC<CharacterStatsScreenProps> = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [skills, setSkills] = useState<Skill[]>(skillsData);
    const [hasUnfilledHpIncreases, setHasUnfilledHpIncreases] = useState(false);

    // States for Ability Modification Modal
    const [abilityModalVisible, setAbilityModalVisible] = useState<boolean>(false);
    const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
    const [levelModalVisible, setLevelModalVisible] = useState<boolean>(false);

    // Use context for statsData
    const { statsData, updateStatsData } = useContext(StatsDataContext) as { statsData: StatsData, updateStatsData: (data: StatsData) => void };

    if (!statsData) {
        // Render a loading indicator or return null
        return null;
    }

    useEffect(() => {
        const unfilledLevels = Array.from({ length: statsData.level - 1 }, (_, index) => index + 2).filter(
            (lvl) => statsData.hpIncreases[lvl] === undefined || statsData.hpIncreases[lvl] === null || statsData.hpIncreases[lvl] === 0
        );
        setHasUnfilledHpIncreases(unfilledLevels.length > 0);
    }, [statsData?.hpIncreases, statsData?.level]);

    const {
        xp = 0,
        level = getLevelFromXp(xp),
        abilities = [],
        allocationsPerLevel = {},
        hpIncreases = {},
        hitDice = 0,
    } = statsData || {};

    // Calculate total race bonus
    const getRaceBonusTotal = (race: string): number => {
        if (race === '') return 0;

        const selectedRaceBonus = raceBonuses.find(bonus => bonus.race === race);
        if (selectedRaceBonus) {
            const totalRaceBonus = selectedRaceBonus.total;
            return totalRaceBonus;
        } else {
            return 0;
        }
    };


    // Calculate Available Ability Points
    const getAvailableAbilityPoints = (): number => {
        const totalPoints = getAbilityPointsFromLevel(level) + getRaceBonusTotal(statsData.race || '');
        const usedPoints = abilities.reduce((acc, ability) => acc + (ability.value - 8), 0);
        return totalPoints - usedPoints;
    };


    const availableAbilityPoints = getAvailableAbilityPoints();

    // Function to handle XP changes
    const handleXpChange = () => {
        const changeValue = parseInt(inputValue) || 0;
        let newXp = xp;
        newXp = xp + changeValue;
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
        const maxIncrement = 2;
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


    // Function to handle ability decrement (undo increment)
    const decrementAbility = () => {
        if (!selectedAbility) return;

        // Fetch the latest ability details from context
        const currentAbility = abilities.find((a) => a.id === selectedAbility.id);
        if (!currentAbility) {
            Alert.alert('Error', 'Selected ability not found.');
            return;
        }

        // Get race bonuses
        const selectedRaceBonus = raceBonuses.find(bonus => bonus.race === statsData.race);
        const raceBonusValue = selectedRaceBonus ? (selectedRaceBonus.bonuses[currentAbility.name.toLowerCase() as keyof typeof selectedRaceBonus.bonuses] || 0) : 0;

        // Calculate the base value (without race bonus)
        const baseValue = currentAbility.value - raceBonusValue;

        // Prevent decrementing below base value (8 + race bonus)
        if (baseValue <= 8) {
            Alert.alert('Minimum Value', `${currentAbility.name} cannot be decreased further due to racial bonuses.`);
            return;
        }

        // Check if there are any allocations to undo for the current level
        const allocatedThisLevel = allocationsPerLevel[level]?.[selectedAbility.id] || 0;
        if (allocatedThisLevel <= 0) {
            Alert.alert(
                'No Recent Allocations',
                `You have not recently allocated points to ${currentAbility.name} this level.`
            );
            return;
        }

        // Update allocations
        const updatedAllocations = {
            ...allocationsPerLevel,
            [level]: {
                ...allocationsPerLevel[level],
                [selectedAbility.id]: allocatedThisLevel - 1,
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

        // Optionally, you can add a success message
        Alert.alert('Ability Decreased', `${currentAbility.name} has been decreased by 1.`);
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

        // Update statsData without resetting hitDice
        updateStatsData({
            xp: resetXp,
            level: resetLevel,
            abilities: resetAbilities,
            allocationsPerLevel: resetAllocations,
            hpIncreases: {},
            hitDice: statsData.hitDice,
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

        const skillValue = abilityModifier;

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
                    <TouchableOpacity
                        style={[
                            styles.levelContainer,
                            hasUnfilledHpIncreases && styles.levelContainerHighlighted,
                        ]}
                        onPress={() => setLevelModalVisible(true)}
                    >
                        <Ionicons name="link-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
                        <Text style={styles.firstRowText}>Level: {level}</Text>
                    </TouchableOpacity>
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
                        <Ionicons
                            name="warning"
                            size={24}
                            color="red"
                            style={[styles.headerIcon, { color: 'white' }]}
                        />
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
                <View style={styles.rowIconTitle}>
                    <Ionicons name="key" size={20} color="white" />
                    <Text style={styles.characterStatsTitle}>Abilities</Text>
                </View>
                <View style={styles.availableAbilityPointsContainer}>
                    <View style={availableAbilityPoints > 0 ? styles.availableAbilityPointsHighlighted : styles.availableAbilityPointsNotHighlighted}>
                        <Text style={styles.availableAbilityPoints}>
                            Available: {availableAbilityPoints}
                        </Text>
                    </View>
                </View>
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
                                        style={styles.modalButtonAdd}
                                        onPress={() => handleXpChange()}
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

            {/* Level Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={levelModalVisible}
                onRequestClose={() => {
                    setLevelModalVisible(false);
                }}
            >
                <TouchableWithoutFeedback onPress={() => setLevelModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Level: {level}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                    {Array.from({ length: statsData.level - 1 }, (_, index) => {
                                        const level = index + 2;
                                        return (
                                            <View key={level} style={{ flexDirection: 'column', alignItems: 'flex-start', margin: 5, gap: 5 }}>
                                                <Text style={styles.modalInputLabel}>Level {level} Increase:</Text>
                                                <TextInput
                                                    style={styles.modalInput}
                                                    placeholder="Enter increase"
                                                    keyboardType="number-pad"
                                                    placeholderTextColor="gray"
                                                    value={hpIncreases[level]?.toString() || ''}
                                                    onChangeText={(text) => {
                                                        const number = parseInt(text);
                                                        if (!isNaN(number) && number >= 0 && number <= hitDice) {
                                                            updateStatsData({
                                                                ...statsData,
                                                                hpIncreases: {
                                                                    ...(hpIncreases || {}),
                                                                    [level]: number,
                                                                },
                                                            });
                                                        } else if (text === '') {
                                                            const updatedIncreases = { ...(hpIncreases || {}) };
                                                            delete updatedIncreases[level];
                                                            updateStatsData({
                                                                ...statsData,
                                                                hpIncreases: updatedIncreases,
                                                            });
                                                        } else {
                                                            Alert.alert('Invalid input', `Please enter a number between 0 and ${hitDice}.`);
                                                        }
                                                    }}
                                                />
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};


export default CharacterStatsScreen;
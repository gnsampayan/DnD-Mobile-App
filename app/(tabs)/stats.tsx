import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Keyboard, TouchableWithoutFeedback, Alert, FlatList, ImageBackground, Button, ImageSourcePropType } from 'react-native';
import styles from '../styles/meStyles'; // Adjust the path if necessary
import skillsData from '../data/skills.json';
import xpThresholds from '../data/xpThresholds.json';
import StatsDataContext from '../../context/StatsDataContext';

import strengthImage from '@images/abilities/strength.png';
import dexterityImage from '@images/abilities/dexterity.png';
import constitutionImage from '@images/abilities/constitution.png';
import intelligenceImage from '@images/abilities/intelligence.png';
import wisdomImage from '@images/abilities/wisdom.png';
import charismaImage from '@images/abilities/charisma.png';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import raceBonuses from '../data/raceData.json';
import classBonuses from '../data/classData.json';
import xpImage from '@images/xp-image.png';
import artificerTable from '../data/class-tables/artificer/artificerTable.json';
import barbarianTable from '../data/class-tables/barbarian/barbarianTable.json';
import bardTable from '../data/class-tables/bard/bardTable.json';
import clericTable from '../data/class-tables/cleric/clericTable.json';
import druidTable from '../data/class-tables/druid/druidTable.json';
import fighterTable from '../data/class-tables/fighter/fighterTable.json';
import monkTable from '../data/class-tables/monk/monkTable.json';
import paladinTable from '../data/class-tables/paladin/paladinTable.json';
import rangerTable from '../data/class-tables/ranger/rangerTable.json';
import rogueTable from '../data/class-tables/rogue/rogueTable.json';
import sorcererTable from '../data/class-tables/sorcerer/sorcererTable.json';
import warlockTable from '../data/class-tables/warlock/warlockTable.json';
import wizardTable from '../data/class-tables/wizard/wizardTable.json';

import { CharacterContext, CharacterContextProps } from '../../context/equipmentActionsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    proficiencyBonus: number;
}


const CharacterStatsScreen: React.FC<CharacterStatsScreenProps> = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [inputValues, setInputValues] = useState<{ [level: number]: string }>({});
    const [skills] = useState<Skill[]>(skillsData);
    const [hasUnfilledHpIncreases, setHasUnfilledHpIncreases] = useState(false);
    const [constitutionModifier, setConstitutionModifier] = useState(0);
    const [abilityAllocationsSaveVisible, setAbilityAllocationsSaveVisible] = useState(false);
    const [availableAbilityPoints, setAvailableAbilityPoints] = useState(0);

    // States for Ability Modification Modal
    const [abilityModalVisible, setAbilityModalVisible] = useState<boolean>(false);
    const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
    const [levelModalVisible, setLevelModalVisible] = useState<boolean>(false);

    // Ref to track if the primal champion boost has been applied
    const primalChampionApplied = useRef(false);

    // Use context for statsData
    const {
        statsData,
        updateStatsData,
        unusedSkillPoints,
        setUnusedSkillPoints,
        skillProficiency,
        setSkillProficiency,
    } = useContext(StatsDataContext) as {
        statsData: StatsData,
        updateStatsData: (data: StatsData) => void,
        unusedSkillPoints: number,
        setUnusedSkillPoints: (value: number) => void,
        skillProficiency: string[],
        setSkillProficiency: (value: string[]) => void,
    };

    if (!statsData) {
        // Render a loading indicator or return null
        return null;
    }

    const {
        primalChampionEnabled,
        blessingsOfKnowledgeSkillsLearned,
        acolyteOfNatureSkillLearned,
        orderDomainSkillLearned
    } = useContext(CharacterContext) as CharacterContextProps;

    useEffect(() => {
        if (primalChampionEnabled && !primalChampionApplied.current) {
            // Apply the boost
            const updatedAbilities = statsData.abilities.map((ability) => {
                if (ability.name === 'Strength' || ability.name === 'Constitution') {
                    return {
                        ...ability,
                        value: Math.min(ability.value + 4, 24),
                        maxValue: 24, // Set the new max value
                    };
                }
                return ability;
            });
            updateStatsData({
                ...statsData,
                abilities: updatedAbilities
            });
            primalChampionApplied.current = true;
        } else if (!primalChampionEnabled && primalChampionApplied.current) {
            // Optionally remove the boost if primalChampionEnabled is turned off
            const updatedAbilities = statsData.abilities.map((ability) => {
                if (ability.name === 'Strength' || ability.name === 'Constitution') {
                    return {
                        ...ability,
                        value: Math.max(ability.value - 4, 8), // Reset to base or previous value
                        maxValue: 20, // Reset the max value
                    };
                }
                return ability;
            });
            updateStatsData({
                ...statsData,
                abilities: updatedAbilities
            });
            primalChampionApplied.current = false;
        }
    }, [primalChampionEnabled]);

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
        // Base ability points at level 1 for all classes
        let totalPoints = 27;

        // If not level 1, check class tables for ability score improvements
        if (level > 1) {
            const classType = statsData.class?.toLowerCase();
            let classLevels;

            // Get class table data based on class type
            switch (classType) {
                case 'artificer':
                    classLevels = artificerTable.filter(l => l.userLevel <= level);
                    break;
                case 'barbarian':
                    classLevels = barbarianTable.filter(l => l.userLevel <= level);
                    break;
                case 'bard':
                    classLevels = bardTable.filter(l => l.userLevel <= level);
                    break;
                case 'cleric':
                    classLevels = clericTable.filter(l => l.userLevel <= level);
                    break;
                case 'druid':
                    classLevels = druidTable.filter(l => l.userLevel <= level);
                    break;
                case 'fighter':
                    classLevels = fighterTable.filter(l => l.userLevel <= level);
                    break;
                case 'monk':
                    classLevels = monkTable.filter(l => l.userLevel <= level);
                    break;
                case 'paladin':
                    classLevels = paladinTable.filter(l => l.userLevel <= level);
                    break;
                case 'ranger':
                    classLevels = rangerTable.filter(l => l.userLevel <= level);
                    break;
                case 'rogue':
                    classLevels = rogueTable.filter(l => l.userLevel <= level);
                    break;
                case 'sorcerer':
                    classLevels = sorcererTable.filter(l => l.userLevel <= level);
                    break;
                case 'warlock':
                    classLevels = warlockTable.filter(l => l.userLevel <= level);
                    break;
                case 'wizard':
                    classLevels = wizardTable.filter(l => l.userLevel <= level);
                    break;
                default:
                    // For other classes, use default calculation
                    return totalPoints + (level - 1) * 2;
            }

            // Add 2 points for each level that has Ability Score Improvement as a feature
            classLevels.forEach(levelData => {
                if (levelData.features && levelData.features.some(feature =>
                    feature.toLowerCase() === 'ability score improvement'
                )) {
                    totalPoints += 2;
                }
            });
        }

        return totalPoints;
    };

    // Check if there are unfilled HP increases
    useEffect(() => {
        const unfilledLevels = Array.from({ length: statsData.level - 1 }, (_, index) => index + 2).filter(
            (lvl) => statsData.hpIncreases[lvl] === undefined || statsData.hpIncreases[lvl] === null
        );
        setHasUnfilledHpIncreases(unfilledLevels.length > 0);
        const constitutionAbility = statsData.abilities.find(ability => ability.name === 'Constitution');
        setConstitutionModifier(constitutionAbility ? Math.floor((constitutionAbility.value - 10) / 2) : 0);
    }, [statsData.hpIncreases, statsData.level, statsData.abilities]);

    // Destructure statsData
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

    // Function to calculate proficiency bonus based on level
    const getProficiencyBonus = (level: number): number => {
        if (level >= 17) return 6;
        if (level >= 13) return 5;
        if (level >= 9) return 4;
        if (level >= 5) return 3;
        return 2;
    };
    const proficiencyBonus = getProficiencyBonus(level);

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

    // Calculate Available Ability Points
    const getAvailableAbilityPoints = (): number => {
        const totalPoints = getAbilityPointsFromLevel(level);

        // Calculate total used points across all levels
        const usedPoints = Object.entries(allocationsPerLevel).reduce((totalAcc, [levelKey, allocations]) => {
            // For each level, sum up the allocations
            return totalAcc + Object.values(allocations).reduce((levelAcc: number, allocation: unknown) => {
                const allocationNum = Number(allocation);
                // For level 1, points above 5 cost double
                if (parseInt(levelKey) === 1) {
                    if (allocationNum <= 5) {
                        return levelAcc + allocationNum;
                    } else {
                        const regularPoints = 5;
                        const doublePoints = (allocationNum - 5);
                        return levelAcc + regularPoints + doublePoints;
                    }
                }
                return levelAcc + allocationNum;
            }, 0 as number);
        }, 0);

        return totalPoints - usedPoints;
    };

    useEffect(() => {
        const availablePoints = getAvailableAbilityPoints();
        setAvailableAbilityPoints(availablePoints);

        // Check if there are allocations for current level
        const currentLevelAllocations = allocationsPerLevel[level];
        const hasAllocationsForCurrentLevel = currentLevelAllocations && Object.keys(currentLevelAllocations).length > 0;

        // Only show save button if points were allocated this level, available points are 0, and abilityEditFinished is false
        if (availablePoints === 0 && hasAllocationsForCurrentLevel) {
            setAbilityAllocationsSaveVisible(true);
        }
    }, [statsData.level, statsData.abilities, allocationsPerLevel, level]);

    // Function to handle ability increment
    const incrementAbility = () => {
        if (!selectedAbility) return;

        const currentAllocation = allocationsPerLevel[level]?.[selectedAbility.id] || 0;

        // Fetch the latest ability details from context
        const currentAbility = statsData.abilities.find((a) => a.id === selectedAbility.id);
        if (!currentAbility) {
            Alert.alert('Error', 'Selected ability not found.');
            return;
        }

        // Determine the maximum value based on primalChampionEnabled
        const isPrimalChamp = primalChampionEnabled &&
            (currentAbility.name === 'Strength' || currentAbility.name === 'Constitution');
        const maxAllowed = isPrimalChamp ? 24 : 20;

        // Calculate how many points this increment will cost
        let pointCost = 1;
        if (currentAllocation >= 5 && level === 1) {
            pointCost = 2;
        }

        // Check if at level 1 and would exceed 9 allocations
        if (level === 1 && currentAllocation >= 9) {
            Alert.alert('Maximum Allocations Reached', 'Cannot exceed 9 allocations at level 1.');
            return;
        }

        // Check if ability points available is less than point cost
        if (availableAbilityPoints < pointCost) {
            Alert.alert(
                'Not Enough Ability Points',
                `You need ${pointCost} point${pointCost > 1 ? 's' : ''} to increase ${selectedAbility.name} from ${currentAbility.value} to ${currentAbility.value + 1}. You currently have ${availableAbilityPoints} point${availableAbilityPoints !== 1 ? 's' : ''}.`
            );
            return;
        }

        // Check if ability would exceed maximum
        if (currentAbility.value >= maxAllowed) {
            Alert.alert('Maximum Value Reached', `${currentAbility.name} cannot exceed ${maxAllowed}.`);
            return;
        }

        // Update allocations
        const updatedAllocations = {
            ...allocationsPerLevel,
            [level]: {
                ...allocationsPerLevel[level],
                [selectedAbility.id]: currentAllocation + pointCost,
            },
        };

        // Update abilities (value goes up by +1, not by point cost)
        const updatedAbilities = statsData.abilities.map((ability) => {
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
                'Cannot Decrease Any More',
                `Minimum ${currentAbility.name} value reached.`
            );
            return;
        }

        // Calculate how many points to return based on level and current allocation
        let pointsToReturn = 1;
        if (level === 1 && allocatedThisLevel > 5) {
            pointsToReturn = 2;
        }

        // Update allocations
        const updatedAllocations = {
            ...allocationsPerLevel,
            [level]: {
                ...allocationsPerLevel[level],
                [selectedAbility.id]: allocatedThisLevel - pointsToReturn,
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

        // Check if the ability is a primary ability for the user's class
        const isPrimaryAbility = statsData.class && classBonuses.find(c => c.value === statsData.class)?.primaryAbility.includes(item.name);

        return (
            <TouchableOpacity
                style={[
                    styles.abilityContainer,
                    {
                        borderColor:
                            hasUnfilledHpIncreases ? 'transparent'
                                : (availableAbilityPoints > 0 || abilityAllocationsSaveVisible
                                    ? (selectedAbility && selectedAbility.id === item.id
                                        ? 'gold' : 'white')
                                    : 'rgba(255, 255, 255, 0.1)'),
                        zIndex: 2000
                    }
                ]}
                onPress={() => {
                    if (hasUnfilledHpIncreases) { //if level 1 hp increase is not set, don't allow ability point allocation
                        Alert.alert(`Level ${level} HP Increase Not Set`, 'Set the Level 1 HP Increase before allocating ability points.');
                    } else {
                        openAbilityModal(item);
                    }
                }}
                disabled={availableAbilityPoints <= 0 && !abilityAllocationsSaveVisible}
            >
                <ImageBackground
                    source={abilityImages[item.name]}
                    style={styles.abilityBackgroundImage}
                    imageStyle={{ borderRadius: 8 }}
                >
                    <View style={styles.abilityOverlay}>
                        <Text style={[
                            styles.abilityName,
                            isPrimaryAbility
                                ? { color: 'black', backgroundColor: 'rgba(255, 255, 255, 1)' }
                                : {}
                        ]}>
                            {item.name}
                        </Text>
                        <View style={styles.abilityModifierContainer}>
                            <Text style={styles.abilityModifier}>
                                {modifier >= 0 ? `+${modifier}` : modifier}
                            </Text>
                        </View>
                        <View style={styles.abilityModifierFooter}>
                            <View style={[
                                styles.abilityValueContainer,
                                selectedAbility && selectedAbility.id === item.id ? { backgroundColor: 'gold' } : {}
                            ]}>
                                <Text style={styles.abilityValue}>
                                    {item.value}
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

        // Get race data
        const raceData = raceBonuses.find((race) => race.race === statsData.race);

        // Determine if the skill proficiency is gained from race
        const raceProficiency = raceData?.skillProficiency?.includes(item.name.toLowerCase());

        // Determine if the skill proficiency is gained from skills learned (skillProficienciesGained)
        const gainedProficiency = skillProficiency?.includes(item.name.toLowerCase());

        // Determine if the skill proficiency is gained from blessings of knowledge
        const blessingsOfKnowledgeProficiency = blessingsOfKnowledgeSkillsLearned?.includes(item.name.toLowerCase());

        // Determine if the skill proficiency is gained from acolyte of nature
        const acolyteOfNatureProficiency = acolyteOfNatureSkillLearned?.includes(item.name.toLowerCase());

        // Determine if the skill proficiency is gained from order domain
        const orderDomainProficiency = orderDomainSkillLearned?.includes(item.name.toLowerCase());

        // Calculate the total skill modifier, if from blessings of knowledge, add proficiency bonus twice
        const skillModifier =
            abilityModifier + (
                raceProficiency ||
                    gainedProficiency ||
                    blessingsOfKnowledgeProficiency ||
                    acolyteOfNatureProficiency ||
                    orderDomainProficiency ?
                    proficiencyBonus : 0
            );

        // Determine if the skill is proficient (either from race or gained)
        const isProficient =
            raceProficiency ||
            gainedProficiency ||
            blessingsOfKnowledgeProficiency ||
            acolyteOfNatureProficiency ||
            orderDomainProficiency;

        // Define allowed skills per class
        const allowedSkillsByClass: { [key: string]: string[] } = {
            artificer: ['arcana', 'history', 'investigation', 'medicine', 'nature', 'perception', 'sleight of hand'],
            barbarian: ['animal handling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
            // bard has no restrictions
            cleric: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
            druid: ['arcana', 'animal handling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'],
            fighter: ['acrobatics', 'animal handling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
            monk: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
            paladin: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'],
            ranger: ['animal handling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'],
            rogue: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleight of hand', 'stealth'],
            sorcerer: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
            warlock: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'],
            wizard: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'],
        };

        // Check if skill is allowed for current class
        const isSkillAllowedForClass = () => {
            if (!statsData.class) return true; // If no class selected, all skills allowed
            const currentClass = statsData.class.toLowerCase();
            const allowedSkills = allowedSkillsByClass[currentClass];

            // If class has restrictions, check if skill is in allowed list
            if (allowedSkills) {
                return allowedSkills.includes(item.name.toLowerCase());
            }

            return true; // If class has no restrictions, all skills allowed
        };

        return (
            <TouchableOpacity
                style={[
                    styles.skillContainer,
                    isProficient ? { backgroundColor: 'white' } : {},
                    // only show gold border if skill is not proficient, has unused points and is allowed
                    (!isProficient && unusedSkillPoints > 0 && isSkillAllowedForClass()) ? { borderColor: 'gold', borderWidth: 1 } : {}
                ]}
                onPress={() => {
                    // Only handle adding proficiency if not already proficient
                    if (unusedSkillPoints > 0 && !isProficient) {
                        Alert.alert(
                            "Confirm Skill Proficiency",
                            `Do you want to gain proficiency in ${item.name}?`,
                            [
                                {
                                    text: "Cancel",
                                    style: "cancel"
                                },
                                {
                                    text: "Confirm",
                                    onPress: () => {
                                        setSkillProficiency([...skillProficiency, item.name.toLowerCase()]);
                                        setUnusedSkillPoints(unusedSkillPoints - 1);
                                    }
                                }
                            ]
                        );
                    }
                }}
                onLongPress={() => {
                    if (!isProficient) {
                        Alert.alert(
                            "Force Skill Proficiency",
                            `Do you want to force proficiency in ${item.name}? This will bypass class restrictions and skill point costs. Ask a DM before doing this.`,
                            [
                                {
                                    text: "Cancel",
                                    style: "cancel"
                                },
                                {
                                    text: "Force Proficiency",
                                    onPress: () => {
                                        setSkillProficiency([...skillProficiency, item.name.toLowerCase()]);
                                    }
                                }
                            ]
                        );
                    }
                }}
                disabled={isProficient || (unusedSkillPoints > 0 && !isSkillAllowedForClass())}
            >
                <Text style={[styles.skillValue, isProficient ? { color: 'black' } : {}]}>
                    {skillModifier >= 0 ?
                        `+${skillModifier + (blessingsOfKnowledgeProficiency ? proficiencyBonus : 0)}` :
                        `${skillModifier + (blessingsOfKnowledgeProficiency ? proficiencyBonus : 0)}`}
                </Text>
                <Text style={[styles.skillName, isProficient ? { color: 'black' } : {}]}>
                    {item.name.substring(0, 5)}
                </Text>
            </TouchableOpacity>
        );
    };

    const saveAbilityAllocations = () => {
        updateStatsData({
            ...statsData
        });
        setAbilityAllocationsSaveVisible(false);
    }

    const renderLevelModal = () => {
        // Find the next level that needs HP input
        const nextLevelToFill = Array.from({ length: statsData.level - 1 }, (_, i) => i + 2)
            .find(lvl => hpIncreases[lvl] === undefined);

        if (!nextLevelToFill) {
            return (
                <>
                    <View style={[styles.modalHeader, { flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 20 }]}>
                        <Text style={styles.modalTitle}>PC Level: {level}</Text>
                        <Text>All levels have HP values assigned</Text>
                    </View>
                    <View style={{ position: 'absolute', bottom: 60, width: '100%', marginLeft: 20 }}>
                        <Button
                            title="Close"
                            color='black'
                            onPress={() => setLevelModalVisible(false)}
                        />
                    </View>
                </>
            );
        }

        return (
            <>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>PC Level: {level}</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    <View
                        key={nextLevelToFill}
                        style={{ flexDirection: 'column', justifyContent: 'flex-start' }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                                <Text style={styles.modalInputLabel}>Enter Rolled Hit Dice for Level {nextLevelToFill}:</Text>
                                <TextInput
                                    style={[styles.modalInput, {
                                        width: 150,
                                        height: 80,
                                        textAlign: 'center',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        fontSize: 40
                                    }]}
                                    placeholder="1"
                                    keyboardType="number-pad"
                                    placeholderTextColor="gray"
                                    onChangeText={(text) => {
                                        const number = parseInt(text);
                                        if (
                                            !isNaN(number) &&
                                            number >= 1 &&
                                            number <= hitDice
                                        ) {
                                            setInputValues((prev) => ({ ...prev, [nextLevelToFill]: text }));
                                        } else if (text === '') {
                                            setInputValues((prev) => ({ ...prev, [nextLevelToFill]: '' }));
                                        } else {
                                            Alert.alert(
                                                'Invalid input',
                                                `Please enter a number between 1 and ${hitDice}.`
                                            );
                                        }
                                    }}
                                    value={inputValues[nextLevelToFill] || ''}
                                />
                                <View style={{ flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                        <Text>Hit Dice:</Text>
                                        <Text style={{ fontSize: 20 }}>{hitDice}</Text>
                                        <Ionicons name="dice" size={20} color="black" />
                                    </View>
                                    <Text style={styles.modalInputLabel}>
                                        Bonus HP: + {constitutionModifier} (Con)
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {inputValues[nextLevelToFill] &&
                            <TouchableOpacity
                                style={[styles.saveButton, {
                                    marginTop: 20,
                                    flexDirection: 'row',
                                    gap: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 60,
                                    borderRadius: 4,
                                    backgroundColor: 'gold',
                                    borderWidth: 1,
                                    borderColor: 'black',
                                }]}
                                onPress={() => {
                                    const number = parseInt(inputValues[nextLevelToFill]);
                                    if (
                                        !isNaN(number) &&
                                        number >= 1 &&
                                        number <= hitDice
                                    ) {
                                        const totalIncrease = number + constitutionModifier;
                                        updateStatsData({
                                            ...statsData,
                                            hpIncreases: {
                                                ...(hpIncreases || {}),
                                                [nextLevelToFill]: totalIncrease,
                                            },
                                        });
                                        setInputValues((prev) => ({ ...prev, [nextLevelToFill]: '' }));
                                    } else {
                                        Alert.alert(
                                            'Invalid input',
                                            `Please enter a number between 1 and ${hitDice}.`
                                        );
                                    }
                                }}
                            >
                                <Ionicons name="save" color="black" size={20} />
                                <Text style={[styles.saveButtonText, { color: 'black' }]}>Save</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={{ position: 'absolute', bottom: 60, width: '100%', marginLeft: 20 }}>
                    <Button
                        title="Close"
                        color='black'
                        onPress={() => setLevelModalVisible(false)}
                    />
                </View>
            </>
        );
    }


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.statsHeader}>
                {/* Character Stats Content */}
                <View style={styles.firstRow}>

                    {/* Level */}
                    <TouchableOpacity
                        style={[
                            styles.levelContainer,
                            hasUnfilledHpIncreases && styles.levelContainerHighlighted,
                        ]}
                        onPress={() => setLevelModalVisible(true)}
                    >
                        <Ionicons name="school" size={20} color="lightgrey" />
                        <Text style={styles.firstRowText}>Level: {level}</Text>
                    </TouchableOpacity>

                    {/* XP */}
                    <TouchableOpacity
                        style={[styles.firstRowContents, {
                            borderColor: (availableAbilityPoints > 0 || abilityAllocationsSaveVisible || hasUnfilledHpIncreases) ? 'grey' : 'white',
                            opacity: (availableAbilityPoints > 0 || abilityAllocationsSaveVisible || hasUnfilledHpIncreases) ? 0.5 : 1
                        }]}
                        onPress={() => {
                            if (!abilityAllocationsSaveVisible && availableAbilityPoints === 0) {
                                setModalVisible(true);
                            } else {
                                Alert.alert(
                                    "Spend Ability Points First",
                                    "You cannot gain XP when there are ability points available to allocate.",
                                    [{ text: "OK" }]
                                );
                            }
                        }}
                        disabled={abilityAllocationsSaveVisible || hasUnfilledHpIncreases}
                    >
                        <ImageBackground
                            source={xpImage as ImageSourcePropType}
                            resizeMode='cover'
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{
                                flexDirection: 'row',
                                gap: 5
                            }}>
                                <MaterialCommunityIcons name="sword-cross" size={20} color="white" />
                                <Text style={styles.firstRowText}>
                                    {xp}
                                </Text>

                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                </View>
            </View>



            {/* Saving Throws */}
            <View style={styles.savingThrowsContainer}>
                <View style={[styles.rowIconTitle, { alignItems: 'center', marginBottom: 5 }]}>
                    <View style={{ padding: 2, borderRadius: 14, borderWidth: 1, borderColor: 'lightgrey' }}>
                        <MaterialCommunityIcons name="dice-d20" size={20} color="lightgrey" />
                    </View>
                    <Text style={styles.savingThrowsTitle}>Saving Throws</Text>
                </View>
                <View style={styles.savingThrowsGrid}>
                    {abilities.map((ability) => {
                        const modifier = Math.floor((ability.value - 10) / 2);

                        // Check if the class grants proficiency in this saving throw ability
                        const isProficient = statsData.class && classBonuses.find(c => c.value === statsData.class)?.savingThrowProficiency.includes(ability.name);
                        const savingThrow = isProficient ? modifier + proficiencyBonus : modifier;
                        return (
                            <View key={ability.id} style={[
                                styles.savingThrowSquare,
                                isProficient ? { backgroundColor: 'white' } : {}
                            ]}>
                                <Text style={[styles.savingThrowModifier, isProficient ? { color: 'black' } : {}]}>
                                    {savingThrow >= 0 ? `+${savingThrow}` : savingThrow}
                                </Text>
                                <Text style={[styles.savingThrowAbility, isProficient ? { color: 'black' } : {}]}>
                                    {ability.name.substring(0, 3)}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Ability Grid */}
            <View style={styles.characterStatsContainer}>
                <View style={styles.availableAbilityPointsContainer}>
                    <View style={styles.rowIconTitle}>
                        <MaterialCommunityIcons name="lightning-bolt" size={24} color="lightgrey" />
                        <Text style={styles.characterStatsTitle}>Abilities</Text>
                    </View>
                    {abilityAllocationsSaveVisible &&
                        <TouchableOpacity
                            onPress={() => {
                                saveAbilityAllocations()
                                setAbilityModalVisible(false)
                                setSelectedAbility(null)
                            }}
                            style={styles.abilitySaveButton}>
                            <Ionicons name="save" size={20} color="white" />
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    }
                    <View style={styles.availableAbilityPointsIconAndValue}>
                        {availableAbilityPoints > 0 &&
                            <Text style={{ color: 'white' }}>+</Text>
                        }
                        <Text style={styles.availableAbilityPoints}>
                            {availableAbilityPoints >= 0 ? availableAbilityPoints : 0}
                        </Text>
                        <MaterialCommunityIcons name="lightning-bolt" size={20} color={availableAbilityPoints > 0 ? 'gold' : 'lightgrey'} />
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
                {/* Ability Value Change Modal */}
                {selectedAbility && abilityModalVisible && (
                    <View style={styles.abilityModalContainer}>
                        <View style={[styles.modalSideBySide, { gap: 5, height: 60 }]}>
                            <TouchableOpacity
                                onPress={() => {
                                    setAbilityModalVisible(false)
                                    setSelectedAbility(null)
                                }}
                                style={{
                                    padding: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 40,
                                    paddingHorizontal: 10,
                                    marginHorizontal: 20,
                                }}
                            >
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButtonSubtract}
                                onPress={decrementAbility}
                            >
                                <Ionicons name="remove" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButtonAdd}
                                onPress={incrementAbility}
                            >
                                <Ionicons name="add" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* Skills */}
            <View style={styles.skillsContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={styles.rowIconTitle}>
                        <MaterialCommunityIcons name="bullseye-arrow" size={24} color="lightgrey" />
                        <Text style={styles.skillsTitle}>Skills</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                        {unusedSkillPoints > 0 && (
                            <>
                                <Text style={{ color: 'white' }}>+</Text>
                                <Text style={[styles.skillsTitle, { color: 'white', marginRight: 5 }]}>{unusedSkillPoints}</Text>
                                <Ionicons name="ribbon" size={20} color={unusedSkillPoints > 0 ? 'gold' : 'lightgrey'} />
                            </>
                        )}
                    </View>
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
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>XP: {xp}</Text>
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
                            <Button
                                title="Close"
                                color='black'
                                onPress={() => setModalVisible(false)}
                            />
                            <Button
                                title="Gain XP"
                                onPress={() => handleXpChange()}
                            />
                        </View>
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
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        {renderLevelModal()}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


        </View >
    );
};


export default CharacterStatsScreen;
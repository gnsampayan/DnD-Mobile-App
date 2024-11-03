import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ImageBackground,
    Modal,
    TouchableWithoutFeedback,
    Button,
    Alert,
    ImageSourcePropType,
    ScrollView,
} from 'react-native';
import styles from '@/app/styles/spellbookStyles';
import classData from '@/app/data/classData.json';
import StatsDataContext from '../context/StatsDataContext';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cantripsData from '@/app/data/cantrips.json';
import spellsData from '@/app/data/spells.json';

// Cantrip images
import acidSplashImage from '@images/cantrips/acid-splash.png';
import bladeWardImage from '@images/cantrips/blade-ward.png';
import boomingBladeImage from '@images/cantrips/booming-blade.png';
import chillTouchImage from '@images/cantrips/chill-touch.png';
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
import lightningLureImage from '@images/cantrips/lightning-lure.png';
import mageHandImage from '@images/cantrips/mage-hand.png';
import magicStoneImage from '@images/cantrips/magic-stone.png';
import mendingImage from '@images/cantrips/mending.png';
import messageImage from '@images/cantrips/message.png';
import mindSliverImage from '@images/cantrips/mind-sliver.png';
import minorIllusionImage from '@images/cantrips/minor-illusion.png';
import moldEarthImage from '@images/cantrips/mold-earth.png';
import poisonSprayImage from '@images/cantrips/poison-spray.png';
import prestidigitationImage from '@images/cantrips/prestidigitation.png';
import primalSavageryImage from '@images/cantrips/primal-savagery.png';
import produceFlameImage from '@images/cantrips/produce-flame.png';
import rayOfFrostImage from '@images/cantrips/ray-of-frost.png';
import resistanceImage from '@images/cantrips/resistance.png';
import sappingStingImage from '@images/cantrips/sapping-sting.png';
import shapeWaterImage from '@images/cantrips/shape-water.png';
import shillelaghImage from '@images/cantrips/shillelagh.png';
import shockingGraspImage from '@images/cantrips/shocking-grasp.png';
import spareTheDyingImage from '@images/cantrips/spare-the-dying.png';
import swordBurstImage from '@images/cantrips/sword-burst.png';
import thaumaturgyImage from '@images/cantrips/thaumaturgy.png';
import thornWhipImage from '@images/cantrips/thorn-whip.png';
import thunderclapImage from '@images/cantrips/thunderclap.png';
import tollTheDeadImage from '@images/cantrips/toll-the-dead.png';
import trueStrikeImage from '@images/cantrips/true-strike.png';
import viciousMockeryImage from '@images/cantrips/vicious-mockery.png';
import wordOfRadianceImage from '@images/cantrips/word-of-radiance.png';


import { Ionicons } from '@expo/vector-icons';
import { useActions } from '../context/actionsSpellsContext';
import { CantripSlotsContext } from '../context/cantripSlotsContext';


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
    'Lightning Lure': lightningLureImage,
    'Mage Hand': mageHandImage,
    'Magic Stone': magicStoneImage,
    'Mending': mendingImage,
    'Message': messageImage,
    'Mind Sliver': mindSliverImage,
    'Minor Illusion': minorIllusionImage,
    'Mold Earth': moldEarthImage,
    'Poison Spray': poisonSprayImage,
    'Prestidigitation': prestidigitationImage,
    'Primal Savagery': primalSavageryImage,
    'Produce Flame': produceFlameImage,
    'Ray of Frost': rayOfFrostImage,
    'Resistance': resistanceImage,
    'Sapping Sting': sappingStingImage,
    'Shape Water': shapeWaterImage,
    'Shillelagh': shillelaghImage,
    'Shocking Grasp': shockingGraspImage,
    'Spare the Dying': spareTheDyingImage,
    'Sword Burst': swordBurstImage,
    'Thaumaturgy': thaumaturgyImage,
    'Thorn Whip': thornWhipImage,
    'Thunderclap': thunderclapImage,
    'Toll the Dead': tollTheDeadImage,
    'True Strike': trueStrikeImage,
    'Vicious Mockery': viciousMockeryImage,
    'Word of Radiance': wordOfRadianceImage,
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

interface Spell {
    name: string;
    level: number;
    classes: string[];
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
    const [resetModalVisible, setResetModalVisible] = useState(false);
    const [cantripChoiceImage, setCantripChoiceImage] = useState<ImageSourcePropType | null>(null);
    const [spellModalVisible, setSpellModalVisible] = useState(false);
    const [spellChoiceInputValue, setSpellChoiceInputValue] = useState<string | null>(null);
    const [openSpellDropdown, setOpenSpellDropdown] = useState(false);

    // Key for AsyncStorage
    const KNOWN_SPELL_SLOTS_KEY = '@known_spell_slots';
    // Known Spell Slots
    const [knownSpellSlotsData, setKnownSpellSlotsData] = useState<Array<{ slotIndex: number, spellName: string | null }>>([]);
    const [spellPressedIndex, setSpellPressedIndex] = useState<number | null>(null);

    const { currentActionsAvailable, currentBonusActionsAvailable, setCurrentActionsAvailable, setCurrentBonusActionsAvailable } = useActions();


    const { statsData, isSpellCaster } = useContext(StatsDataContext);
    const { cantripSlotsData, setCantripSlotsData, saveCantripSlots } = useContext(CantripSlotsContext);

    // TODO: make this dynamic
    const spellLevelAccess = 1;

    const characterClass = classData.find(cls => cls.value.toLowerCase() === statsData?.class?.toLowerCase());

    useEffect(() => {
        getPreparedSpellSlotsAmount();
        getCantripSlotsAmount();
        getAllKnownSpellsSlotsAmount();
        loadCantripSlots();
    }, [isSpellCaster, statsData.level, statsData.abilities, statsData.class, statsData.race]);

    useEffect(() => {
        const initializeKnownSpellSlots = async () => {
            try {
                const storedKnownSpells = await AsyncStorage.getItem(KNOWN_SPELL_SLOTS_KEY);
                if (storedKnownSpells !== null) {
                    setKnownSpellSlotsData(JSON.parse(storedKnownSpells));
                } else {
                    // Initialize with empty slots based on `allKnownSpellsSlots`
                    const initialSlots = Array.from({ length: allKnownSpellsSlots || 0 }, (_, i) => ({
                        slotIndex: i,
                        spellName: null,
                    }));
                    setKnownSpellSlotsData(initialSlots);
                }
            } catch (error) {
                console.error('Failed to load known spell slots:', error);
            }
        };

        initializeKnownSpellSlots();
    }, [allKnownSpellsSlots]);

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

    const getCantripImage = (cantripName: string): ImageSourcePropType => {
        const image = cantripImages[cantripName as keyof typeof cantripImages] || null;
        if (typeof image === 'number') {
            return image; // Local image imported via require/import
        } else if (image) {
            return { uri: image }; // URI from file system or remote
        }
        return { uri: 'https://via.placeholder.com/150?text=&bg=EEEEEE' };
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

    const renderSpellBlock = ({ item }: { item: { slotIndex: number | string; spellName: string | null } }, section?: string) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setSpellPressedIndex(item.slotIndex as number);
                    setSpellModalVisible(true);
                }}
                style={section === "known-spells" ? { width: "100%", height: 40 } : [styles.addSpellButton, { width: itemWidth }]}
            >
                <ImageBackground
                    style={styles.spellButtonBackground}
                    resizeMode="cover"
                >
                    <View style={
                        [
                            styles.spellBlock,
                            {
                                position: 'relative',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: section === "known-spells" ? 'rgba(255,255,255,0.3)' : 'white',
                                paddingHorizontal: section === "known-spells" ? 10 : 0
                            }
                        ]}>
                        <Text style={{ color: 'white', position: 'absolute', top: 10, left: 10 }}>
                            {typeof item === 'number' ? item + 1 : ''}
                        </Text>
                        {item.spellName ? (
                            <Text style={{ color: 'white', textAlign: 'left', width: '100%' }}>{item.spellName}</Text>
                        ) : (
                            <Ionicons name="add" size={24} color="white" />
                        )}
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    const renderPreparedSpellBlocksForClass = () => {
        if (preparedSpellSlots !== null && preparedSpellSlots <= 0) {
            return (
                <View style={[styles.section, { paddingHorizontal: 10 }]}>
                    <Text style={styles.label}>Prepared Spells</Text>
                    <Text style={styles.text}>You can't use any spells yet.</Text>
                </View>
            );
        } else if (preparedSpellSlots === null) {
            return null;
        } else {
            return (
                <View style={styles.section}>
                    <Text style={[styles.label, { paddingHorizontal: 10 }]}>Prepared Spells</Text>
                    <FlatList
                        data={Array.from({ length: preparedSpellSlots || 0 }, (_, i) => ({
                            slotIndex: i,
                            spellName: null
                        }))}
                        renderItem={renderSpellBlock}
                        keyExtractor={(item) => item.slotIndex.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
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
                    <Text style={[styles.label, { paddingHorizontal: 10 }]}>Cantrips</Text>
                    <FlatList
                        data={Array.from({ length: cantripSlots || 0 }, (_, i) => i)}
                        renderItem={({ item }) => renderCantripBlock(item)}
                        keyExtractor={(item) => item.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
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
                );
            } else if (allKnownSpellsSlots === null) {
                return null;
            } else {
                // Prepare the data for the FlatList
                let data = knownSpellSlotsData;
                return (
                    <View style={styles.section}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                            <Text style={styles.label}>Known Spells</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    handleLearnMoreSpells();
                                }}
                            >
                                <Text style={{ color: '#586a9f', fontSize: 14 }}>Learn More Spells</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingHorizontal: 10, width: '100%' }}>
                            {data.map((item, index) => (
                                <View key={item.slotIndex.toString()}>
                                    {renderSpellBlock({ item }, "known-spells")}
                                    {index < data.length - 1 && <View style={{ height: 10 }} />}
                                </View>
                            ))}
                        </View>
                    </View>
                );
            }
        }
    };

    const renderCastableSpells = () => {
        if (allKnownSpellsSlots !== null && preparedSpellSlots === null) {
            if (allKnownSpellsSlots === 0 && allKnownSpellsSlots !== null) {
                return (
                    <View style={[styles.section, { paddingHorizontal: 10 }]}>
                        <Text style={styles.label}>Spells</Text>
                        <Text style={styles.text}>You can't cast any spells yet.</Text>
                    </View>
                )
            } else if (allKnownSpellsSlots === null) {
                return null;
            } else {
                return (
                    <View style={styles.section}>
                        <Text style={[styles.label, { paddingHorizontal: 10 }]}>Spells</Text>
                        <FlatList<{ slotIndex: number, spellName: string | null }>
                            data={Array.from({ length: allKnownSpellsSlots || 0 }, (_, i) => ({ slotIndex: i, spellName: null }))}
                            renderItem={({ item }) => renderSpellBlock({ item })}
                            keyExtractor={(item) => item.slotIndex.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
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
        return '';
    }

    const getDamageTypeFromCantrip = (cantripName: string): string => {
        const allCantrips = getAvailableCantrips(statsData.class || '');
        const selectedCantrip = allCantrips.find(cantrip => cantrip.name === cantripName);
        return selectedCantrip?.damageType || '';
    }


    const renderCantripChoicesBasedOnLevel = () => {
        const availableCantrips = getAvailableCantrips(statsData.class || '');
        const unusedCantrips = availableCantrips.filter(cantrip => !cantripSlotsData.includes(cantrip.name));
        const handleCantripPreview = (cantrip: {
            name: string;
            description: string;
            features?: string | object[];
            damage?: string;
        }) => {
            setCantripChoiceValue(cantrip.name);
            setCantripChoiceDescription(cantrip.description || '');
            const imageSource = getCantripImage(cantrip.name);
            setCantripChoiceImage(imageSource);
        }

        const getSavingThrowFromCantrip = (cantripName: string): string => {
            const allCantrips = getAvailableCantrips(statsData.class || '');
            const selectedCantrip = allCantrips.find(cantrip => cantrip.name === cantripName);
            return selectedCantrip?.savingThrow || '';
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
                <ScrollView
                    style={{ flex: 1, marginBottom: 80, borderRadius: 8, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    contentContainerStyle={{ padding: 10 }}
                    showsVerticalScrollIndicator={true}
                >
                    {features.map((feature, index) => {
                        // Ensure description is a string
                        const description =
                            typeof feature.description === 'string'
                                ? feature.description
                                : JSON.stringify(feature.description);

                        return (
                            <View key={index}>
                                <Text style={[styles.cantripLabel, { color: '#586a9f' }]}>
                                    {feature.label}
                                </Text>
                                <Text style={{ fontSize: 14, marginBottom: 10 }}>
                                    {description}
                                </Text>
                            </View>
                        );
                    })}
                </ScrollView>
            );
        };

        return (
            <View style={{ flex: 1 }}>
                {/* Ensure the cantrip slot is selected */}
                {cantripPressedIndex !== null && (
                    <>
                        {/* Show this when the cantrip slot is empty */}
                        {(cantripSlotsData[cantripPressedIndex] === '' ||
                            cantripSlotsData[cantripPressedIndex] === null) && (
                                <View style={{ flex: 1 }}>
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
                                    {cantripChoiceValue && (
                                        <View style={{ flex: 1 }}>
                                            {/* School */}
                                            {cantripsData.find(cantrip =>
                                                cantrip.name === cantripChoiceValue
                                            )?.school && (
                                                    <View style={{ marginBottom: 10 }}>
                                                        <Text style={styles.cantripLabel}>School:</Text>
                                                        <Text>{cantripsData.find(cantrip =>
                                                            cantrip.name === cantripChoiceValue
                                                        )?.school}</Text>
                                                    </View>
                                                )}
                                            {/* Duration */}
                                            {cantripsData.find(cantrip =>
                                                cantrip.name === cantripChoiceValue
                                            )?.duration && (
                                                    <View style={{ marginBottom: 10 }}>
                                                        <Text style={styles.cantripLabel}>Duration:</Text>
                                                        <Text>{cantripsData.find(cantrip =>
                                                            cantrip.name === cantripChoiceValue
                                                        )?.duration}</Text>
                                                    </View>
                                                )}
                                            {/* Saving Throw */}
                                            {getSavingThrowFromCantrip(cantripChoiceValue) && (
                                                <View style={{ marginBottom: 10 }}>
                                                    <Text style={styles.cantripLabel}>Saving Throw:</Text>
                                                    <Text>{getSavingThrowFromCantrip(cantripChoiceValue)}</Text>
                                                </View>
                                            )}
                                            {/* Damage */}
                                            {getDamageFromCantrip(cantripChoiceValue) && (
                                                <View style={{ marginBottom: 10 }}>
                                                    <Text style={styles.cantripLabel}>Damage:</Text>
                                                    <Text>{getDamageFromCantrip(cantripChoiceValue)}</Text>
                                                </View>
                                            )}
                                            {/* Damage Type */}
                                            {getDamageTypeFromCantrip(cantripChoiceValue) && (
                                                <View style={{ marginBottom: 10 }}>
                                                    <Text style={styles.cantripLabel}>Damage Type:</Text>
                                                    <Text>{getDamageTypeFromCantrip(cantripChoiceValue)}</Text>
                                                </View>
                                            )}
                                            {/* Description */}
                                            <View style={{ marginBottom: 10 }}>
                                                <Text style={styles.cantripLabel}>Description:</Text>
                                                <Text>{cantripChoiceDescription}</Text>
                                            </View>
                                            {/* Features */}
                                            {unusedCantrips.find(
                                                cantrip => cantrip.name === cantripChoiceValue
                                            )?.features && (
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontStyle: 'italic', marginBottom: 2, color: '#5b5b5b' }}>Features:</Text>
                                                        {renderFeatures(
                                                            unusedCantrips.find(
                                                                cantrip => cantrip.name === cantripChoiceValue
                                                            )?.features
                                                        )}
                                                    </View>
                                                )}
                                        </View>
                                    )}
                                </View>
                            )}
                        {/* Show this when the cantrip slot is NOT empty */}
                        {cantripSlotsData[cantripPressedIndex] !== '' &&
                            cantripSlotsData[cantripPressedIndex] !== null && (
                                <View style={{ flex: 1 }}>
                                    {/* School */}
                                    {cantripsData.find(cantrip =>
                                        cantrip.name === cantripSlotsData[cantripPressedIndex]
                                    )?.school && (
                                            <View style={{ marginBottom: 10 }}>
                                                <Text style={styles.cantripLabel}>School:</Text>
                                                <Text>
                                                    {cantripsData.find(cantrip =>
                                                        cantrip.name === cantripSlotsData[cantripPressedIndex]
                                                    )?.school}
                                                </Text>
                                            </View>
                                        )}
                                    {/* Duration */}
                                    {cantripsData.find(cantrip =>
                                        cantrip.name === cantripSlotsData[cantripPressedIndex]
                                    )?.duration && (
                                            <View style={{ marginBottom: 10 }}>
                                                <Text style={styles.cantripLabel}>Duration:</Text>
                                                <Text>
                                                    {cantripsData.find(cantrip =>
                                                        cantrip.name === cantripSlotsData[cantripPressedIndex]
                                                    )?.duration}
                                                </Text>
                                            </View>
                                        )}
                                    {/* Damage */}
                                    {getDamageFromCantrip(cantripSlotsData[cantripPressedIndex]) && (
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={styles.cantripLabel}>Damage:</Text>
                                            <Text>
                                                {getDamageFromCantrip(
                                                    cantripSlotsData[cantripPressedIndex]
                                                )?.toString()}
                                            </Text>
                                        </View>
                                    )}
                                    {getSavingThrowFromCantrip(cantripSlotsData[cantripPressedIndex]) && (
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={styles.cantripLabel}>Saving Throw:</Text>
                                            <Text>
                                                {getSavingThrowFromCantrip(
                                                    cantripSlotsData[cantripPressedIndex]
                                                )?.toString()}
                                            </Text>
                                        </View>
                                    )}
                                    {/* Damage Type */}
                                    {getDamageTypeFromCantrip(cantripSlotsData[cantripPressedIndex]) && (
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={styles.cantripLabel}>Damage Type:</Text>
                                            <Text>
                                                {getDamageTypeFromCantrip(cantripSlotsData[cantripPressedIndex])}
                                            </Text>
                                        </View>
                                    )}
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={styles.cantripLabel}>Description:</Text>
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
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontStyle: 'italic', marginBottom: 2, color: '#5b5b5b' }}>Features:</Text>
                                                {renderFeatures(
                                                    availableCantrips.find(
                                                        (cantrip) =>
                                                            cantrip.name === cantripSlotsData[cantripPressedIndex]
                                                    )?.features
                                                )}
                                            </View>
                                        )}
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

    const resetSpellbook = async () => {
        try {
            // Reset cantrip slots to an array of nulls
            const resetCantripSlots = Array(cantripSlots).fill(null).map(() => null);
            setCantripSlotsData(resetCantripSlots);
            await AsyncStorage.setItem(CANTRIP_SLOTS_KEY, JSON.stringify(resetCantripSlots));
            const resetKnownSpells = Array(allKnownSpellsSlots).fill(0).map((_, index) => ({
                slotIndex: index,
                spellName: null
            }));
            setKnownSpellSlotsData(resetKnownSpells);
            await AsyncStorage.setItem(KNOWN_SPELL_SLOTS_KEY, JSON.stringify(resetKnownSpells));

            // Close reset confirmation modal
            setResetModalVisible(false);
        } catch (error) {
            console.error('Failed to reset spellbook:', error);
        }
    };

    const renderSpellSaveDC = () => {
        const classInfo = classData.find(
            (cls) => cls.value.toLowerCase() === statsData?.class?.toLowerCase()
        );

        // Get the primary ability for the class
        const primaryAbility = classInfo?.primaryAbility || '';
        // Calculate the spellcasting ability modifier
        const spellcastingModifier = getAbilityModifier(primaryAbility.toString());
        return (
            <View style={[styles.headerTextContainer, { paddingHorizontal: 10 }]}>
                <Text style={styles.headerText}>spellsave DC:</Text>
                <View style={styles.headerTextBox}>
                    <Text style={styles.headerText}>{8 + statsData.proficiencyBonus + spellcastingModifier}</Text>
                </View>
            </View>
        );
    }

    const assignSpellToSlot = () => {
        if (spellPressedIndex === null || !spellChoiceInputValue) {
            Alert.alert('Empty Slot', 'Please select a spell and try again.');
            return;
        }

        const updatedKnownSpells = [...knownSpellSlotsData];
        const slotIndex = updatedKnownSpells.findIndex(
            (slot) => slot.slotIndex === spellPressedIndex
        );

        if (slotIndex !== -1) {
            updatedKnownSpells[slotIndex].spellName = spellChoiceInputValue;
            setKnownSpellSlotsData(updatedKnownSpells);
            saveKnownSpellSlots(updatedKnownSpells);
        }

        // Reset modal states
        setSpellModalVisible(false);
        setSpellChoiceInputValue(null);
        setSpellPressedIndex(null);
    };

    const saveKnownSpellSlots = async (slotsData: typeof knownSpellSlotsData) => {
        try {
            await AsyncStorage.setItem(KNOWN_SPELL_SLOTS_KEY, JSON.stringify(slotsData));
            console.log("Saved known spell slots:", slotsData);
        } catch (error) {
            console.error('Failed to save known spell slots:', error);
        }
    };
    const cleanSpellList = spellsData
        .filter(
            (spellLevel) =>
                spellLevel.level <= spellLevelAccess
        )
        .flatMap((spellLevel) =>
            spellLevel.spells.map((spell) => ({
                label: typeof spell === 'object' ? spell.id : spell,
                value: typeof spell === 'object' ? spell.id : spell,
            }))
        );

    const renderSpellChoices = () => {
        // Don't show dropdown if spell slot already has a spell assigned
        if (spellPressedIndex !== null && knownSpellSlotsData[spellPressedIndex]?.spellName) {
            return null;
        }
        return <DropDownPicker
            open={openSpellDropdown}
            setOpen={setOpenSpellDropdown}
            value={spellChoiceInputValue}
            setValue={setSpellChoiceInputValue}
            items={cleanSpellList}
            multiple={false}
            containerStyle={{ height: 40, marginBottom: 20 }}
            style={{ backgroundColor: 'white', borderRadius: 8 }}
            dropDownContainerStyle={{ backgroundColor: 'white', borderRadius: 8 }}
        />
    }

    const renderSpellContent = () => {
        // Get spell name either from input or from saved slot
        const spellNameToRender = spellChoiceInputValue ||
            (spellPressedIndex !== null && knownSpellSlotsData[spellPressedIndex]?.spellName);

        if (!spellNameToRender) return null;

        return spellsData.map(level => {
            const spell = level.spells.find(s =>
                typeof s === 'object' && s.id === spellNameToRender
            );

            if (spell && typeof spell === 'object') {
                return (
                    <View key={spell.id}>
                        {/* Basic spell info */}
                        {spell.id && (
                            <Text style={{ fontSize: 26 }}>{spell.id}</Text>
                        )}
                        {spell.school && (
                            <View>
                                <Text>School:</Text>
                                <Text>{spell.school}</Text>
                            </View>
                        )}
                        {spell.castingTime && (
                            <View>
                                <Text>Casting Time:</Text>
                                <Text>{spell.castingTime}</Text>
                            </View>
                        )}
                        {spell.range && (
                            <View>
                                <Text>Range:</Text>
                                <Text>{spell.range}</Text>
                            </View>
                        )}
                        {spell.components && (
                            <View>
                                <Text>Components:</Text>
                                <Text>{spell.components.join(', ')}</Text>
                            </View>
                        )}
                        {spell.duration && (
                            <View>
                                <Text>Duration:</Text>
                                <Text>{spell.duration}</Text>
                            </View>
                        )}

                        {/* Description */}
                        {spell.description && (
                            <View>
                                <Text>{spell.description}</Text>
                            </View>
                        )}

                        {/* Features */}
                        {spell.features && typeof spell.features === 'object' && (
                            <View>
                                <Text>Features:</Text>
                                {Object.entries(spell.features).map(([key, value]) => (
                                    <View key={key}>
                                        <Text>{key}:</Text>
                                        <Text>{value}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                    </View>
                );
            }
            return null;
        })
    }

    const handleLearnMoreSpells = () => {
        // Increase the number of known spell slots by 1
        if (allKnownSpellsSlots !== null) {
            const newSlotIndex = allKnownSpellsSlots;
            const updatedAllKnownSpellsSlots = allKnownSpellsSlots + 1;
            setAllKnownSpellsSlots(updatedAllKnownSpellsSlots);

            // Update the knownSpellSlotsData with a new slot
            const updatedKnownSpells = [
                ...knownSpellSlotsData,
                { slotIndex: newSlotIndex, spellName: null },
            ];
            setKnownSpellSlotsData(updatedKnownSpells);

            // Persist the updated data
            saveKnownSpellSlots(updatedKnownSpells);
        }
    };

    // Main Spellbook Render
    return (
        <>

            <View style={styles.container}>


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
                        {renderSpellSaveDC()}
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


                <ScrollView style={{ flex: 1 }}>
                    <Text style={[styles.title, { paddingHorizontal: 10 }]}>{statsData.class} Spellbook</Text>
                    <View style={{ flex: 1 }}>
                        {renderPreparedSpellBlocksForClass()}
                        {renderCantripBlocks()}
                        {renderAllKnownSpells()}
                        {/* For Bards, Rangers, Sorcerers, and Warlocks */}
                        {renderCastableSpells()}
                    </View>
                </ScrollView>

            </View>

            {/* Cantrip Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={cantripModalVisible}
            >
                <View style={styles.cantripModal}>
                    <View style={styles.cantripModalContent}>
                        {(cantripChoiceValue || (cantripPressedIndex !== null && cantripSlotsData[cantripPressedIndex])) && (
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                {/* Image of the cantrip */}
                                <ImageBackground
                                    source={
                                        cantripPressedIndex !== null
                                            && cantripSlotsData[cantripPressedIndex]
                                            ? getCantripImage(cantripSlotsData[cantripPressedIndex]) as ImageSourcePropType
                                            : cantripChoiceImage || undefined
                                    }
                                    style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 8, overflow: 'hidden' }}
                                    resizeMode="cover"
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.title, { color: 'black' }]}>
                                        {cantripChoiceValue || (cantripPressedIndex !== null ? cantripSlotsData[cantripPressedIndex] : '')}
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                        <Text style={[styles.cantripLabel, { marginBottom: 0 }]}>Casting Time:</Text>
                                        <Text>
                                            {(() => {
                                                const castingTime = cantripsData.find(cantrip =>
                                                    cantrip.name === (cantripChoiceValue || (cantripPressedIndex !== null ? cantripSlotsData[cantripPressedIndex] : ''))
                                                )?.castingTime?.toLowerCase();

                                                if (castingTime === "1 action") {
                                                    return <Ionicons name="ellipse" size={16} color="green" />;
                                                } else if (castingTime === "1 bonus action") {
                                                    return <Ionicons name="triangle" size={16} color="#FF8C00" />;
                                                } else {
                                                    return castingTime;
                                                }
                                            })()}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                        <Text style={[styles.cantripLabel, { marginBottom: 0 }]}>Range:</Text>
                                        <Text>
                                            {cantripsData.find(cantrip =>
                                                cantrip.name === (cantripChoiceValue || (cantripPressedIndex !== null ? cantripSlotsData[cantripPressedIndex] : ''))
                                            )?.range}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                        <Text style={[styles.cantripLabel, { marginBottom: 0 }]}>Components:</Text>
                                        <Text>
                                            {(() => {
                                                const components = cantripsData.find(cantrip =>
                                                    cantrip.name === (cantripChoiceValue || (cantripPressedIndex !== null ? cantripSlotsData[cantripPressedIndex] : ''))
                                                )?.components;
                                                return Array.isArray(components) ? components.join(', ') : components;
                                            })()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        <View style={{ flex: 1 }}>
                            {renderCantripChoicesBasedOnLevel()}
                        </View>
                    </View>
                    {/* Buttons */}
                    <View style={styles.cantripModalButtonsContainer}>
                        <TouchableWithoutFeedback onPress={() => setCantripModalVisible(false)}>
                            <Text style={{ color: 'black' }}>Close</Text>
                        </TouchableWithoutFeedback>
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
                    </View>
                </View>
            </Modal>


            {/* Spell Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={spellModalVisible}
            >
                <View style={styles.spellModal}>
                    <View style={{ flex: 1 }}>
                        {renderSpellChoices()}
                        <ScrollView style={{ flex: 1 }}>
                            {renderSpellContent()}
                        </ScrollView>
                    </View>
                    <View style={styles.spellModalButtonsContainer}>
                        <Button
                            title="Close"
                            color="black"
                            onPress={() => {
                                setSpellModalVisible(false);
                                setSpellChoiceInputValue(null);
                            }}
                        />
                        <Button
                            title="Assign"
                            color="green"
                            disabled={spellChoiceInputValue === null}
                            onPress={() => {
                                assignSpellToSlot();
                                setSpellModalVisible(false);
                            }}
                        />
                    </View>
                </View>

            </Modal>


            {/* Reset Modal */}
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
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
import emptyImage from '@images/cantrips/empty-image.png';

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


import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useActions } from '../context/actionsSpellsContext';
import { CantripSlotsContext } from '../context/cantripSlotsContext';

// Wizard spell level data
import wizardTableData from '@/app/data/class-tables/wizardTable.json';
import warlockTableData from '@/app/data/class-tables/warlockTable.json';
import sorcererTableData from '@/app/data/class-tables/sorcererTable.json';
import artificerTableData from '@/app/data/class-tables/artificerTable.json';
import bardTableData from '@/app/data/class-tables/bardTable.json';
import clericTableData from '@/app/data/class-tables/clericTable.json';
import druidTableData from '@/app/data/class-tables/druidTable.json';
import rangerTableData from '@/app/data/class-tables/rangerTable.json';
import paladinTableData from '@/app/data/class-tables/paladinTable.json';


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
    reaction: number;
}

interface Feature {
    label: string;
    description: string;
}

interface SpellSlot {
    slotIndex: number;
    spellName: string | null;
}

interface Spell {
    name: string;
    castingTime: string;
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
    const [preparedSpellModalVisible, setPreparedSpellModalVisible] = useState(false);


    // Key for AsyncStorage
    const KNOWN_SPELL_SLOTS_KEY = '@known_spell_slots';
    const PREPARED_SPELL_SLOTS_KEY = '@prepared_spell_slots';

    const [spellSlotsData, setSpellSlotsData] = useState<SpellSlot[]>([]);

    // Known Spell Slots
    const [knownSpellSlotsData, setKnownSpellSlotsData] = useState<Array<{ slotIndex: number, spellName: string | null }>>([]);
    const [spellPressedIndex, setSpellPressedIndex] = useState<number | null>(null);

    // Prepared Spell
    const [openPreparedSpellDropdown, setOpenPreparedSpellDropdown] = useState(false);
    const [preparedSpellChoiceInputValue, setPreparedSpellChoiceInputValue] = useState<string | null>(null);
    // Prepared Spell Slots Data for when slots are assigned
    const [preparedSpellSlotsData, setPreparedSpellSlotsData] = useState<
        { slotIndex: number; spellName: string | null }[]
    >([]);

    const {
        currentActionsAvailable,
        currentBonusActionsAvailable,
        currentReactionsAvailable,
        setCurrentActionsAvailable,
        setCurrentBonusActionsAvailable,
        setCurrentReactionsAvailable,
        spentSpellSlots,
        setSpentSpellSlots
    } = useActions();


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

        if (allKnownSpellsSlots !== null) {
            updateSpellSlotsData(allKnownSpellsSlots);
        }
    }, [isSpellCaster, statsData.level, statsData.abilities, statsData.class, statsData.race]);

    useEffect(() => {
        getAllKnownSpellsSlotsAmount();
        if (allKnownSpellsSlots !== null) {
            updateSpellSlotsData(allKnownSpellsSlots);
        }
    }, [allKnownSpellsSlots]);

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

    // Initialize or update preparedSpellSlotsData when preparedSpellSlots changes
    useEffect(() => {
        if (preparedSpellSlots !== null) {
            setPreparedSpellSlotsData((prevData) => {
                const currentSlotsCount = prevData.length;
                if (preparedSpellSlots > currentSlotsCount) {
                    // Add new slots without clearing existing ones
                    const newSlots = Array.from(
                        { length: preparedSpellSlots - currentSlotsCount },
                        (_, i) => ({
                            slotIndex: currentSlotsCount + i,
                            spellName: null,
                        })
                    );
                    return [...prevData, ...newSlots];
                } else if (preparedSpellSlots < currentSlotsCount) {
                    // Remove extra slots but keep existing ones up to the new count
                    return prevData.slice(0, preparedSpellSlots);
                } else {
                    // No change in slots
                    return prevData;
                }
            });
        }
    }, [preparedSpellSlots]);

    // Save prepared spells when they change
    useEffect(() => {
        const savePreparedSpells = async () => {
            try {
                await AsyncStorage.setItem(
                    PREPARED_SPELL_SLOTS_KEY,
                    JSON.stringify(preparedSpellSlotsData)
                );
            } catch (error) {
                console.error('Failed to save prepared spell slots:', error);
            }
        };

        // Only save if `preparedSpellSlotsData` is not null or empty
        if (preparedSpellSlotsData && preparedSpellSlotsData.length > 0) {
            savePreparedSpells();
        }
    }, [preparedSpellSlotsData]);

    // Load prepared spells when the component mounts
    useEffect(() => {
        const loadPreparedSpells = async () => {
            try {
                const savedData = await AsyncStorage.getItem(PREPARED_SPELL_SLOTS_KEY);
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    if (parsedData && parsedData.length > 0) {
                        setPreparedSpellSlotsData(parsedData);
                    }
                }
            } catch (error) {
                console.error('Failed to load prepared spells:', error);
            }
        };

        loadPreparedSpells();
    }, []);

    // Function to update spellSlotsData based on the new number of slots
    const updateSpellSlotsData = (newSlotCount: number) => {
        setSpellSlotsData((prevData) => {
            const currentSlotCount = prevData.length;
            if (newSlotCount > currentSlotCount) {
                // Add new slots
                const newSlots = Array.from(
                    { length: newSlotCount - currentSlotCount },
                    (_, i) => ({
                        slotIndex: currentSlotCount + i,
                        spellName: null,
                    })
                );
                return [...prevData, ...newSlots];
            } else if (newSlotCount < currentSlotCount) {
                // Remove extra slots
                return prevData.slice(0, newSlotCount);
            } else {
                // No change in slots
                return prevData;
            }
        });
    };

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
        const abilityValue = statsData?.abilities?.find(ability => ability?.name?.toLowerCase() === abilityName?.toLowerCase());
        return abilityValue ? Math.floor((abilityValue?.value - 10) / 2) : 0;
    }

    const numColumns = 3;
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = (windowWidth - (30 + (numColumns - 1) * 10)) / numColumns;

    const renderSpellBlock = ({ item }: { item: { slotIndex: number | string; spellName: string | null } }, section?: string) => {
        // Get the spell name based on the section type
        let displaySpellName = item.spellName;
        if (section === "prepared-spells" && preparedSpellSlotsData) {
            const preparedSpell = preparedSpellSlotsData.find(slot => slot.slotIndex === item.slotIndex);
            if (preparedSpell) {
                displaySpellName = preparedSpell.spellName;
            }
        } else if (section === "castable-spells") {
            const castableSpell = knownSpellSlotsData.find(slot => slot.slotIndex === item.slotIndex);
            if (castableSpell) {
                displaySpellName = castableSpell.spellName;
            }
        }
        const affordable = canAffordSpell(displaySpellName || null);
        return (
            <TouchableOpacity
                onPress={() => {
                    setSpellPressedIndex(item.slotIndex as number);
                    if (section === "known-spells" || section === "castable-spells") {
                        setSpellModalVisible(true);
                    } else if (section === "prepared-spells") {
                        setPreparedSpellModalVisible(true);
                        setPreparedSpellChoiceInputValue(displaySpellName || null);
                        setOpenPreparedSpellDropdown(false);
                    }
                }}
                style={
                    section === "known-spells" ? { width: "100%", height: 40 } :
                        [styles.addSpellButton, { width: itemWidth }]
                }
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
                                borderColor: section === "known-spells"
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : (affordable ? 'white'
                                        : 'rgba(255, 255, 255, 0.1)'),
                                paddingHorizontal: 10
                            }
                        ]}>
                        {displaySpellName ? (
                            <Text style={{ color: 'white' }}>{displaySpellName}</Text>
                        ) : (
                            <>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ color: 'white' }}>+</Text>
                                    <MaterialCommunityIcons name="auto-fix" size={20} color="white" />
                                </View>
                            </>
                        )}
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    const renderPreparedSpellBlocksForClass = () => {
        if (preparedSpellSlots !== null && preparedSpellSlots <= 0) {
            return (
                <View style={[styles.section, {
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: '#ffffff1a',
                    borderRadius: 8,
                    padding: 10,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }]}>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        Spells Unavailable
                    </Text>
                    <Text style={{ color: 'white', fontSize: 12 }}>
                        Level up or increase spellcasting ability
                    </Text>
                </View>
            );
        } else if (preparedSpellSlots === null) {
            return null;
        } else {
            return (
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 10, marginBottom: 5 }}>
                        <MaterialCommunityIcons name="book-check" size={24} color="lightgrey" />
                        <Text style={styles.label}>
                            Prepared Spells
                        </Text>
                    </View>
                    <FlatList
                        style={{ marginLeft: 10 }}
                        contentContainerStyle={{ gap: 10 }}
                        data={Array.from({ length: preparedSpellSlots || 0 }, (_, i) => ({
                            slotIndex: i,
                            spellName: null
                        }))}
                        renderItem={({ item }) => renderSpellBlock({ item }, "prepared-spells")}
                        keyExtractor={(item) => item.slotIndex.toString()}
                        horizontal={statsData.class === 'wizard'}
                        showsHorizontalScrollIndicator={false}
                        numColumns={statsData.class === 'wizard' ? 1 : 3}
                        key={statsData.class === 'wizard' ? 'wizard' : 'other'}
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
        // Use index directly from parameter to access correct slot
        const canAfford = canAffordCantrip(cantripSlotsData[index] || '');
        const isEmpty = !cantripSlotsData[index];
        const darken = !isEmpty && !canAfford;

        return (
            <TouchableOpacity
                style={[styles.addCantripButton, { width: itemWidth, opacity: darken ? 0.5 : 1 }]}
                onPress={() => handleCantripPress(index)}
                disabled={darken}
            >
                <ImageBackground
                    style={styles.cantripButtonBackground}
                    source={cantripSlotsData[index]
                        ? getCantripImage(cantripSlotsData[index]) as ImageSourcePropType
                        : emptyImage as ImageSourcePropType}
                    resizeMode="cover"
                >
                    <View style={styles.cantripBlock}>
                        {cantripSlotsData[index] ? (
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                {getCantripImage(cantripSlotsData[index]) ? '' : cantripSlotsData[index]}
                            </Text>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                <Text style={{ color: 'white' }}>+</Text>
                                <MaterialCommunityIcons name="shimmer" size={20} color="white" />
                            </View>
                        )}
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    const renderCantripBlocks = () => {
        if (!cantripSlots) {
            return null;
        }

        return (
            <View style={styles.section}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 10, marginBottom: 5 }}>
                    <MaterialCommunityIcons name="shimmer" size={24} color="lightgrey" />
                    <Text style={styles.label}>
                        Cantrips
                    </Text>
                </View>
                <FlatList
                    style={{ marginLeft: 10 }}
                    data={Array.from({ length: cantripSlots }, (_, i) => i)}
                    renderItem={({ item: index }) => renderCantripBlock(index)}
                    keyExtractor={(index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
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

    const handleIncrement = () => {
        Alert.alert('Learn Spells', 'Learning a spell will cost you 2 hours and 50gp and must be learned from another wizard or a scroll.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: '+1 Spell', onPress: () => {
                    handleLearnMoreSpells(1);
                },
                style: 'default'
            }
        ]);
    }

    const renderAllKnownSpells = () => {
        if (allKnownSpellsSlots !== null && preparedSpellSlots === null) {
            return null;
        } else {
            if (allKnownSpellsSlots === 0 && allKnownSpellsSlots !== null) {
                return (
                    <View style={styles.section}>
                        <Text style={styles.label}>Spellbook</Text>
                        <Text style={styles.text}>You can't learn any spells yet.</Text>
                    </View>
                );
            } else if (allKnownSpellsSlots === null) {
                return null;
            } else {
                // Prepare the data for the FlatList
                let data = knownSpellSlotsData;
                return (
                    <View style={[styles.section, { flex: 1 }]}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 10,
                            marginBottom: 5
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <MaterialCommunityIcons name="book" size={24} color="lightgrey" />
                                <Text style={styles.label}>
                                    Spellbook
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    handleIncrement();
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderWidth: 1,
                                    borderColor: 'white',
                                    borderRadius: 8
                                }}
                            >
                                <Text style={{ color: 'white' }}>+</Text>
                                <MaterialCommunityIcons name="book-education" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ paddingHorizontal: 10, flex: 1, marginBottom: 40 }}>
                            {data.map((item, index) => (
                                <View key={item.slotIndex.toString()}>
                                    {renderSpellBlock({ item }, "known-spells")}
                                    {index < data.length - 1 && <View style={{ height: 10 }} />}
                                </View>
                            ))}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 15
                            }}>

                            </View>
                        </ScrollView>
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
                    <View style={[styles.section, { flex: 1, marginBottom: 50 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 10, marginBottom: 5 }}>
                            <MaterialCommunityIcons name="auto-fix" size={24} color="lightgrey" />
                            <Text style={styles.label}>
                                Spells
                            </Text>
                        </View>
                        <FlatList<{ slotIndex: number, spellName: string | null }>
                            style={{ paddingHorizontal: 10, flex: 1 }}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            data={Array.from({ length: allKnownSpellsSlots || 0 }, (_, i) => ({ slotIndex: i, spellName: null }))}
                            renderItem={({ item }) => renderSpellBlock({ item }, "castable-spells")}
                            keyExtractor={(item) => item.slotIndex.toString()}
                            numColumns={3}
                            extraData={allKnownSpellsSlots}
                        />
                    </View>
                )
            }
        } else {
            return null;
        }
    }

    const getAvailableCantrips = (currentClass: string): Cantrip[] => {
        if (!currentClass) return [];
        return cantripsData.filter(cantrip =>
            cantrip.classes?.map(cls => cls?.toLowerCase()).includes(currentClass?.toLowerCase())
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
                    featuresData.forEach((item: any) => {
                        normalizedFeatures.push({
                            label: item.effect || 'Feature',
                            description: item.details || '',
                        });
                    });
                } else {
                    featuresData.forEach((item: string, index: number) => {
                        normalizedFeatures.push({
                            label: `Feature ${index + 1}`,
                            description: item,
                        });
                    });
                }
            } else if (typeof featuresData === 'object' && featuresData !== null) {
                Object.keys(featuresData).forEach((key) => {
                    const value = featuresData[key];
                    if (typeof value === 'string') {
                        normalizedFeatures.push({
                            label: key.toString(),
                            description: value.toString(),
                        });
                    } else if (typeof value === 'object' && value !== null) {
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
                {cantripPressedIndex !== null && (
                    <>
                        {(!cantripSlotsData[cantripPressedIndex]) && (
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
                        {cantripSlotsData[cantripPressedIndex] && (
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
        let reactionCost = 0;

        if (castingTime.toLowerCase().includes("1 bonus action")) {
            bonusActionCost = 1;
        }
        if (castingTime.toLowerCase().includes("1 action")) {
            actionCost = 1;
        }
        if (castingTime.toLowerCase().includes("1 reaction")) {
            reactionCost = 1;
        }

        return { action: actionCost, bonusAction: bonusActionCost, reaction: reactionCost };
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
            // Get fresh known spell slots amount
            getAllKnownSpellsSlotsAmount();

            // Reset known spells with updated amount
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
            (cls) => cls?.value?.toLowerCase() === statsData?.class?.toLowerCase()
        );

        // Get the primary abilities for the class
        const primaryAbilities = classInfo?.primaryAbility || [];

        // Find appropriate spellcasting ability, avoiding STR/DEX/CON
        let spellcastingAbility = '';
        if (Array.isArray(primaryAbilities)) {
            spellcastingAbility = primaryAbilities.find(ability =>
                !['Strength', 'Dexterity', 'Constitution'].includes(ability)
            ) || primaryAbilities[primaryAbilities.length - 1];
        } else {
            spellcastingAbility = primaryAbilities;
        }

        // Calculate the spellcasting ability modifier
        const spellcastingModifier = getAbilityModifier(spellcastingAbility);

        return (
            <View style={[styles.headerTextContainer, { paddingHorizontal: 10 }]}>
                <View style={[styles.headerTextBox, {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    paddingVertical: 0,
                    backgroundColor: 'transparent'
                }]}>
                    <Text style={[styles.headerText, { fontSize: 16 }]}>{8 + statsData.proficiencyBonus + spellcastingModifier}</Text>
                    <MaterialCommunityIcons name="skull-scan" size={16} color="lightgrey" />
                </View>
            </View>
        );
    }

    const assignSpellToSlot = () => {
        if (spellPressedIndex === null || !spellChoiceInputValue) {
            Alert.alert('Empty Slot', 'Please select a spell and try again.');
            return;
        }

        // Ensure we have enough slots for the current spellPressedIndex
        const requiredSlots = spellPressedIndex + 1;
        let updatedKnownSpells = [...knownSpellSlotsData];

        // Add new slots if needed
        if (requiredSlots > updatedKnownSpells.length) {
            const newSlots = Array(requiredSlots - updatedKnownSpells.length)
                .fill(0)
                .map((_, index) => ({
                    slotIndex: updatedKnownSpells.length + index,
                    spellName: null
                }));
            updatedKnownSpells = [...updatedKnownSpells, ...newSlots];
        }

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
        // Don't show dropdown if selected slot already has a spell
        if (spellPressedIndex !== null && knownSpellSlotsData[spellPressedIndex]?.spellName) {
            return null;
        }

        // Get the list of assigned spells, excluding the current slot being edited
        const assignedSpells = knownSpellSlotsData
            .filter(
                slot => slot.spellName !== null && slot.slotIndex !== spellPressedIndex
            )
            .map(slot => slot.spellName!.toLowerCase());

        // Prepare the list of available spells, excluding assigned ones and filtering by class
        const availableSpells = spellsData
            .filter(spellLevel => spellLevel.level <= spellLevelAccess)
            .flatMap(spellLevel =>
                spellLevel.spells.filter(spellItem => {
                    const spellName = typeof spellItem === 'string' ? spellItem : spellItem.name;
                    const spellClasses = typeof spellItem === 'object' ? spellItem.classes?.map(c => c.toLowerCase()) : [];
                    return !assignedSpells.includes(spellName.toLowerCase()) &&
                        (typeof spellItem === 'string' || spellClasses?.includes((statsData?.class || '').toLowerCase()));
                })
            )
            .map(spellItem => ({
                label: typeof spellItem === 'string' ? spellItem : spellItem.name,
                value: typeof spellItem === 'string' ? spellItem : spellItem.id,
            }));

        // Render the dropdown with the filtered list
        return (
            <DropDownPicker
                open={openSpellDropdown}
                setOpen={setOpenSpellDropdown}
                value={spellChoiceInputValue}
                setValue={setSpellChoiceInputValue}
                items={availableSpells}
                placeholder="Select a spell"
                style={{ marginBottom: 10 }}
                zIndex={1000}
            />
        );
    };

    const renderSpellContent = () => {
        // Get spell name based on which modal is open and its corresponding data
        let spellNameToRender;
        if (preparedSpellModalVisible) {
            spellNameToRender = preparedSpellChoiceInputValue ||
                (spellPressedIndex !== null && preparedSpellSlotsData[spellPressedIndex]?.spellName);
        } else {
            spellNameToRender = spellChoiceInputValue ||
                (spellPressedIndex !== null && knownSpellSlotsData[spellPressedIndex]?.spellName);
        }

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
                        {spell.level && (
                            <View>
                                <Text>Level:</Text>
                                <Text>{spell.level}</Text>
                            </View>
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

    const handleLearnMoreSpells = (increment: number) => {
        // Increment or decrement the number of known spell slots
        if (allKnownSpellsSlots !== null) {
            // Don't allow negative total slots
            if (allKnownSpellsSlots + increment < 0) {
                return;
            }

            const updatedAllKnownSpellsSlots = allKnownSpellsSlots + increment;
            setAllKnownSpellsSlots(updatedAllKnownSpellsSlots);

            let updatedKnownSpells;
            if (increment > 0) {
                // Adding slots
                const maxIndex = knownSpellSlotsData.reduce((max, slot) =>
                    Math.max(max, slot.slotIndex), -1);

                const newSlots = Array.from({ length: increment }, (_, i) => ({
                    slotIndex: maxIndex + 1 + i,
                    spellName: null
                }));

                updatedKnownSpells = [...knownSpellSlotsData, ...newSlots];
            } else {
                // Removing slots
                updatedKnownSpells = knownSpellSlotsData.slice(0, knownSpellSlotsData.length + increment);
            }

            setKnownSpellSlotsData(updatedKnownSpells);
            saveKnownSpellSlots(updatedKnownSpells);
        }
    };

    const preparedSpellOptionsBasedOnClass = () => {
        if (statsData?.class?.toLowerCase() === 'wizard') {
            // Get list of known spells
            const knownSpells = knownSpellSlotsData
                .filter(slot => slot.spellName !== null)
                .map(slot => slot.spellName);

            // Return only spells that are in the known spells list
            return spellsData.flatMap(level =>
                level.spells
                    .filter(spell => {
                        const spellName = typeof spell === 'string' ? spell : spell.name;
                        return knownSpells.includes(spellName);
                    })
                    .map(spell => ({
                        label: typeof spell === 'string' ? spell : spell.name,
                        value: typeof spell === 'string' ? spell : spell.id
                    }))
            );
        }

        // For non-wizards, return the cleanSpellList formatted for dropdown
        return cleanSpellList.map(spell => ({
            label: spell,
            value: spell
        }));
    }

    const renderPreparedSpellChoices = () => {
        // Get list of already prepared spells, excluding current slot
        const preparedSpells = preparedSpellSlotsData
            .filter(slot => slot.spellName !== null && slot.slotIndex !== spellPressedIndex)
            .map(slot => slot.spellName!.toLowerCase());

        // Filter out already prepared spells from options
        const availableSpells = preparedSpellOptionsBasedOnClass()
            .filter(item => {
                const spellName = (typeof item.label === 'string' ? item.label : item.label.label).toLowerCase();
                return !preparedSpells.includes(spellName);
            })
            .map(item => ({
                label: typeof item.label === 'string' ? item.label : item.label.label,
                value: typeof item.value === 'string' ? item.value : item.value.value
            }));

        return <DropDownPicker
            placeholder="Select a spell to prepare"
            open={openPreparedSpellDropdown}
            setOpen={setOpenPreparedSpellDropdown}
            value={preparedSpellChoiceInputValue}
            setValue={setPreparedSpellChoiceInputValue}
            items={availableSpells}
            multiple={false}
            containerStyle={{ height: 40, marginBottom: 20 }}
            style={{ backgroundColor: 'white', borderRadius: 8 }}
            dropDownContainerStyle={{ backgroundColor: 'white', borderRadius: 8 }}
        />
    }


    const prepareSpellIntoSlot = (slotIndex: number, spellName: string) => {
        if (slotIndex === null || !spellName) {
            Alert.alert('Empty Slot', 'Please select a spell and try again.');
            return;
        }

        const updatedPreparedSpells = preparedSpellSlotsData.map((slot) =>
            slot.slotIndex === slotIndex
                ? { ...slot, spellName: spellName }
                : slot
        );
        const foundSlotIndex = updatedPreparedSpells.findIndex(
            (slot) => Number(slot.slotIndex) === Number(slotIndex)
        );

        if (foundSlotIndex !== -1) {
            updatedPreparedSpells[foundSlotIndex].spellName = spellName;
            setPreparedSpellSlotsData(updatedPreparedSpells);
        } else {
            console.warn('Could not find spell slot with index:', slotIndex);
        }

        // Reset modal states
        setPreparedSpellModalVisible(false);
        setPreparedSpellChoiceInputValue(null);
        setSpellPressedIndex(null);
    };

    const getRemainingSpellSlotsByLevel = () => {
        let spellSlotsPerUserLevelPerSpellLevel;
        switch (statsData.class) {
            case 'wizard':
                spellSlotsPerUserLevelPerSpellLevel = wizardTableData;
                break;
            case 'warlock':
                spellSlotsPerUserLevelPerSpellLevel = warlockTableData;
                break;
            case 'sorcerer':
                spellSlotsPerUserLevelPerSpellLevel = sorcererTableData;
                break;
            case 'artificer':
                spellSlotsPerUserLevelPerSpellLevel = artificerTableData;
                break;
            case 'bard':
                spellSlotsPerUserLevelPerSpellLevel = bardTableData;
                break;
            case 'cleric':
                spellSlotsPerUserLevelPerSpellLevel = clericTableData;
                break;
            case 'druid':
                spellSlotsPerUserLevelPerSpellLevel = druidTableData;
                break;
            case 'ranger':
                spellSlotsPerUserLevelPerSpellLevel = rangerTableData;
                break;
            case 'paladin':
                spellSlotsPerUserLevelPerSpellLevel = paladinTableData;
                break;

            default:
                return {};
        }

        const currentLevelData = spellSlotsPerUserLevelPerSpellLevel.find(
            level => level.userLevel === statsData.level
        );

        const remainingSlots: Record<string, { total: number; remaining: number }> = {};

        // If no level data or no spell slots, return all levels with 0 slots
        if (!currentLevelData || !currentLevelData.spellSlotSquares) {
            for (let i = 1; i <= 9; i++) {
                const spentKey = `SpLv${i}`;
                remainingSlots[spentKey] = {
                    total: 0,
                    remaining: 0
                };
            }
            return remainingSlots;
        }

        const currentLevelSlots = currentLevelData.spellSlotSquares;

        Object.entries(currentLevelSlots).forEach(([spellLevelKey, numSlots]) => {
            const spellLevelMatch = spellLevelKey.match(/^SpLv(\d+)$/);
            if (!spellLevelMatch) {
                console.error(`Invalid spell level key: ${spellLevelKey}`);
                return;
            }
            const spellLevel = Number(spellLevelMatch[1]);

            const spentKey = `SpLv${spellLevel}`;
            const slotsSpent = spentSpellSlots[spentKey] || 0;
            const totalSlots = Number(numSlots);

            // Ensure slotsSpent does not exceed totalSlots
            const adjustedSlotsSpent = Math.min(slotsSpent, totalSlots);
            const remaining = totalSlots - adjustedSlotsSpent;

            remainingSlots[spentKey] = {
                total: totalSlots,
                remaining: remaining,
            };
        });

        // Fill in any missing spell levels with 0 slots
        for (let i = 1; i <= 9; i++) {
            const spentKey = `SpLv${i}`;
            if (!remainingSlots[spentKey]) {
                remainingSlots[spentKey] = {
                    total: 0,
                    remaining: 0
                };
            }
        }

        return remainingSlots;
    };

    // Spell Points
    const renderSpellPoints = () => {
        const remainingSlots = getRemainingSpellSlotsByLevel();

        return (
            <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {Object.entries(remainingSlots).map(([spellLevel, slotInfo]) => {
                    return (
                        <View key={spellLevel} style={{
                            borderWidth: 1,
                            borderColor: 'rgba(255, 253, 247, 0.1)',
                            backgroundColor: 'rgba(124, 124, 124, 0.1)',
                            borderRadius: 4,
                            padding: 5,
                            margin: 3,
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBottom: 10
                        }}>
                            <Text style={{ marginBottom: 5, color: 'white', alignSelf: 'center' }}>
                                {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][parseInt(spellLevel.replace('SpLv', '')) - 1]}
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                width: 20
                            }}>
                                {[...Array(slotInfo.total)].map((_, slotIndex) => (
                                    <View
                                        key={slotIndex}
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderWidth: 1,
                                            borderColor: 'cyan',
                                            backgroundColor: slotIndex >= slotInfo.remaining ? 'transparent' : 'cyan',
                                            margin: 2,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    }


    function castSpell(spellName: string) {
        // Search through all spell levels
        for (const levelData of spellsData) {
            const foundSpell = levelData.spells.find(
                (spell) => {
                    if (typeof spell === 'string') return false;
                    return spell.name.toLowerCase() === spellName.toLowerCase();
                }
            );
            if (foundSpell && typeof foundSpell !== 'string') {
                const castingTimeString = foundSpell.castingTime;
                const spellLevel = Number(foundSpell.level);

                if (isNaN(spellLevel)) {
                    console.error(`Invalid spell level for spell: ${foundSpell.name}`);
                    Alert.alert('Spell Data Error', `Invalid level for spell: ${foundSpell.name}`);
                    return;
                }

                // Cantrips do not consume spell slots
                if (spellLevel === 0) {
                    // Deduct action costs and exit
                    deductActionCosts(foundSpell.castingTime);
                    return;
                }
                const remainingSlots = getRemainingSpellSlotsByLevel();
                const spellLevelKey = `SpLv${spellLevel}`;
                const levelSlots = remainingSlots[spellLevelKey];

                if (!levelSlots) {
                    Alert.alert('Spell Slot Error', `No spell slot information available for level ${spellLevel}`);
                    return;
                }

                if (levelSlots.remaining <= 0) {
                    Alert.alert('Insufficient Spell Slots', `No remaining spell slots for level ${spellLevel}`);
                    return;
                }

                // All checks passed, increment spentSpellSlots safely
                setSpentSpellSlots(prev => {
                    const currentSpent = prev[spellLevelKey] || 0;
                    const totalSlots = levelSlots.total;

                    // Prevent exceeding total slots
                    if (currentSpent >= totalSlots) {
                        Alert.alert('Spell Slot Error', `You have already used all spell slots for level ${spellLevel}`);
                        return prev;
                    }

                    return {
                        ...prev,
                        [spellLevelKey]: currentSpent + 1,
                    };
                });

                // Use parseCastingTime to get the action costs
                const { action, bonusAction, reaction } = parseCastingTime(castingTimeString);

                // Check if the user has enough actions, bonus actions, and reactions
                if (action > 0 && currentActionsAvailable < action) {
                    Alert.alert('Insufficient Actions', 'You do not have enough actions available.');
                    return;
                }
                if (bonusAction > 0 && currentBonusActionsAvailable < bonusAction) {
                    Alert.alert('Insufficient Bonus Actions', 'You do not have enough bonus actions available.');
                    return;
                }
                if (reaction > 0 && currentReactionsAvailable < reaction) {
                    Alert.alert('Insufficient Reactions', 'You do not have any reactions available.');
                    return;
                }

                // Deduct action costs
                deductActionCosts(foundSpell.castingTime);
                return;
            }
        }

        Alert.alert('Spell Not Found', `The spell "${spellName}" was not found.`);
    }

    const canAffordSpell = (spellName: string | null): boolean => {
        if (!spellName) return false;

        // Find the spell data
        let foundSpell: any = null;
        for (const levelData of spellsData) {
            const spell = levelData.spells.find(
                (spell) => {
                    if (typeof spell === 'string') return false;
                    return spell.name.toLowerCase() === spellName.toLowerCase();
                }
            );
            if (spell && typeof spell !== 'string') {
                foundSpell = spell;
                break;
            }
        }
        if (!foundSpell) return false;

        const castingTimeString = foundSpell.castingTime;
        const { action, bonusAction, reaction } = parseCastingTime(castingTimeString);

        // Check if user has enough actions
        if (action > 0 && currentActionsAvailable < action) return false;
        if (bonusAction > 0 && currentBonusActionsAvailable < bonusAction) return false;
        if (reaction > 0 && currentReactionsAvailable < reaction) return false;

        // Check if there are enough spell slots left for the spell's level
        const spellLevel = Number(foundSpell.level);
        if (isNaN(spellLevel)) return false; // Invalid spell level

        // Cantrips (level 0 spells) do not consume spell slots
        if (spellLevel === 0) return true;

        const remainingSlots = getRemainingSpellSlotsByLevel();
        const spellLevelKey = `SpLv${spellLevel}`;
        const levelSlots = remainingSlots[spellLevelKey];

        // If no slot information is available, cannot cast
        if (!levelSlots) return false;

        // Check if there are remaining slots
        if (levelSlots.remaining <= 0) return false;

        // If all checks pass, the user can afford the spell
        return true;
    };

    const deductActionCosts = (castingTimeString: string) => {
        const { action, bonusAction, reaction } = parseCastingTime(castingTimeString);

        if (action > 0) {
            setCurrentActionsAvailable(prev => Math.max(prev - action, 0));
        }
        if (bonusAction > 0) {
            setCurrentBonusActionsAvailable(prev => Math.max(prev - bonusAction, 0));
        }
        if (reaction > 0) {
            setCurrentReactionsAvailable(prev => Math.max(prev - reaction, 0));
        }
    };

    const handleCanAffordCastButtonDisabled = (spellName: string | null) => {
        if (!spellName) {
            return true;
        } else {
            return !canAffordSpell(spellName);
        }
    }

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
                        <View style={styles.headerTextContainer}>
                            <Ionicons
                                name={currentReactionsAvailable > 0 ? "square" : "square-outline"}
                                size={16}
                                color={currentReactionsAvailable > 0 ? "rgb(200, 0, 255)" : "rgba(200, 0, 255, 0.2)"}
                            />
                            <View style={styles.headerTextBox}>
                                <Text style={[
                                    styles.headerText,
                                    currentReactionsAvailable === 0 && { color: 'black' }
                                ]}>
                                    x{currentReactionsAvailable}
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


                {/* Subheader */}
                <View style={styles.subheader}>
                    {renderSpellPoints()}
                </View>


                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        {renderCantripBlocks()}
                        {renderPreparedSpellBlocksForClass()}
                        {renderAllKnownSpells()}
                        {/* For Bards, Rangers, Sorcerers, and Warlocks */}
                        {renderCastableSpells()}
                    </View>
                </View>

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
                                        cantripPressedIndex !== null && cantripSlotsData[cantripPressedIndex]
                                            ? getCantripImage(cantripSlotsData[cantripPressedIndex]) as ImageSourcePropType
                                            : cantripChoiceImage || undefined
                                    }
                                    style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 8, overflow: 'hidden' }}
                                    resizeMode="cover"
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.title, { color: 'black' }]}>
                                        {cantripChoiceValue || (cantripPressedIndex !== null && cantripSlotsData[cantripPressedIndex])}
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                        <Text style={[styles.cantripLabel, { marginBottom: 0 }]}>Casting Time:</Text>
                                        <Text>
                                            {(() => {
                                                const selectedCantrip = cantripChoiceValue || (cantripPressedIndex !== null && cantripSlotsData[cantripPressedIndex]);
                                                const castingTime = cantripsData.find(cantrip =>
                                                    cantrip.name === selectedCantrip
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
                                            {(() => {
                                                const selectedCantrip = cantripChoiceValue || (cantripPressedIndex !== null && cantripSlotsData[cantripPressedIndex]);
                                                return cantripsData.find(cantrip =>
                                                    cantrip.name === selectedCantrip
                                                )?.range;
                                            })()}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                        <Text style={[styles.cantripLabel, { marginBottom: 0 }]}>Components:</Text>
                                        <Text>
                                            {(() => {
                                                const selectedCantrip = cantripChoiceValue || (cantripPressedIndex !== null && cantripSlotsData[cantripPressedIndex]);
                                                const components = cantripsData.find(cantrip =>
                                                    cantrip.name === selectedCantrip
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
                        {cantripPressedIndex !== null && cantripSlotsData[cantripPressedIndex] ? (
                            <Button
                                title="Cast"
                                disabled={!canAffordCantrip(cantripSlotsData[cantripPressedIndex])}
                                onPress={() => castCantrip()}
                            />
                        ) : (
                            <Button
                                title="Assign"
                                color="green"
                                disabled={cantripChoiceValue === null}
                                onPress={() => {
                                    setCantripInSlot();
                                }}
                            />
                        )}
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
                        <ScrollView style={{ flex: 1, marginBottom: 60 }}>
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
                        {spellPressedIndex !== null && !knownSpellSlotsData[spellPressedIndex]?.spellName ? (
                            <Button
                                title="Assign"
                                color="green"
                                disabled={spellChoiceInputValue === null}
                                onPress={() => {
                                    assignSpellToSlot();
                                    setSpellModalVisible(false);
                                }}
                            />
                        ) : (
                            statsData?.class?.toLowerCase() !== 'wizard' && (
                                <Button
                                    title="Cast"
                                    color="#007cba"
                                    onPress={() => {
                                        if (spellPressedIndex !== null && knownSpellSlotsData[spellPressedIndex]?.spellName) {
                                            castSpell(knownSpellSlotsData[spellPressedIndex].spellName.toLowerCase());
                                        }
                                        setSpellModalVisible(false);
                                    }}
                                    disabled={spellPressedIndex !== null
                                        ? handleCanAffordCastButtonDisabled(knownSpellSlotsData[spellPressedIndex]?.spellName)
                                        : true}
                                />
                            )
                        )}
                    </View>
                </View>

            </Modal>


            {/* Prepared Spell Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={preparedSpellModalVisible}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.preparedSpellModal}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 10
                        }}
                        >
                            {/* Spell Slot Number */}
                            <View style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 5, paddingHorizontal: 10 }}>
                                <Text style={styles.preparedSpellModalHeader}>
                                    {spellPressedIndex !== null ? spellPressedIndex + 1 : ''}
                                </Text>
                            </View>
                            {spellPressedIndex !== null && preparedSpellSlotsData[spellPressedIndex]?.spellName && (
                                <Button
                                    title="Clear"
                                    color="#3770ff"
                                    onPress={() => {
                                        if (spellPressedIndex !== null) {
                                            const updatedSlots = preparedSpellSlotsData.map(slot =>
                                                slot.slotIndex === spellPressedIndex ?
                                                    { ...slot, spellName: null } :
                                                    slot
                                            );
                                            setPreparedSpellSlotsData(updatedSlots);
                                            setPreparedSpellModalVisible(false);
                                        }
                                    }}
                                />
                            )}
                        </View>
                        {renderPreparedSpellChoices()}

                        <ScrollView style={{ flex: 1, marginBottom: 60 }}>
                            {/* Spell Content */}
                            {renderSpellContent()}
                        </ScrollView>

                        <View style={styles.preparedSpellModalButtonsContainer}>
                            <Button
                                title="Cancel"
                                color="black"
                                onPress={() => {
                                    setPreparedSpellModalVisible(false);
                                    setPreparedSpellChoiceInputValue(null);
                                }}
                            />
                            {spellPressedIndex !== null &&
                                preparedSpellSlotsData[spellPressedIndex]?.spellName &&
                                preparedSpellChoiceInputValue === preparedSpellSlotsData[spellPressedIndex]?.spellName ? (
                                <Button
                                    title="Cast"
                                    color="#007cba"
                                    onPress={() => {
                                        if (spellPressedIndex !== null && preparedSpellChoiceInputValue !== null) {
                                            castSpell(preparedSpellChoiceInputValue.toLowerCase());
                                            setPreparedSpellModalVisible(false);
                                        }
                                    }}
                                    disabled={handleCanAffordCastButtonDisabled(preparedSpellSlotsData[spellPressedIndex]?.spellName)}
                                />
                            ) : (
                                <Button
                                    title="Prepare"
                                    color="green"
                                    disabled={preparedSpellChoiceInputValue === null}
                                    onPress={() => {
                                        if (spellPressedIndex !== null && preparedSpellChoiceInputValue !== null) {
                                            prepareSpellIntoSlot(spellPressedIndex, preparedSpellChoiceInputValue);
                                        }
                                    }}
                                />
                            )}
                        </View>
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
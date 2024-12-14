import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    Alert,
    Dimensions,
    ImageBackground,
    ImageSourcePropType,
    Button,
    ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/meStyles';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import StatsDataContext from '../../context/StatsDataContext';
import DropDownPicker from 'react-native-dropdown-picker';
import classItems from '../data/classData.json';
import weaponData from '../data/weapons.json';
import draconicAncestryData from '../data/draconicAncestry.json';
import artificerFeatures from '../data/class-tables/artificer/artificerFeatures.json';
import artificerInfusionsData from '../data/class-tables/artificer/artificerInfusions.json';
import artificerSpecialistData from '../data/class-tables/artificer/artificerSpecialist.json';
import armorerData from '../data/class-tables/artificer/subclass/armorer.json';
import artilleristData from '../data/class-tables/artificer/subclass/artillerist.json';
import battlesmithData from '../data/class-tables/artificer/subclass/battlesmith.json';
import alchemistData from '../data/class-tables/artificer/subclass/alchemist.json';
import barbarianFeatures from '../data/class-tables/barbarian/barbarianFeatures.json';
import primalPathData from '../data/class-tables/barbarian/primalPath.json';
import ancestralGuardianData from '../data/class-tables/barbarian/subclass/ancestralGuardian.json';
import battleragerData from '../data/class-tables/barbarian/subclass/battlerager.json';
import beastData from '../data/class-tables/barbarian/subclass/beast.json';
import berserkerData from '../data/class-tables/barbarian/subclass/berserker.json';
import giantData from '../data/class-tables/barbarian/subclass/giant.json';
import stormHeraldData from '../data/class-tables/barbarian/subclass/stormHerald.json';
import totemWarriorData from '../data/class-tables/barbarian/subclass/totemWarrior.json';
import wildMagicData from '../data/class-tables/barbarian/subclass/wildMagic.json';
import zealotData from '../data/class-tables/barbarian/subclass/zealot.json';
import bardFeatures from '../data/class-tables/bard/bardFeatures.json';
import bardCollegeData from '../data/class-tables/bard/bardCollege.json';
import creationData from '../data/class-tables/bard/subclass/creation.json';
import eloquenceData from '../data/class-tables/bard/subclass/eloquence.json';
import glamourData from '../data/class-tables/bard/subclass/glamour.json';
import loreData from '../data/class-tables/bard/subclass/lore.json';
import spiritsData from '../data/class-tables/bard/subclass/spirits.json';
import swordsData from '../data/class-tables/bard/subclass/swords.json';
import valorData from '../data/class-tables/bard/subclass/valor.json';
import whispersData from '../data/class-tables/bard/subclass/whispers.json';
import clericFeatures from '../data/class-tables/cleric/clericFeatures.json';
import divineDomainData from '../data/class-tables/cleric/divineDomain.json';
import arcanaData from '../data/class-tables/cleric/subclass/arcana.json';
import deathData from '../data/class-tables/cleric/subclass/death.json';
import forgeData from '../data/class-tables/cleric/subclass/forge.json';
import graveData from '../data/class-tables/cleric/subclass/grave.json';
import knowledgeData from '../data/class-tables/cleric/subclass/knowledge.json';
import lifeData from '../data/class-tables/cleric/subclass/life.json';
import lightData from '../data/class-tables/cleric/subclass/light.json';
import natureData from '../data/class-tables/cleric/subclass/nature.json';
import orderData from '../data/class-tables/cleric/subclass/order.json';
import peaceData from '../data/class-tables/cleric/subclass/peace.json';
import tempestData from '../data/class-tables/cleric/subclass/tempest.json';
import trickeryData from '../data/class-tables/cleric/subclass/trickery.json';
import twilightData from '../data/class-tables/cleric/subclass/twilight.json';
import warData from '../data/class-tables/cleric/subclass/war.json';
import cantripsData from '../data/cantrips.json';
import spellsData from '../data/spells.json';
import druidFeatures from '../data/class-tables/druid/druidFeatures.json';


// Import default images
import defaultChestArmorImage from '@equipment/default-armor.png';
import defaultRingImage from '@equipment/default-ring.png';
import defaultMeleeWeaponImage from '@equipment/default-melee.png';
import defaultOffhandWeaponImage from '@equipment/default-offhand.png';
import defaultRangedWeaponImage from '@equipment/default-ranged.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import raceBonuses from '../data/raceData.json';
import { Item, useItemEquipment } from '../../context/ItemEquipmentContext';
import { CharacterContext, WeaponSlot, CharacterContextProps } from '../../context/equipmentActionsContext';
import { useActions } from '../../context/actionsSpellsContext';
import featuresImage from '@images/features-image.png';
import armorTypes from '../data/armorTypes.json';


import spearImage from '@weapons/spear.png';
import sickleImage from '@weapons/sickle.png';
import quarterstaffImage from '@weapons/quarterstaff.png';
import maceImage from '@weapons/mace.png';
import hammerLightImage from '@weapons/hammer-light.png';
import javelinImage from '@weapons/javelin.png';
import handaxeImage from '@weapons/handaxe.png';
import greatclubImage from '@weapons/greatclub.png';
import daggerImage from '@weapons/dagger.png';
import clubImage from '@weapons/club.png';
import slingImage from '@weapons/sling.png';
import shortbowImage from '@weapons/shortbow.png';
import longbowImage from '@weapons/longbow.png';
import dartImage from '@weapons/dart.png';
import crossbowLightImage from '@weapons/crossbow-light.png';
import crossbowHeavyImage from '@weapons/crossbow-heavy.png';
import crossbowHandImage from '@weapons/crossbow-hand.png';
import whipImage from '@weapons/whip.png';
import warhammerImage from '@weapons/warhammer.png';
import warpickImage from '@weapons/war-pick.png';
import tridentImage from '@weapons/trident.png';
import shortswordImage from '@weapons/shortsword.png';
import scimitarImage from '@weapons/scimitar.png';
import rapierImage from '@weapons/rapier.png';
import pikeImage from '@weapons/pike.png';
import morningstarImage from '@weapons/morningstar.png';
import maulImage from '@weapons/maul.png';
import longswordImage from '@weapons/longsword.png';
import lanceImage from '@weapons/lance.png';
import halberdImage from '@weapons/halberd.png';
import greatswordImage from '@weapons/greatsword.png';
import greataxeImage from '@weapons/greataxe.png';
import glaiveImage from '@weapons/glaive.png';
import flailImage from '@weapons/flail.png';
import netImage from '@weapons/net.png';
import battleaxeImage from '@weapons/battleaxe.png';
import blowgunImage from '@weapons/blowgun.png';

const weaponImages = {
    "spear": spearImage,
    "sickle": sickleImage,
    "quarterstaff": quarterstaffImage,
    "mace": maceImage,
    "hammer, light": hammerLightImage,
    "javelin": javelinImage,
    "handaxe": handaxeImage,
    "greatclub": greatclubImage,
    "dagger": daggerImage,
    "club": clubImage,
    "sling": slingImage,
    "shortbow": shortbowImage,
    "longbow": longbowImage,
    "dart": dartImage,
    "crossbow, light": crossbowLightImage,
    "crossbow, heavy": crossbowHeavyImage,
    "crossbow, hand": crossbowHandImage,
    "whip": whipImage,
    "warhammer": warhammerImage,
    "war pick": warpickImage,
    "trident": tridentImage,
    "shortsword": shortswordImage,
    "scimitar": scimitarImage,
    "rapier": rapierImage,
    "pike": pikeImage,
    "morningstar": morningstarImage,
    "maul": maulImage,
    "longsword": longswordImage,
    "lance": lanceImage,
    "halberd": halberdImage,
    "greatsword": greatswordImage,
    "greataxe": greataxeImage,
    "glaive": glaiveImage,
    "flail": flailImage,
    "net": netImage,
    "battleaxe": battleaxeImage,
    "blowgun": blowgunImage,
};

// Key for AsyncStorage
const CANTRIP_SLOTS_KEY = '@cantrip_slots';

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

interface DraconicAncestry {
    dragon: string;
    damageType: string;
    breathWeapon: string;
    typicalAlignment: string;
}

// Define a function to clear AsyncStorage
const clearAsyncStorage = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Failed to clear AsyncStorage:', error);
    }
};

const classFeaturesMap: { [key: string]: any } = {
    artificer: artificerFeatures,
    barbarian: barbarianFeatures,
    bard: bardFeatures,
    cleric: clericFeatures,
    druid: druidFeatures,
}

// TODO: make max infusions learned a variable
const INFUSIONS_CREDITS = 4;

export default function MeScreen() {
    // Define equipment items
    const initialEquipmentItems: EquipmentItem[] = [
        // Section 2 items
        { id: 'armor', name: 'Armor', defaultImage: defaultChestArmorImage as ImageSourcePropType, section: 2 },
        // Section 4 items
        { id: 'shield', name: 'Shield', defaultImage: defaultRingImage as ImageSourcePropType, section: 4 },
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
    const {
        mainHandWeapon,
        offHandWeapon,
        rangedHandWeapon,
        equipWeapon,
        luckyPoints,
        luckyPointsEnabled,
        setLuckyPoints,
        luckyPointsMax,
        setLuckyPointsMax,
        relentlessEnduranceGained,
        setRelentlessEnduranceGained,
        setRelentlessEnduranceUsable,
        setLuckyPointsEnabled,
        infernalLegacyEnabled,
        setInfernalLegacyEnabled,
        draconicAncestry,
        setDraconicAncestry,
        breathWeaponEnabled,
        setBreathWeaponEnabled,
        magicalTinkeringEnabled,
        setMagicalTinkeringEnabled,
        infuseItemEnabled,
        setInfuseItemEnabled,
        setInfuseItemSpent,
        infusionsLearned,
        setInfusionsLearned,
        primalKnowledgeEnabled,
        setPrimalKnowledgeEnabled,
        primalKnowledgeEnabledAgain,
        setPrimalKnowledgeEnabledAgain,
        primalChampionEnabled,
        setPrimalChampionEnabled,
        bardicInspirationEnabled,
        setBardicInspirationEnabled,
        expertiseEnabled,
        setExpertiseEnabled,
        expertiseEnabledAgain,
        setExpertiseEnabledAgain,
        fontOfInspirationEnabled,
        setFontOfInspirationEnabled,
        countercharmEnabled,
        setCountercharmEnabled,
        arcaneInitiateEnabled,
        setArcaneInitiateEnabled,
        arcaneInitiateCantrips,
        setArcaneInitiateCantrips,
        channelDivinityEnabled,
        setChannelDivinityEnabled,
        arcaneMasteryEnabled,
        setArcaneMasteryEnabled,
        setArcaneMasterySpellsLearned,
        wildShapeEnabled,
        setWildShapeEnabled,
        deathDomainEnabled,
        setDeathDomainEnabled,
        setReaperCantripLearned,
        resetEquipmentActionsContext,
        blessingsOfKnowledgeEnabled,
        setBlessingsOfKnowledgeEnabled,
        blessingsOfKnowledgeSkillsLearned,
        setBlessingsOfKnowledgeSkillsLearned,
    } = useContext(CharacterContext) as CharacterContextProps;
    const {
        items,
        weaponsProficientIn,
        equippedArmor,
        setEquippedArmor,
        equippedShield,
        setEquippedShield,
    } = useItemEquipment();
    const [weapons, setWeapons] = useState<{ label: string; value: string; image: string }[]>([]);
    // Local state variables for DropDownPicker values
    const [mainHandValue, setMainHandValue] = useState<string>(mainHandWeapon?.name || 'none');
    const [offHandValue, setOffHandValue] = useState<string>(offHandWeapon?.name || 'none');
    const [rangedHandValue, setRangedHandValue] = useState<string>(rangedHandWeapon?.name || 'none');
    const { setCurrentActionsAvailable, setCurrentBonusActionsAvailable } = useActions();
    const endTurn = () => {
        setCurrentActionsAvailable(1);
        setCurrentBonusActionsAvailable(1);
    };
    const [featuresModalVisible, setFeaturesModalVisible] = useState(false);
    const [armorModalVisible, setArmorModalVisible] = useState(false);
    const [openArmorPicker, setOpenArmorPicker] = useState(false);
    const [armorValue, setArmorValue] = useState<string | null>(null);
    const [shieldModalVisible, setShieldModalVisible] = useState(false);
    const [openShieldPicker, setOpenShieldPicker] = useState(false);
    const [shieldValue, setShieldValue] = useState<string | null>(null);
    const [featDescriptionModalVisible, setFeatDescriptionModalVisible] = useState(false);
    const [selectedFeat, setSelectedFeat] = useState<string | null>(null);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [draconicAncestryValue, setDraconicAncestryValue] = useState<string | null>(null);
    const [draconicAncestryModalVisible, setDraconicAncestryModalVisible] = useState(false);
    const [classFeatDescriptionModalVisible, setClassFeatDescriptionModalVisible] = useState(false);
    const [infusionModalVisible, setInfusionModalVisible] = useState(false);
    const [infusionValue, setInfusionValue] = useState<string | null>(null);
    const [specialistModalVisible, setSpecialistModalVisible] = useState(false);
    const [specialistValue, setSpecialistValue] = useState<string | null>(null);
    const [primalPathValue, setPrimalPathValue] = useState<string | null>(null);
    const [primalPathOpen, setPrimalPathOpen] = useState(false);
    const [bardCollegeOpen, setBardCollegeOpen] = useState(false);
    const [bardCollegeValue, setBardCollegeValue] = useState<string | null>(null);
    const [divineDomainOpen, setDivineDomainOpen] = useState(false);
    const [divineDomainValue, setDivineDomainValue] = useState<string | null>(null);
    const [arcaneInitiateValue, setArcaneInitiateValue] = useState<string | null>(null);
    const [arcaneInitiateModalVisible, setArcaneInitiateModalVisible] = useState(false);
    const [arcaneMasteryModalVisible1, setArcaneMasteryModalVisible1] = useState(false);
    const [arcaneMasteryModalVisible2, setArcaneMasteryModalVisible2] = useState(false);
    const [arcaneMasteryModalVisible3, setArcaneMasteryModalVisible3] = useState(false);
    const [arcaneMasteryModalVisible4, setArcaneMasteryModalVisible4] = useState(false);
    const [arcaneMasteryValue1, setArcaneMasteryValue1] = useState<string | null>(null);
    const [arcaneMasteryValue2, setArcaneMasteryValue2] = useState<string | null>(null);
    const [arcaneMasteryValue3, setArcaneMasteryValue3] = useState<string | null>(null);
    const [arcaneMasteryValue4, setArcaneMasteryValue4] = useState<string | null>(null);
    const [darkModalVisible, setDarkModalVisible] = useState(false);
    const [selectedSpell, setSelectedSpell] = useState<string | null>(null);
    const [reaperValue, setReaperValue] = useState<string | null>(null);
    const [reaperOpen, setReaperOpen] = useState(false);
    const [blessingsOfKnowledgeValue1, setBlessingsOfKnowledgeValue1] = useState<string | null>(null);
    const [blessingsOfKnowledgeOpen1, setBlessingsOfKnowledgeOpen1] = useState(false);
    const [blessingsOfKnowledgeValue2, setBlessingsOfKnowledgeValue2] = useState<string | null>(null);
    const [blessingsOfKnowledgeOpen2, setBlessingsOfKnowledgeOpen2] = useState(false);

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
        }
    }, [items, mainHandWeapon, offHandWeapon, equipWeapon]);

    // Use context for statsData
    const {
        statsData,
        updateStatsData,
        unusedSkillPoints,
        setUnusedSkillPoints,
        raceSkillProfGained,
        setRaceSkillProfGained,
        subclass,
        setSubclass,
    } = useContext(StatsDataContext) as {
        statsData: StatsData;
        updateStatsData: (data: StatsData) => void;
        unusedSkillPoints: number;
        setUnusedSkillPoints: (points: number) => void;
        raceSkillProfGained: boolean;
        setRaceSkillProfGained: (value: boolean) => void;
        subclass: string | null;
        setSubclass: (value: string | null) => void;
    };

    if (!statsData) {
        // Render a loading indicator or return null
        return null;
    }
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
        endTurn();
        setRaceValue(null);
        setClassValue(null);
        setSubclass(null);
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
        clearCantripSlots();
        setSettingsModalVisible(false);
        setLuckyPoints(-1);
        setArcaneMasteryValue1(null);
        setArcaneMasteryValue2(null);
        setArcaneMasteryValue3(null);
        setArcaneMasteryValue4(null);

        // Reset equipment actions context
        resetEquipmentActionsContext();

    };

    const clearCantripSlots = async () => {
        await AsyncStorage.removeItem(CANTRIP_SLOTS_KEY);
    }

    // Function to handle equipping a weapon
    const handleEquipWeapon = (slot: WeaponSlot, weaponName: string | null) => {
        if (weaponName?.toLowerCase() === 'none' || !weaponName) {
            // Unequip the weapon if "None" is selected
            equipWeapon(slot, null);
            if (slot === 'mainHand') setMainHandValue('none');
            if (slot === 'offHand') setOffHandValue('none');
            if (slot === 'rangedHand') setRangedHandValue('none');
            return;
        }

        // Find the selected weapon from the user's bag using weaponName
        const bagWeapon = items.find(
            item => item?.name?.toLowerCase() === weaponName?.toLowerCase()
        );

        if (!bagWeapon) {
            Alert.alert('Weapon Not Found', 'The selected weapon is not in your bag.');
            return;
        }

        // Check if weapon is already equipped in another slot and has quantity of 1
        const isEquippedInMainHand = mainHandWeapon?.name?.toLowerCase() === weaponName.toLowerCase();
        const isEquippedInOffHand = offHandWeapon?.name?.toLowerCase() === weaponName.toLowerCase();
        const isEquippedInRangedHand = rangedHandWeapon?.name?.toLowerCase() === weaponName.toLowerCase();
        const quantity = bagWeapon.quantity || 1;

        if (quantity === 1 && slot !== 'mainHand' && isEquippedInMainHand) {
            Alert.alert('Already Equipped', 'This weapon is already equipped in your main hand.');
            return;
        }
        if (quantity === 1 && slot !== 'offHand' && isEquippedInOffHand) {
            Alert.alert('Already Equipped', 'This weapon is already equipped in your off hand.');
            return;
        }
        if (quantity === 1 && slot !== 'rangedHand' && isEquippedInRangedHand) {
            Alert.alert('Already Equipped', 'This weapon is already equipped in your ranged hand.');
            return;
        }

        // Get the weaponType from the bagWeapon
        const weaponType = bagWeapon.weaponType;

        if (!weaponType) {
            Alert.alert('Invalid Weapon', 'The selected weapon does not have a valid weapon type.');
            return;
        }

        // Find the complete weapon data using weaponType
        const weaponDataItem = weaponData.weapons
            .flatMap(category => category.items as unknown as Item[])
            .find(item => item.weaponType?.toLowerCase() === weaponType?.toLowerCase());

        if (!weaponDataItem) {
            Alert.alert('Weapon Data Not Found', 'The weapon type does not exist in the weapon data.');
            return;
        }

        // Merge properties: weaponDataItem first, then bagWeapon to preserve unique names
        let selectedWeapon: Item = { ...weaponDataItem, ...bagWeapon };

        // Ensure weaponType is set
        selectedWeapon.weaponType = weaponType;

        // Check if the selected weapon is two-handed
        const isSelectedWeaponTwoHanded = selectedWeapon.properties
            ?.map(prop => prop.toLowerCase())
            .includes('two-handed');

        // Cannot equip two-handed weapon in offHand
        if (isSelectedWeaponTwoHanded && slot === 'offHand') {
            Alert.alert('Cannot Equip', 'Two-handed weapons cannot be equipped in the offhand.');
            return;
        }

        if (isSelectedWeaponTwoHanded) {
            // Equipping a two-handed weapon in mainHand or rangedHand

            // Unequip all weapons
            equipWeapon('mainHand', null);
            equipWeapon('offHand', null);
            equipWeapon('rangedHand', null);

            // Equip the two-handed weapon in the specified slot
            equipWeapon(slot, selectedWeapon);
        } else {
            // Equipping a one-handed weapon

            // If a two-handed weapon is equipped, unequip it
            const mainHandTwoHanded = mainHandWeapon?.properties
                ?.map(prop => prop.toLowerCase())
                .includes('two-handed');
            const rangedHandTwoHanded = rangedHandWeapon?.properties
                ?.map(prop => prop.toLowerCase())
                .includes('two-handed');

            if (mainHandTwoHanded) {
                equipWeapon('mainHand', null);
            }
            if (rangedHandTwoHanded) {
                equipWeapon('rangedHand', null);
            }

            // Equip the selected weapon in the specified slot
            equipWeapon(slot, selectedWeapon);
        }

        // Update the state values
        if (slot === 'mainHand') {
            setMainHandValue(selectedWeapon.name);
        } else if (slot === 'offHand') {
            setOffHandValue(selectedWeapon.name);
        } else if (slot === 'rangedHand') {
            setRangedHandValue(selectedWeapon.name);
        }
    };


    // Function to filter ranged weapons
    function filterEquipableRangedWeapons() {
        // Get all items of type 'weapon' from the bag
        const allBagItems = items.filter(item => item.type?.toLowerCase() === 'weapon');

        // Get ranged weapon categories from weapons.json
        const rangedCategories = weaponData.weapons.filter(category =>
            category.category.toLowerCase().includes('ranged')
        );

        // Collect all ranged weapon types
        const rangedWeaponTypes = rangedCategories.flatMap(category =>
            category.items.map(item => item.weaponType.toLowerCase())
        );

        // Filter items in the bag that match ranged weapon types
        const rangedWeapons = allBagItems.filter(item =>
            rangedWeaponTypes.includes(item.weaponType?.toLowerCase() || '')
        );

        // Map to DropDownPicker items
        const rangedWeaponsList = rangedWeapons.map(item => ({
            label: item.name,
            value: item.name.toLowerCase(),
        }));

        return rangedWeaponsList;
    }
    // Function to filter melee weapons
    function filterEquipableMeleeWeapons() {
        // Get all items of type 'weapon' from the bag
        const allBagItems = items.filter(item => item.type?.toLowerCase() === 'weapon');

        // Get melee weapon categories from weapons.json
        const meleeCategories = weaponData.weapons.filter(category =>
            category.category.toLowerCase().includes('melee')
        );

        // Collect all melee weapon types
        const meleeWeaponTypes = meleeCategories.flatMap(category =>
            category.items.map(item => item.weaponType.toLowerCase())
        );

        // Filter items in the bag that match melee weapon types
        const meleeWeapons = allBagItems.filter(item =>
            meleeWeaponTypes.includes(item.weaponType?.toLowerCase() || '')
        );

        // Map to DropDownPicker items
        const meleeWeaponsList = meleeWeapons.map(item => ({
            label: item.name,
            value: item.name.toLowerCase() || '',
        }));

        // Add 'None' option at the beginning
        meleeWeaponsList.unshift({
            label: 'None',
            value: 'none',
        });

        return meleeWeaponsList;
    }

    // Function to filter offhand weapons
    function filterEquipableOffhandWeapons() {
        // First, get the melee weapons
        const meleeWeapons = filterEquipableMeleeWeapons();

        // Exclude the 'None' option
        const validMeleeWeapons = meleeWeapons.filter(weapon => weapon.value !== 'none');

        // Get the weapon data from the JSON file
        const allWeaponData = weaponData.weapons.flatMap(category => category.items as unknown as Item[]);

        // Filter melee weapons that have the 'Light' property
        const offhandWeapons = validMeleeWeapons.filter(weapon => {
            // Find the corresponding weapon in the bag
            const bagWeapon = items.find(item =>
                item.name.toLowerCase() === weapon.value
            );

            // Find the weapon data from JSON using weaponType
            const weaponDataItem = allWeaponData.find(item =>
                item.weaponType?.toLowerCase() === bagWeapon?.weaponType?.toLowerCase()
            );

            // Check if the weapon has the 'Light' property
            // First check bag item properties, fallback to JSON data properties
            const properties = bagWeapon?.properties || weaponDataItem?.properties || [];
            return properties.map(prop => prop.toLowerCase()).includes('light');
        });

        // Add 'None' option at the beginning
        offhandWeapons.unshift({
            label: 'None',
            value: 'none',
        });

        return offhandWeapons;
    }



    const renderRaceFeatures = (featureKey?: string) => {
        return (
            <View style={{ marginBottom: 20, gap: 10 }}>
                {raceBonuses
                    .filter((race) => race.race === statsData.race)
                    .map((race) =>
                        Object.entries(race.features).map(([key, value]) => {
                            if (featureKey) {
                                if (featureKey === key) {
                                    return (
                                        <Text key={`value-${key}`} style={{ fontSize: 16, lineHeight: 20 }}>
                                            {value}
                                        </Text>
                                    );
                                }
                                return null;
                            }
                            return (
                                <View
                                    key={`feature-${key}`}
                                    style={{
                                        flexDirection: 'column',
                                        gap: 5,
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                        padding: 10,
                                        borderRadius: 8,
                                    }}
                                >
                                    <Text key={`label-${key}`} style={styles.featLabel}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </Text>
                                    <Text key={`value-${key}`}>{value}</Text>
                                </View>
                            );
                        })
                    )}
            </View>
        );
    };

    const renderClassFeatures = (isList?: boolean, specificFeature?: string) => {
        if (!statsData.class) {
            return <Text style={{ color: 'lightgrey' }}>—⁠</Text>;
        }

        const currentClass = statsData.class.toLowerCase();
        const classFeatures = classFeaturesMap[currentClass];

        if (!classFeatures) {
            return <Text style={{ color: 'lightgrey' }}>No features available for this class.</Text>;
        }

        const renderObject = (obj: any) => {
            return Object.entries(obj).map(([key, value], index) => {
                if (key && key.toLowerCase() === 'id') return null;

                // Check if key is a number (for lists)
                const displayKey = !isNaN(Number(key)) ? String(Number(key) + 1) : key;
                const isNumericKey = !isNaN(Number(key));

                if (typeof value === 'object' && value !== null) {
                    return (
                        <View
                            key={key}
                            style={{
                                flexDirection: isNumericKey ? 'row' : 'column',
                                gap: 5,
                                borderRadius: 8,
                                marginBottom: 5,
                            }}
                        >
                            <Text style={styles.featLabel}>{displayKey}</Text>
                            <View style={{ flexDirection: 'column', flexWrap: 'wrap', flex: 1 }}>
                                {renderObject(value)}
                            </View>
                        </View>
                    );
                }

                return (
                    <View
                        key={key}
                        style={{
                            flexDirection: isNumericKey ? 'row' : 'column',
                            gap: 5,
                            borderRadius: 8,
                            marginBottom: 5,
                            flex: 1,
                        }}
                    >
                        <Text style={styles.featLabel}>{displayKey}</Text>
                        <Text style={{ flexWrap: 'wrap', flex: 1 }}>{String(value)}</Text>
                    </View>
                );
            });
        };

        const renderFeature = (feature: any) => {
            const { name, level, ...featureData } = feature;
            return (
                <View
                    key={name && name.toLowerCase()}
                    style={{
                        flexDirection: 'column',
                        gap: 5,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 5,
                    }}
                >
                    {/* Show feature name only if not rendering a specific feature */}
                    {!specificFeature && <Text style={styles.featLabel}>{name}</Text>}
                    {renderObject(featureData)}
                </View>
            );
        };

        // Function to find a specific feature by name, including subfeatures
        const findFeatureByName = (features: any[], name: string): any | null => {
            for (const feature of features) {
                if (feature.name && feature.name.toLowerCase() === name.toLowerCase()) {
                    return feature;
                }
                if (feature.features) {
                    const subFeature = findFeatureByName(feature.features, name);
                    if (subFeature) {
                        return subFeature;
                    }
                }
            }
            return null;
        };

        let featuresToRender: any[] = [];

        if (specificFeature) {
            const feature = findFeatureByName(classFeatures, specificFeature);
            if (feature) {
                featuresToRender = [feature];
            } else {
                return <Text style={{ color: 'lightgrey' }}>Feature not found.</Text>;
            }
        } else {
            featuresToRender = classFeatures.filter((feature: any) => feature.level <= statsData.level);
        }

        return (
            <View style={{ marginBottom: 20, gap: 10 }}>
                {featuresToRender.map((feature: any) => {
                    if (isList) {
                        return (
                            <TouchableOpacity
                                key={feature.name && feature.name.toLowerCase()}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 5,
                                    padding: 5,
                                    borderRadius: 8,
                                }}
                                onPress={() => {
                                    setClassFeatDescriptionModalVisible(true);
                                    setSelectedFeat(feature.name);
                                }}
                            >
                                {/* Show Icon for specific class features */}
                                {(
                                    (feature.name.toLowerCase() === 'magical tinkering' && !magicalTinkeringEnabled) ||
                                    (feature.name.toLowerCase() === 'infuse item' && !infuseItemEnabled) ||
                                    (feature.name.toLowerCase() === 'artificer specialist' && !subclass) ||
                                    (feature.name.toLowerCase() === 'primal path' && !subclass) ||
                                    (feature.name.toLowerCase() === 'primal knowledge' && (!primalKnowledgeEnabled ||
                                        (!primalKnowledgeEnabledAgain && statsData.level >= 10))) ||
                                    (feature.name.toLowerCase() === 'primal champion' && !primalChampionEnabled) ||
                                    (feature.name.toLowerCase() === 'bard college' && !subclass) ||
                                    (feature.name.toLowerCase() === 'expertise' && (!expertiseEnabled ||
                                        (!expertiseEnabledAgain && statsData.level >= 10))) ||
                                    (feature.name.toLowerCase() === 'bardic inspiration' && !bardicInspirationEnabled) ||
                                    (feature.name.toLowerCase() === 'font of inspiration' && !fontOfInspirationEnabled) ||
                                    (feature.name.toLowerCase() === 'countercharm' && !countercharmEnabled) ||
                                    (feature.name.toLowerCase() === 'divine domain' && (!subclass ||
                                        (!arcaneInitiateEnabled && subclass === 'arcana') ||
                                        (!arcaneMasteryEnabled && statsData.level >= 17 && subclass === 'arcana') ||
                                        (!deathDomainEnabled && subclass === 'death') ||
                                        (!blessingsOfKnowledgeEnabled && subclass === 'knowledge')
                                        // add more cleric subclasses here
                                    )) ||
                                    (feature.name.toLowerCase() === 'channel divinity' && !channelDivinityEnabled) ||
                                    (feature.name.toLowerCase() === 'wild shape' && !wildShapeEnabled)

                                    // add more here
                                ) && (
                                        <MaterialCommunityIcons name="alert-circle" size={16} color="gold" />
                                    )}
                                <Text style={[
                                    styles.featLabel,
                                    {
                                        color: 'white',
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        paddingVertical: 2,
                                        paddingHorizontal: 5,
                                        borderRadius: 4,
                                    }
                                ]}>
                                    {feature.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    }

                    return renderFeature(feature);
                })}
            </View>
        );
    };




    const getWeaponImage = (weaponName: string) => {
        const normalizedName = weaponName.toLowerCase();
        return weaponImages[normalizedName as keyof typeof weaponImages] || null;
    };

    const getArmorFromBag = () => {
        return items.filter(item => item.type?.toLowerCase() === 'armor').map(item => ({
            label: item.name,
            value: item.name.toLowerCase(),
        }));
    }

    const handleEquipArmor = (armorName: string | null) => {
        if (armorName?.toLowerCase() === 'none' || !armorName) {
            // Unequip armor
            setArmorValue(null);
            setEquippedArmor(null);
            setArmorModalVisible(false);
            return;
        }
        // Initialize variables to hold the found armor information
        let armorFound = null;
        let armorStats = null;
        // Convert armorName to lowercase for comparison
        const armorNameLower = armorName.toLowerCase();
        // Loop through armorTypes to find the matching armor (case-insensitive)
        for (const type of armorTypes) {
            if (type.versions) {
                const armorKey = Object.keys(type.versions).find(
                    (key) => key.toLowerCase() === armorNameLower
                );
                if (armorKey) {
                    armorFound = type;
                    armorStats = type.versions[armorKey as keyof typeof type.versions];
                    break;
                }
            }
        }
        if (armorStats) {
            // Check if the armor has a strength requirement
            if (armorStats.strengthRequirement) {
                // Get the user's Strength ability score
                const strengthAbility = statsData.abilities.find(
                    (ability) => ability.name.toLowerCase() === 'strength'
                );
                const userStrength = strengthAbility ? strengthAbility.value : 0;

                if (userStrength < armorStats.strengthRequirement) {
                    Alert.alert(
                        'Strength Requirement Not Met',
                        `You need at least ${armorStats.strengthRequirement} Strength to equip this armor. Your Strength is ${userStrength}.`
                    );
                    return; // Do not equip the armor
                }
            }
            // Equip the armor
            setEquippedArmor(armorName);
            setArmorValue(armorName);
            setArmorModalVisible(false);
        } else {
            // Armor not found
            Alert.alert('Armor Not Found', 'The selected armor does not exist in the armor data.');
        }
    };

    const getShieldFromBag = () => {
        return items.filter(item => item.type?.toLowerCase() === 'shield').map(item => ({
            label: item.name,
            value: item.name.toLowerCase(),
        }));
    }

    const renderCustomFeatButton = () => {
        if (!selectedFeat) return null;

        const featName = selectedFeat.toLowerCase();

        switch (featName) {
            case "lucky":
                if (!luckyPointsEnabled) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <MaterialCommunityIcons name="clover" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                            />
                        </View>
                    );
                }
                break;

            case "skill versatility":
                if (!raceSkillProfGained) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{ color: 'lightgrey' }}>+2 </Text>
                            <MaterialCommunityIcons name="bullseye-arrow" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                            />
                        </View>
                    );
                }
                break;

            case "relentless endurance":
                if (!relentlessEnduranceGained) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Ionicons name="fitness" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                            />
                        </View>
                    );
                }
                break;

            case "infernal legacy":
                if (!infernalLegacyEnabled) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <MaterialCommunityIcons name="emoticon-devil" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                            />
                        </View>
                    );
                }
                break;

            case "draconic ancestry":
                if (!draconicAncestry) {
                    return (
                        <>
                            <DropDownPicker
                                items={draconicAncestryData.map(item => ({
                                    label: item.dragon,
                                    value: item.dragon
                                }))}
                                open={draconicAncestryModalVisible}
                                value={draconicAncestryValue}
                                setValue={setDraconicAncestryValue}
                                setOpen={setDraconicAncestryModalVisible}
                                placeholder="Select a draconic ancestry"
                            />

                            {/* render key value pairs of draconic ancestry based on draconic ancestry value */}
                            {draconicAncestryValue && draconicAncestryData
                                .filter(ancestry => ancestry.dragon === draconicAncestryValue)
                                .map(ancestry => (
                                    <View key={ancestry.dragon} style={{ padding: 10 }}>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Dragon: </Text>{ancestry.dragon}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Damage Type: </Text>{ancestry.damageType}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Breath Weapon: </Text>{ancestry.breathWeapon}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Typical Alignment: </Text>{ancestry.typicalAlignment}</Text>
                                    </View>
                                ))}

                            <View style={{
                                paddingHorizontal: 10,
                                backgroundColor: 'rgba(0,0,0,1)',
                                borderRadius: 8,
                                borderWidth: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                opacity: !draconicAncestryValue ? 0.2 : 1
                            }}>
                                <MaterialCommunityIcons name="dna" size={20} color="gold" />
                                <Button
                                    title="Activate"
                                    color="gold"
                                    onPress={() => {
                                        activateFeat(selectedFeat as string)
                                        setDraconicAncestryModalVisible(false);
                                        setDraconicAncestryValue(null);
                                    }}
                                    disabled={!draconicAncestryValue}
                                />
                            </View>
                        </>
                    );
                }
                break;

            case "breath weapon":
                if (!breathWeaponEnabled) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <MaterialCommunityIcons name="weather-windy" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                            />
                        </View>
                    );
                }
                break;


            // Class Features
            // Artificer
            case "magical tinkering":
                if (!magicalTinkeringEnabled) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <MaterialCommunityIcons name="tools" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                            />
                        </View>
                    )
                }
                break;
            case "infuse item":
                if (!infuseItemEnabled) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: infusionsLearned.length !== INFUSIONS_CREDITS ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="beaker" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={infusionsLearned.length !== INFUSIONS_CREDITS}
                            />
                        </View>
                    )
                }
                break;
            case "artificer specialist":
                if (!subclass) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: specialistValue === null ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="wrench" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={specialistValue === null}
                            />
                        </View>
                    )
                }
                break;
            // Barbarian
            case "primal path":
                if (!subclass) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: primalPathValue === null ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="paw" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={primalPathValue === null}
                            />
                        </View>
                    )
                }
                break;
            case "primal knowledge":
                if (!primalKnowledgeEnabled || (statsData.level >= 10 && !primalKnowledgeEnabledAgain)) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: (primalKnowledgeEnabled && statsData.level < 10) || primalKnowledgeEnabledAgain ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="brain" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={(primalKnowledgeEnabled && statsData.level < 10) || primalKnowledgeEnabledAgain}
                            />
                        </View>
                    )
                }
                break;
            case "primal champion":
                if (!primalChampionEnabled) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: primalChampionEnabled ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="paw" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={primalChampionEnabled}
                            />
                        </View>
                    )
                }
                break;
            // Bard
            case "bardic inspiration":
                if (!bardicInspirationEnabled) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: bardicInspirationEnabled ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="music" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={bardicInspirationEnabled}
                            />
                        </View>
                    )
                }
                break;
            case "bard college":
                if (!subclass) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: bardCollegeValue === null ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="music" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={bardCollegeValue === null}
                            />
                        </View>
                    )
                }
                break;
            case "expertise":
                if (!expertiseEnabled || (statsData.level >= 10 && !expertiseEnabledAgain)) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: (expertiseEnabled && statsData.level < 10) || expertiseEnabledAgain ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="book" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={(expertiseEnabled && statsData.level < 10) || expertiseEnabledAgain}
                            />
                        </View>
                    )
                }
                break;
            case "font of inspiration":
                if (!fontOfInspirationEnabled) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: fontOfInspirationEnabled ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="music" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={fontOfInspirationEnabled}
                            />
                        </View>
                    )
                }
                break;
            case "countercharm":
                if (!countercharmEnabled) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: countercharmEnabled ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="music" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={countercharmEnabled}
                            />
                        </View>
                    )
                }
                break;
            // Cleric
            case "divine domain":
                if (!subclass) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: divineDomainValue === null ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="cross-bolnisi" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={divineDomainValue === null}
                            />
                        </View>
                    )
                }
                if (!arcaneMasteryEnabled && statsData.level >= 17 && subclass === 'arcana') {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity:
                                arcaneMasteryValue1 === null ||
                                    arcaneMasteryValue2 === null ||
                                    arcaneMasteryValue3 === null ||
                                    arcaneMasteryValue4 === null ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="cross-bolnisi" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={
                                    arcaneMasteryValue1 === null ||
                                    arcaneMasteryValue2 === null ||
                                    arcaneMasteryValue3 === null ||
                                    arcaneMasteryValue4 === null}
                            />
                        </View>
                    )
                }
                if (!deathDomainEnabled && subclass === 'death') {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: reaperValue === null ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="cross-bolnisi" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={reaperValue === null}
                            />
                        </View>
                    )
                }
                if (!blessingsOfKnowledgeEnabled && subclass === 'knowledge') {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: blessingsOfKnowledgeValue1 === null ||
                                blessingsOfKnowledgeValue2 === null ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="cross-bolnisi" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={
                                    blessingsOfKnowledgeValue1 === null ||
                                    blessingsOfKnowledgeValue2 === null}
                            />
                        </View>
                    )
                }
                break;
            case "channel divinity":
                if (!channelDivinityEnabled) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: channelDivinityEnabled ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="cross-bolnisi" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={channelDivinityEnabled}
                            />
                        </View>
                    )
                }
                break;
            // Druid
            case "wild shape":
                if (!wildShapeEnabled) {
                    return (
                        <View style={{
                            paddingHorizontal: 10,
                            backgroundColor: 'rgba(0,0,0,1)',
                            borderRadius: 8,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: wildShapeEnabled ? 0.2 : 1
                        }}>
                            <MaterialCommunityIcons name="paw" size={20} color="gold" />
                            <Button
                                title="Activate"
                                color="gold"
                                onPress={() => activateFeat(selectedFeat as string)}
                                disabled={wildShapeEnabled}
                            />
                        </View>
                    )
                }
                break;
        }
        return null;
    }





    const activateFeat = (feat: string) => {
        const featName = feat.toLowerCase();

        switch (featName) {
            case "lucky":
                if (!luckyPointsMax || !luckyPoints || !luckyPointsEnabled) {
                    setLuckyPointsMax(1);
                    setLuckyPoints(1);
                    setLuckyPointsEnabled(true);
                }
                break;

            case "skill versatility":
                setUnusedSkillPoints(unusedSkillPoints + 2);
                setRaceSkillProfGained(true);
                break;

            case "relentless endurance":
                setRelentlessEnduranceGained(true);
                setRelentlessEnduranceUsable(true);
                break;

            case "infernal legacy":
                setInfernalLegacyEnabled(true);
                break;

            case "draconic ancestry":
                if (draconicAncestryValue) {
                    const draconicAncestry = draconicAncestryData.find(item => item.dragon === draconicAncestryValue);
                    if (draconicAncestry) {
                        setDraconicAncestry(draconicAncestry);
                    }
                }
                break;

            case "breath weapon":
                setBreathWeaponEnabled(true);
                break;

            // Artificer
            case "magical tinkering":
                setMagicalTinkeringEnabled(true);
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;

            case "infuse item":
                setInfuseItemEnabled(true);
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;

            case "artificer specialist":
                if (specialistValue) {
                    setSubclass(specialistValue);
                }
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;

            // Barbarian
            case "primal path":
                if (primalPathValue) {
                    setSubclass(primalPathValue);
                }
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;
            case "primal knowledge":
                setPrimalKnowledgeEnabled(true);
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                setUnusedSkillPoints(unusedSkillPoints + 2);
                if (statsData.level >= 10) {
                    setPrimalKnowledgeEnabledAgain(true);
                }
                break;
            case "primal champion":
                setPrimalChampionEnabled(true);
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;

            // Bard
            case "bardic inspiration":
                setBardicInspirationEnabled(true);
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;
            case "bard college":
                if (bardCollegeValue) {
                    setSubclass(bardCollegeValue);
                }
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;
            case "expertise":
                setExpertiseEnabled(true);
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                setUnusedSkillPoints(unusedSkillPoints + 2);
                if (statsData.level >= 10) {
                    setExpertiseEnabledAgain(true);
                }
                break;
            case "font of inspiration":
                setFontOfInspirationEnabled(true);
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;
            case "countercharm":
                setCountercharmEnabled(true);
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;
            // Cleric
            case "divine domain":
                if (divineDomainValue) {
                    setSubclass(divineDomainValue);
                }
                if (arcaneMasteryValue1 && arcaneMasteryValue2 && arcaneMasteryValue3 && arcaneMasteryValue4) {
                    setArcaneMasteryEnabled(true);
                    setArcaneMasterySpellsLearned([arcaneMasteryValue1, arcaneMasteryValue2, arcaneMasteryValue3, arcaneMasteryValue4]);
                }
                if (reaperValue && !deathDomainEnabled && subclass === 'death') {
                    setDeathDomainEnabled(true);
                    setReaperCantripLearned(reaperValue);
                }
                if (blessingsOfKnowledgeValue1 && blessingsOfKnowledgeValue2 && !blessingsOfKnowledgeEnabled && subclass === 'knowledge') {
                    setBlessingsOfKnowledgeEnabled(true);
                    setBlessingsOfKnowledgeSkillsLearned([blessingsOfKnowledgeValue1, blessingsOfKnowledgeValue2]);
                }
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;
            case "channel divinity":
                setChannelDivinityEnabled(true);
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;
            // Druid
            case "wild shape":
                setWildShapeEnabled(true);
                setClassFeatDescriptionModalVisible(false);
                setSelectedFeat(null);
                break;
        }
    }

    const renderArtificerInfusionDropdown = () => {
        // Recursive function to render nested JSON content
        const renderNestedContent = (content: any, depth: number = 0) => {
            if (!content) return null;
            if (Array.isArray(content)) {
                return content.map((item, index) => (
                    <View key={index} style={{ marginLeft: depth * 10 }}>
                        {typeof item === 'object'
                            ? renderNestedContent(item, depth + 1)
                            : <Text>• {item}</Text>
                        }
                    </View>
                ));
            }
            if (typeof content === 'object') {
                return Object.entries(content).map(([key, value]) => (
                    <View key={key} style={{ marginBottom: 5, marginLeft: depth * 10 }}>
                        <Text style={{ fontWeight: depth === 0 ? 'bold' : '500', textTransform: 'capitalize' }}>
                            {depth > 0 && '• '}{key}:
                        </Text>
                        {typeof value === 'object'
                            ? renderNestedContent(value, depth + 1)
                            : <Text>{String(value)}</Text>
                        }
                    </View>
                ));
            }
            return <Text>{String(content)}</Text>;
        };
        return (
            <View style={{
                paddingVertical: 10,
                zIndex: 2000,
            }}>
                <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center', zIndex: 2000 }}>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>{infusionsLearned.length}/{INFUSIONS_CREDITS}</Text>
                    <DropDownPicker
                        items={artificerInfusionsData
                            .filter(item => !infusionsLearned.includes(item.name.toLowerCase()))
                            .map(item => ({
                                label: item.name,
                                value: item.name.toLowerCase()
                            }))}
                        value={infusionValue}
                        setValue={setInfusionValue}
                        open={infusionModalVisible}
                        setOpen={setInfusionModalVisible}
                        placeholder="Select an infusion"
                        dropDownContainerStyle={{ backgroundColor: 'white', zIndex: 2000 }}
                        containerStyle={{ flex: 1 }}
                        disabled={infusionsLearned.length === INFUSIONS_CREDITS}
                        style={{ opacity: infusionsLearned.length === INFUSIONS_CREDITS ? 0.2 : 1 }}
                    />
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'black',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 8,
                            opacity: infusionsLearned.length === INFUSIONS_CREDITS ? 0.2 : 1
                        }}
                        onPress={() => {
                            // add item to array of infusions learned
                            if (infusionValue) {
                                setInfusionsLearned([...infusionsLearned, infusionValue]);
                                setInfusionValue(null); // Reset the selected value
                            }
                        }}
                        disabled={!infusionValue || infusionsLearned.length === INFUSIONS_CREDITS}
                    >
                        <Text style={{ color: 'white' }}>Select</Text>
                    </TouchableOpacity>
                </View>


                {/* Render the selected infusions */}
                {infusionsLearned.length > 0 && (
                    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        {infusionsLearned.map(infusion => (
                            <View key={infusion} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                <Text style={{ fontWeight: 'bold' }}>{infusion.charAt(0).toUpperCase() + infusion.slice(1)}</Text>
                                <TouchableOpacity onPress={() => setInfusionsLearned(infusionsLearned.filter(i => i !== infusion))}>
                                    <Ionicons name="remove-circle" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}



                <ScrollView style={{
                    height: infusionValue ? '40%' : 0,
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor: infusionValue ? 'black' : 'transparent'
                }}>
                    {infusionValue && artificerInfusionsData
                        .filter(infusion => infusion.name.toLowerCase() === infusionValue)
                        .map(infusion => (
                            <View key={infusion.name} style={{ marginTop: 10, paddingHorizontal: 10 }}>
                                {renderNestedContent(
                                    Object.fromEntries(
                                        Object.entries(infusion).filter(([key]) => key !== 'id')
                                    )
                                )}
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        );
    }

    const renderArtificerSpecialistDropdown = () => {
        return (
            <View style={{ zIndex: 2000, maxHeight: '50%', paddingVertical: 10 }}>
                <View style={{ zIndex: 2000 }}>
                    <Text>Specialist</Text>
                    <DropDownPicker
                        items={artificerSpecialistData.map(item => ({
                            label: item.name,
                            value: item.name.toLowerCase()
                        }))}
                        value={specialistValue}
                        setValue={setSpecialistValue}
                        open={specialistModalVisible}
                        setOpen={setSpecialistModalVisible}
                        placeholder="Select a specialist"
                    />
                </View>
                <ScrollView style={{ zIndex: 1000, paddingVertical: specialistValue ? 10 : 0 }}>
                    {/* render description */}
                    <Text>
                        {specialistValue && artificerSpecialistData.find(item => item.name.toLowerCase() === specialistValue.toLowerCase())?.description}
                    </Text>
                </ScrollView>
            </View>
        );
    }

    const renderSubclassFeatures = (subClassButtonName: string) => {
        // artificer specialist
        if (subClassButtonName.toLowerCase() === 'artificer specialist') {
            return (
                <View>
                    <Text style={{ textTransform: 'capitalize' }}>Subclass: {subclass}</Text>
                    {subclass === 'alchemist' && renderAlchemistFeatures()}
                    {subclass === 'armorer' && renderArmorerFeatures()}
                    {subclass === 'artillerist' && renderArtilleristFeatures()}
                    {subclass === 'battle smith' && renderBattlesmithFeatures()}
                </View>
            );
        }
        // barbarian primal path
        if (subClassButtonName.toLowerCase() === 'primal path') {
            return (
                <View>
                    <Text>Subclass: {subclass}</Text>
                    {subclass && renderBarbarianSubclassFeatures(subclass)}
                </View>
            );
        }
        // bard subclass
        if (subClassButtonName.toLowerCase() === 'bard college') {
            return (
                <View>
                    <Text>Subclass: {subclass}</Text>
                    {subclass && renderBardSubclassFeatures(subclass)}
                </View>
            );
        }
        // cleric subclass
        if (subClassButtonName.toLowerCase() === 'divine domain') {
            return (
                <View>
                    <Text>Subclass: {subclass}</Text>
                    {subclass && renderClericSubclassFeatures(subclass)}
                </View>
            );
        }
        return null;
    }

    const renderAlchemistFeatures = () => {
        return (
            <View>
                <Text>Alchemist</Text>
                {Object.entries(alchemistData).map(([key, value]) => {
                    // Skip the name property since it's not a feature
                    if (key === 'name') return null;
                    // Only render if the feature's level requirement is met
                    if (typeof value === 'object' && 'level' in value && statsData.level >= value.level) {
                        return (
                            <View key={key} style={{ marginVertical: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{key}</Text>
                                <Text>{value.description}</Text>

                                {/* Handle spellsByLevel */}
                                {'spellsByLevel' in value && (
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ fontStyle: 'italic' }}>Spells:</Text>
                                        {Object.entries(value.spellsByLevel).map(([level, spells]) => (
                                            <Text key={level}>Level {level}: {spells.join(', ')}</Text>
                                        ))}
                                    </View>
                                )}

                                {/* Handle additionalDetails */}
                                {'additionalDetails' in value && value.additionalDetails.map((detail, index) => (
                                    <Text key={index} style={{ marginTop: 5 }}>{detail}</Text>
                                ))}

                                {/* Handle benefits */}
                                {'benefits' in value && value.benefits.map((benefit, index) => (
                                    <Text key={index} style={{ marginTop: 5 }}>• {benefit}</Text>
                                ))}

                                {/* Handle elixirTable */}
                                {'elixirTable' in value && (
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ fontStyle: 'italic' }}>Elixir Effects:</Text>
                                        {Object.entries(value.elixirTable).map(([roll, elixir]) => (
                                            <Text key={roll}>
                                                Roll {roll} - {elixir.name}: {elixir.effect}
                                            </Text>
                                        ))}
                                    </View>
                                )}
                            </View>
                        );
                    }
                    return null;
                })}
            </View>
        );
    }

    const renderArmorerFeatures = () => {
        return (
            <View>
                <Text>Armorer</Text>
                {Object.entries(armorerData).map(([key, value]) => {
                    // Skip the name property since it's not a feature
                    if (key === 'name') return null;
                    // Only render if the feature's level requirement is met
                    if (typeof value === 'object' && value && 'level' in value && statsData.level >= value.level) {
                        return (
                            <View key={key} style={{ marginVertical: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{key}</Text>
                                <Text>{value.description}</Text>
                                {/* Handle spellsByLevel */}
                                {'spellsByLevel' in value && (
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ fontStyle: 'italic' }}>Spells:</Text>
                                        {Object.entries(value.spellsByLevel).map(([level, spells]) => (
                                            <Text key={level}>Level {level}: {(spells as string[]).join(', ')}</Text>
                                        ))}
                                    </View>
                                )}
                                {/* Handle benefits */}
                                {'benefits' in value && value.benefits.map((benefit: string, index: number) => (
                                    <Text key={index} style={{ marginTop: 5 }}>• {benefit}</Text>
                                ))}
                                {/* Handle armor models */}
                                {'models' in value && (
                                    <View style={{ marginTop: 5 }}>
                                        {Object.entries(value.models).map(([modelName, model]) => {
                                            if (!model) return null;
                                            const typedModel = model as { name: string; description: string; features: Record<string, { name: string; description: string }> };
                                            return (
                                                <View key={modelName} style={{ marginTop: 10 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>{typedModel.name}</Text>
                                                    <Text>{typedModel.description}</Text>
                                                    {typedModel.features && Object.entries(typedModel.features).map(([featureName, feature]) => (
                                                        <View key={featureName} style={{ marginTop: 5 }}>
                                                            <Text style={{ fontStyle: 'italic' }}>{feature.name}:</Text>
                                                            <Text>{feature.description}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                        );
                    }
                    return null;
                })}
            </View>
        );
    };

    const renderArtilleristFeatures = () => {
        return (
            <View>
                <Text>Artillerist</Text>
                {Object.entries(artilleristData).map(([key, value]) => {
                    // Skip the name property since it's not a feature
                    if (key === 'name') return null;
                    // Only render if the feature's level requirement is met
                    if (typeof value === 'object' && 'level' in value && statsData.level >= value.level) {
                        return (
                            <View key={key} style={{ marginVertical: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{key}</Text>
                                <Text>{value.description}</Text>

                                {/* Handle spellsByLevel */}
                                {'spellsByLevel' in value && (
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ fontStyle: 'italic' }}>Spells:</Text>
                                        {Object.entries(value.spellsByLevel).map(([level, spells]) => (
                                            <Text key={level}>Level {level}: {spells.join(', ')}</Text>
                                        ))}
                                    </View>
                                )}

                                {/* Handle rules */}
                                {'rules' in value && value.rules.map((rule, index) => (
                                    <Text key={index} style={{ marginTop: 5 }}>• {rule}</Text>
                                ))}

                                {/* Handle cannonTypes */}
                                {'cannonTypes' in value && (
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ fontStyle: 'italic' }}>Cannon Types:</Text>
                                        {Object.entries(value.cannonTypes).map(([type, cannon]) => (
                                            <View key={type} style={{ marginTop: 5 }}>
                                                <Text style={{ fontWeight: 'bold' }}>{cannon.name}:</Text>
                                                <Text>{cannon.effect}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {/* Handle benefits */}
                                {'benefits' in value && (
                                    typeof value.benefits === 'string' ?
                                        <Text style={{ marginTop: 5 }}>{value.benefits}</Text> :
                                        value.benefits.map((benefit, index) => (
                                            <Text key={index} style={{ marginTop: 5 }}>• {benefit}</Text>
                                        ))
                                )}
                            </View>
                        );
                    }
                    return null;
                })}
            </View>
        );
    };

    const renderBattlesmithFeatures = () => {
        return (
            <View>
                <Text>Battlesmith</Text>
                {Object.entries(battlesmithData).map(([key, value]) => {
                    // Skip the name property since it's not a feature
                    if (key === 'name') return null;
                    // Only render if the feature's level requirement is met
                    if (typeof value === 'object' && 'level' in value && statsData.level >= value.level) {
                        return (
                            <View key={key} style={{ marginVertical: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{key}</Text>
                                <Text>{value.description}</Text>

                                {/* Handle spellsByLevel */}
                                {'spellsByLevel' in value && (
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ fontStyle: 'italic' }}>Spells:</Text>
                                        {Object.entries(value.spellsByLevel).map(([level, spells]) => (
                                            <Text key={level}>Level {level}: {spells.join(', ')}</Text>
                                        ))}
                                    </View>
                                )}

                                {/* Handle rules */}
                                {'rules' in value && value.rules.map((rule, index) => (
                                    <Text key={index} style={{ marginTop: 5 }}>• {rule}</Text>
                                ))}

                                {/* Handle stats */}
                                {'stats' in value && (
                                    <View style={{ marginTop: 5 }}>
                                        <Text>Size: {value.stats.size}</Text>
                                        <Text>Armor Class: {value.stats.armorClass}</Text>
                                        <Text>Hit Points: {value.stats.hitPoints}</Text>
                                        <Text>Speed: {value.stats.speed}</Text>
                                        <Text style={{ fontStyle: 'italic' }}>Abilities:</Text>
                                        {Object.entries(value.stats.abilities).map(([ability, score]) => (
                                            <Text key={ability}>{ability.toUpperCase()}: {score}</Text>
                                        ))}
                                        <Text style={{ fontStyle: 'italic' }}>Saving Throws:</Text>
                                        {value.stats.savingThrows.map((save, index) => (
                                            <Text key={index}>• {save}</Text>
                                        ))}
                                        <Text style={{ fontStyle: 'italic' }}>Skills:</Text>
                                        {value.stats.skills.map((skill, index) => (
                                            <Text key={index}>• {skill}</Text>
                                        ))}
                                        <Text>Damage Immunities: {value.stats.damageImmunities.join(', ')}</Text>
                                        <Text>Condition Immunities: {value.stats.conditionImmunities.join(', ')}</Text>
                                        <Text>Senses: {value.stats.senses.join(', ')}</Text>
                                        <Text>Languages: {value.stats.languages}</Text>
                                    </View>
                                )}

                                {/* Handle benefits */}
                                {'benefits' in value && value.benefits.map((benefit, index) => (
                                    <Text key={index} style={{ marginTop: 5 }}>• {benefit}</Text>
                                ))}

                                {/* Handle effects */}
                                {'effects' in value && value.effects.map((effect, index) => (
                                    <Text key={index} style={{ marginTop: 5 }}>• {effect}</Text>
                                ))}

                                {/* Handle improvements */}
                                {'improvements' in value && value.improvements.map((improvement, index) => (
                                    <Text key={index} style={{ marginTop: 5 }}>• {improvement}</Text>
                                ))}
                            </View>
                        );
                    }
                    return null;
                })}
            </View>
        );
    };


    // Render Primal Path Dropdown Subclass Options
    const renderPrimalPathDropdown = () => {
        return (
            <View>
                <Text>Primal Path</Text>
                <DropDownPicker
                    items={primalPathData.map(item => ({
                        label: item.name,
                        value: item.id
                    }))}
                    open={primalPathOpen}
                    setOpen={setPrimalPathOpen}
                    value={primalPathValue}
                    setValue={setPrimalPathValue}
                    placeholder="Select a Primal Path"
                />
            </View>
        );
    };

    const renderPrimalPathDescription = () => {
        return (
            <View>
                <Text>{primalPathData.find(item => item.id === primalPathValue)?.description}</Text>
            </View>
        );
    };

    const renderBarbarianSubclassFeatures = (subclassId: string) => {
        // Get the appropriate data based on subclass
        const getSubclassData = (id: string) => {
            switch (id) {
                case 'ancestral guardian':
                    return ancestralGuardianData;
                case 'battlerager':
                    return battleragerData;
                case 'beast':
                    return beastData;
                case 'berserker':
                    return berserkerData;
                case 'giant':
                    return giantData;
                case 'storm herald':
                    return stormHeraldData;
                case 'totem warrior':
                    return totemWarriorData;
                case 'wild magic':
                    return wildMagicData;
                case 'zealot':
                    return zealotData;
                default:
                    return null;
            }
        };

        const subclassData = getSubclassData(subclassId);
        const subclassInfo = primalPathData.find(path => path.id === subclassId);

        if (!subclassData || !subclassInfo) return null;

        return (
            <View>
                <Text style={{ textTransform: 'capitalize' }}>{subclassId.replace('-', ' ')}</Text>
                <Text style={{ marginVertical: 10 }}>{subclassInfo.description}</Text>
                {Object.entries(subclassData).map(([key, value]) => {
                    // Skip the name property since it's not a feature
                    if (key === 'name') return null;
                    // Only render if the feature's level requirement is met
                    if (typeof value === 'object' && 'level' in value && statsData.level >= value.level) {
                        return (
                            <View key={key} style={{ marginVertical: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{key}</Text>
                                <Text>{value.description}</Text>
                                {/* Handle improvements if they exist */}
                                {'improvements' in value && Array.isArray(value.improvements) && value.improvements.map((improvement: string, index: number) => (
                                    <Text key={index} style={{ marginTop: 5 }}>• {improvement}</Text>
                                ))}

                                {/* Handle additionalDetails if they exist */}
                                {'additionalDetails' in value && value.additionalDetails?.map((detail, index) => (
                                    <Text key={index} style={{ marginTop: 5 }}>• {detail}</Text>
                                ))}
                            </View>
                        );
                    }
                    return null;
                })}
            </View>
        );
    };

    // Render Bard College Dropdown Subclass Options
    const renderBardCollegeDropdown = () => {
        return (
            <View>
                <Text>Bard College</Text>
                <DropDownPicker
                    items={bardCollegeData.map(item => ({
                        label: item.name,
                        value: item.id
                    }))}
                    open={bardCollegeOpen}
                    setOpen={setBardCollegeOpen}
                    value={bardCollegeValue}
                    setValue={setBardCollegeValue}
                    placeholder="Select a Bard College"
                />
            </View>
        );
    };

    const renderBardCollegeDescription = () => {
        return (
            <View>
                <Text>{bardCollegeData.find(item => item.id === bardCollegeValue)?.description}</Text>
            </View>
        );
    };

    const renderBardSubclassFeatures = (subclassId: string) => {
        // Get the appropriate data based on subclass
        const getSubclassData = (id: string) => {
            switch (id) {
                case 'creation':
                    return creationData;
                case 'eloquence':
                    return eloquenceData;
                case 'glamour':
                    return glamourData;
                case 'lore':
                    return loreData;
                case 'spirits':
                    return spiritsData;
                case 'swords':
                    return swordsData;
                case 'valor':
                    return valorData;
                case 'whispers':
                    return whispersData;
                default:
                    return null;
            }
        };

        const subclassData = getSubclassData(subclassId);
        const subclassInfo = bardCollegeData.find(college => college.id === subclassId);

        if (!subclassData || !subclassInfo) return null;

        const renderNestedObject = (obj: any, depth: number = 0) => {
            return Object.entries(obj).map(([key, value]) => {
                if (typeof value === 'string' || typeof value === 'number') {
                    return (
                        <Text key={key} style={{ marginLeft: depth * 10, marginTop: 5 }}>
                            {depth > 0 && '• '}{key !== 'description' && `${key}: `}{value}
                        </Text>
                    );
                } else if (Array.isArray(value)) {
                    return (
                        <View key={key} style={{ marginLeft: depth * 10 }}>
                            <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{key}:</Text>
                            {value.map((item, index) => (
                                <Text key={index} style={{ marginTop: 5, marginLeft: 10 }}>
                                    • {item}
                                </Text>
                            ))}
                        </View>
                    );
                } else if (typeof value === 'object' && value !== null) {
                    return (
                        <View key={key} style={{ marginLeft: depth * 10, marginTop: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>{key}:</Text>
                            {renderNestedObject(value, depth + 1)}
                        </View>
                    );
                }
                return null;
            });
        };

        return (
            <View>
                <Text style={{ textTransform: 'capitalize' }}>{subclassId.replace('-', ' ')}</Text>
                <Text style={{ marginVertical: 10 }}>{subclassInfo.description}</Text>
                {Object.entries(subclassData).map(([key, value]) => {
                    if (key === 'name') return null;
                    if (typeof value === 'object' && 'level' in value && statsData.level >= value.level) {
                        return (
                            <View key={key} style={{ marginVertical: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{key}</Text>
                                {renderNestedObject(value)}
                            </View>
                        );
                    }
                    return null;
                })}
            </View>
        );
    };
    const renderDivineDomainDropdown = () => {
        return (
            <View>
                <Text>Divine Domain</Text>
                <DropDownPicker
                    items={divineDomainData.map(item => ({
                        label: item.name,
                        value: item.id
                    }))}
                    open={divineDomainOpen}
                    setOpen={setDivineDomainOpen}
                    value={divineDomainValue}
                    setValue={setDivineDomainValue}
                    placeholder="Select a Divine Domain"
                />
            </View>
        );
    };

    const renderDivineDomainDescription = () => {
        return (
            <View>
                <Text>{divineDomainData.find(item => item.id === divineDomainValue)?.description}</Text>
            </View>
        );
    };

    const renderClericSubclassFeatures = (subclassId: string) => {
        // Get the appropriate data based on subclass
        const getSubclassData = (id: string) => {
            switch (id) {
                case 'arcana':
                    return arcanaData;
                case 'death':
                    return deathData;
                case 'forge':
                    return forgeData;
                case 'grave':
                    return graveData;
                case 'knowledge':
                    return knowledgeData;
                case 'life':
                    return lifeData;
                case 'light':
                    return lightData;
                case 'nature':
                    return natureData;
                case 'order':
                    return orderData;
                case 'peace':
                    return peaceData;
                case 'tempest':
                    return tempestData;
                case 'trickery':
                    return trickeryData;
                case 'twilight':
                    return twilightData;
                case 'war':
                    return warData;
                // Add other cleric domains here
                default:
                    return null;
            }
        };

        const subclassData = getSubclassData(subclassId);
        const subclassInfo = divineDomainData.find(domain => domain.id === subclassId);

        if (!subclassData || !subclassInfo) return null;

        const renderNestedObject = (obj: any, depth: number = 0) => {
            return Object.entries(obj).map(([key, value]) => {
                if (typeof value === 'string' || typeof value === 'number') {
                    return (
                        <Text key={key} style={{ marginLeft: depth * 10, marginTop: 5 }}>
                            {depth > 0 && '• '}{key !== 'description' && `${key}: `}{value}
                        </Text>
                    );
                } else if (Array.isArray(value)) {
                    return (
                        <View key={key} style={{ marginLeft: depth * 10 }}>
                            <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{key}:</Text>
                            {value.map((item, index) => (
                                <Text key={index} style={{ marginTop: 5, marginLeft: 10 }}>
                                    • {item}
                                </Text>
                            ))}
                        </View>
                    );
                } else if (typeof value === 'object' && value !== null) {
                    return (
                        <View key={key} style={{ marginLeft: depth * 10, marginTop: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>{key}:</Text>
                            {renderNestedObject(value, depth + 1)}
                        </View>
                    );
                }
                return null;
            });
        };

        return (
            <View>
                <Text style={{ textTransform: 'capitalize' }}>{subclassId.replace('-', ' ')}</Text>
                <Text style={{ marginVertical: 10 }}>{subclassInfo.description}</Text>
                {Object.entries(subclassData).map(([key, value]) => {
                    if (key === 'name') return null;
                    if (typeof value === 'object' && 'level' in value && statsData.level >= value.level) {
                        return (
                            <View key={key} style={{ marginVertical: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{key}</Text>
                                {renderNestedObject(value)}
                            </View>
                        );
                    }
                    return null;
                })}
            </View>
        );
    };




    const renderArcaneInitiateDropdown = () => {
        // Only render if subclass is "arcana"
        if (subclass?.toLowerCase() !== "arcana") {
            return null;
        }

        // Recursive function to render nested JSON content
        const renderNestedContent = (content: any, depth: number = 0) => {
            if (!content) return null;
            if (Array.isArray(content)) {
                return content.map((item, index) => (
                    <View key={index} style={{ marginLeft: depth * 10 }}>
                        {typeof item === 'object'
                            ? renderNestedContent(item, depth + 1)
                            : <Text>• {item}</Text>
                        }
                    </View>
                ));
            }
            if (typeof content === 'object') {
                return Object.entries(content).map(([key, value]) => (
                    <View key={key} style={{ marginBottom: 5, marginLeft: depth * 10 }}>
                        <Text style={{ fontWeight: depth === 0 ? 'bold' : '500', textTransform: 'capitalize' }}>
                            {depth > 0 && '• '}{key}:
                        </Text>
                        {typeof value === 'object'
                            ? renderNestedContent(value, depth + 1)
                            : <Text>{String(value)}</Text>
                        }
                    </View>
                ));
            }
            return <Text>{String(content)}</Text>;
        };

        const wizardCantrips = cantripsData.filter((value): boolean => {
            return value?.classes?.includes("Wizard") ?? false;
        });

        return (
            <View style={{
                paddingVertical: 10,
                zIndex: 2000,
            }}>
                <View style={{ flexDirection: 'column', gap: 10, justifyContent: 'space-between', alignItems: 'center', zIndex: 2000 }}>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>Arcane Initiate Cantrips ({arcaneInitiateCantrips.length}/2)</Text>
                    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center', zIndex: 2000 }}>

                        <DropDownPicker
                            items={wizardCantrips
                                .filter((item) => !arcaneInitiateCantrips.includes(item.name))
                                .map((item) => ({
                                    label: item.name,
                                    value: item.name
                                }))}
                            value={arcaneInitiateValue}
                            setValue={setArcaneInitiateValue}
                            open={arcaneInitiateModalVisible}
                            setOpen={setArcaneInitiateModalVisible}
                            placeholder="Select a wizard cantrip"
                            dropDownContainerStyle={{ backgroundColor: 'white', zIndex: 2000 }}
                            containerStyle={{ flex: 1 }}
                            disabled={arcaneInitiateCantrips.length === 2}
                            style={{ opacity: arcaneInitiateCantrips.length === 2 ? 0.2 : 1 }}
                        />
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'black',
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderRadius: 8,
                                opacity: arcaneInitiateCantrips.length === 2 ? 0.2 : 1
                            }}
                            onPress={() => {
                                if (arcaneInitiateValue) {
                                    setArcaneInitiateCantrips([...arcaneInitiateCantrips, arcaneInitiateValue]);
                                    setArcaneInitiateValue(null);
                                }
                            }}
                            disabled={!arcaneInitiateValue || arcaneInitiateCantrips.length === 2}
                        >
                            <Text style={{ color: 'white' }}>Select</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {arcaneInitiateCantrips.length > 0 && (
                    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        {arcaneInitiateCantrips.map(cantrip => (
                            <View key={cantrip} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                <Text style={{ fontWeight: 'bold' }}>{cantrip}</Text>
                                <TouchableOpacity onPress={() => setArcaneInitiateCantrips(arcaneInitiateCantrips.filter(c => c !== cantrip))}>
                                    <Ionicons name="remove-circle" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <ScrollView style={{
                    height: arcaneInitiateValue ? '40%' : 0,
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor: arcaneInitiateValue ? 'black' : 'transparent'
                }}>
                    {arcaneInitiateValue && wizardCantrips
                        .filter((cantrip) => cantrip.name === arcaneInitiateValue)
                        .map((cantrip) => (
                            <View key={cantrip.name} style={{ marginTop: 10, paddingHorizontal: 10 }}>
                                {renderNestedContent(
                                    Object.fromEntries(
                                        Object.entries(cantrip).filter(([key]) => key !== 'id')
                                    )
                                )}
                            </View>
                        ))
                    }
                </ScrollView>

                {arcaneInitiateCantrips.length === 2 && (
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'green',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 8,
                            marginTop: 10,
                            alignSelf: 'center'
                        }}
                        onPress={() => {
                            setArcaneInitiateEnabled(true);
                            setFeaturesModalVisible(false);
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirm Cantrips</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderArcaneMasteryDropdown = () => {

        const getAllWizardSpells = (level: number) => {
            return spellsData
                .find(group => group.level === level)?.spells
                .filter((spell: any) => {
                    if (typeof spell === 'string') {
                        return false;
                    }
                    return spell.classes?.includes("Wizard");
                }) || [];
        };

        const wizardSpells6 = getAllWizardSpells(6);
        const wizardSpells7 = getAllWizardSpells(7);
        const wizardSpells8 = getAllWizardSpells(8);
        const wizardSpells9 = getAllWizardSpells(9);

        return (
            <View>
                <Text>Arcane Mastery</Text>
                <Text>SpLv6</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            backgroundColor: 'black',
                            borderRadius: 8,
                            borderWidth: 1,
                            opacity: !arcaneMasteryValue1 ? 0.1 : 1,
                        }}
                        onPress={() => {
                            setClassFeatDescriptionModalVisible(false);
                            setDarkModalVisible(true);
                            setSelectedSpell(arcaneMasteryValue1);
                        }}
                        disabled={!arcaneMasteryValue1}
                    >
                        <Text style={{ color: 'white' }}>read</Text>
                    </TouchableOpacity>
                    <DropDownPicker
                        items={wizardSpells6.map((spell) => ({
                            label: typeof spell === 'string' ? spell : spell.name,
                            value: typeof spell === 'string' ? spell : spell.name
                        }))}
                        value={!arcaneMasteryEnabled ? arcaneMasteryValue1 : null}
                        setValue={setArcaneMasteryValue1}
                        open={arcaneMasteryModalVisible1}
                        setOpen={setArcaneMasteryModalVisible1}
                        placeholder="Select a spell"
                        zIndex={4000}
                        containerStyle={{ flex: 1 }}
                    />
                </View>

                <Text>SpLv7</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            backgroundColor: 'black',
                            borderRadius: 8,
                            borderWidth: 1,
                            opacity: !arcaneMasteryValue2 ? 0.1 : 1,
                        }}
                        onPress={() => {
                            setClassFeatDescriptionModalVisible(false);
                            setDarkModalVisible(true);
                            setSelectedSpell(arcaneMasteryValue2);
                        }}
                        disabled={!arcaneMasteryValue2}
                    >
                        <Text style={{ color: 'white' }}>read</Text>
                    </TouchableOpacity>
                    <DropDownPicker
                        items={wizardSpells7.map((spell) => ({
                            label: typeof spell === 'string' ? spell : spell.name,
                            value: typeof spell === 'string' ? spell : spell.name
                        }))}
                        value={!arcaneMasteryEnabled ? arcaneMasteryValue2 : null}
                        setValue={setArcaneMasteryValue2}
                        open={arcaneMasteryModalVisible2}
                        setOpen={setArcaneMasteryModalVisible2}
                        placeholder="Select a spell"
                        zIndex={3000}
                        containerStyle={{ flex: 1 }}
                    />
                </View>

                <Text>SpLv8</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            backgroundColor: 'black',
                            borderRadius: 8,
                            borderWidth: 1,
                            opacity: !arcaneMasteryValue3 ? 0.1 : 1,
                        }}
                        onPress={() => {
                            setClassFeatDescriptionModalVisible(false);
                            setDarkModalVisible(true);
                            setSelectedSpell(arcaneMasteryValue3);
                        }}
                        disabled={!arcaneMasteryValue3}
                    >
                        <Text style={{ color: 'white' }}>read</Text>
                    </TouchableOpacity>
                    <DropDownPicker
                        items={wizardSpells8.map((spell) => ({
                            label: typeof spell === 'string' ? spell : spell.name,
                            value: typeof spell === 'string' ? spell : spell.name
                        }))}
                        value={!arcaneMasteryEnabled ? arcaneMasteryValue3 : null}
                        setValue={setArcaneMasteryValue3}
                        open={arcaneMasteryModalVisible3}
                        setOpen={setArcaneMasteryModalVisible3}
                        placeholder="Select a spell"
                        zIndex={2000}
                        containerStyle={{ flex: 1 }}
                    />
                </View>

                <Text>SpLv9</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            backgroundColor: 'black',
                            borderRadius: 8,
                            borderWidth: 1,
                            opacity: !arcaneMasteryValue4 ? 0.1 : 1,
                        }}
                        onPress={() => {
                            setClassFeatDescriptionModalVisible(false);
                            setDarkModalVisible(true);
                            setSelectedSpell(arcaneMasteryValue4);
                        }}
                        disabled={!arcaneMasteryValue4}
                    >
                        <Text style={{ color: 'white' }}>read</Text>
                    </TouchableOpacity>
                    <DropDownPicker
                        items={wizardSpells9.map((spell) => ({
                            label: typeof spell === 'string' ? spell : spell.name,
                            value: typeof spell === 'string' ? spell : spell.name
                        }))}
                        value={!arcaneMasteryEnabled ? arcaneMasteryValue4 : null}
                        setValue={setArcaneMasteryValue4}
                        open={arcaneMasteryModalVisible4}
                        setOpen={setArcaneMasteryModalVisible4}
                        placeholder="Select a spell"
                        zIndex={1000}
                        containerStyle={{ flex: 1 }}
                    />
                </View>
            </View>
        );
    };


    const renderSpellDetails = () => {
        const renderValue = (value: any, depth = 0): React.ReactNode => {
            if (depth > 5) return null;

            if (typeof value === 'string' || typeof value === 'number') {
                return <Text style={{ color: 'white' }}>{value}</Text>;
            }

            if (Array.isArray(value)) {
                return value.map((item, index) => (
                    <View key={index} style={{ marginLeft: 20 }}>
                        {renderValue(item, depth + 1)}
                    </View>
                ));
            }

            if (typeof value === 'object' && value !== null) {
                return Object.entries(value).map(([key, val]) => (
                    <View key={key} style={{ marginLeft: 20 }}>
                        <Text style={{ color: 'white' }}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Text>
                        {renderValue(val, depth + 1)}
                    </View>
                ));
            }

            return null;
        };

        return (
            <ScrollView style={{ padding: 20 }}>
                {spellsData.map(levelData => {
                    const foundSpell = levelData.spells.find(
                        spell => {
                            if (typeof spell === 'string') return false;
                            return spell.name.toLowerCase() === selectedSpell?.toLowerCase();
                        }
                    );

                    if (foundSpell && typeof foundSpell !== 'string') {
                        return Object.entries(foundSpell).map(([key, value]) => {
                            if (key === 'id') return null;
                            return (
                                <View key={key} style={{ marginBottom: 15 }}>
                                    <Text style={{ color: 'white' }}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </Text>
                                    {renderValue(value)}
                                </View>
                            );
                        });
                    }
                    return null;
                })}
            </ScrollView>
        );
    };

    const renderDeathDomainDropdown = () => {
        const necromancyCantrips = cantripsData.filter(cantrip => cantrip.school.toLowerCase() === "necromancy").map(cantrip => ({
            label: cantrip.name,
            value: cantrip.name
        }));

        // Recursive function to render nested content
        const renderNestedContent = (content: any, depth: number = 0) => {
            if (!content) return null;
            if (Array.isArray(content)) {
                return content.map((item, index) => (
                    <View key={index} style={{ marginLeft: depth * 10 }}>
                        {typeof item === 'object'
                            ? renderNestedContent(item, depth + 1)
                            : <Text style={{ color: 'black' }}>• {item}</Text>
                        }
                    </View>
                ));
            }
            if (typeof content === 'object') {
                return Object.entries(content)
                    .filter(([_, value]) => value !== null)
                    .map(([key, value]) => (
                        <View key={key} style={{ marginBottom: 5, marginLeft: depth * 10 }}>
                            <Text style={{ color: 'black', fontWeight: depth === 0 ? 'bold' : '500', textTransform: 'capitalize' }}>
                                {depth > 0 && '• '}{key}:
                            </Text>
                            {typeof value === 'object'
                                ? renderNestedContent(value, depth + 1)
                                : <Text style={{ color: 'black' }}>{String(value)}</Text>
                            }
                        </View>
                    ));
            }
            return <Text style={{ color: 'black' }}>{String(content)}</Text>;
        };

        return (
            <View style={{ zIndex: 2000 }}>
                <Text style={{ color: 'black', marginBottom: 5 }}>Death Domain</Text>
                <DropDownPicker
                    open={reaperOpen}
                    value={reaperValue}
                    items={necromancyCantrips}
                    setOpen={setReaperOpen}
                    setValue={setReaperValue}
                    placeholder="Select a necromancy cantrip"
                    style={{
                        backgroundColor: 'black',
                        borderColor: 'rgba(255,255,255,0.2)',
                    }}
                    textStyle={{
                        color: 'white'
                    }}
                    dropDownContainerStyle={{
                        backgroundColor: 'black',
                        borderColor: 'rgba(255,255,255,0.2)',
                    }}
                />

                <ScrollView style={{
                    height: reaperValue ? '40%' : 0,
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor: reaperValue ? 'white' : 'transparent',
                    marginTop: 10
                }}>
                    {reaperValue && cantripsData
                        .filter((cantrip) => cantrip.name === reaperValue)
                        .map((cantrip) => (
                            <View key={cantrip.name} style={{ marginTop: 10, paddingHorizontal: 10 }}>
                                {renderNestedContent(
                                    Object.fromEntries(
                                        Object.entries(cantrip)
                                            .filter(([key]) => key !== 'id')
                                            .filter(([_, value]) => value !== null)
                                    )
                                )}
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        );
    };

    const renderBlessingsOfKnowledgeDropdown = () => {
        const knowledgeSkills = [
            { label: 'Arcana', value: 'arcana' },
            { label: 'History', value: 'history' },
            { label: 'Nature', value: 'nature' },
            { label: 'Religion', value: 'religion' }
        ];

        return (
            <View style={{ zIndex: 2000 }}>
                <Text style={{ color: 'black', marginBottom: 5 }}>Blessings of Knowledge (Choose 2)</Text>
                <DropDownPicker
                    open={blessingsOfKnowledgeOpen1}
                    value={blessingsOfKnowledgeValue1}
                    items={knowledgeSkills.filter(skill => skill.value !== blessingsOfKnowledgeValue2)}
                    setOpen={setBlessingsOfKnowledgeOpen1}
                    setValue={setBlessingsOfKnowledgeValue1}
                    placeholder="Select first knowledge skill"
                    style={{
                        backgroundColor: 'black',
                        borderColor: 'rgba(255,255,255,0.2)',
                        marginBottom: 10
                    }}
                    textStyle={{
                        color: 'white'
                    }}
                    dropDownContainerStyle={{
                        backgroundColor: 'black',
                        borderColor: 'rgba(255,255,255,0.2)',
                    }}
                    zIndex={2000}
                />
                <DropDownPicker
                    open={blessingsOfKnowledgeOpen2}
                    value={blessingsOfKnowledgeValue2}
                    items={knowledgeSkills.filter(skill => skill.value !== blessingsOfKnowledgeValue1)}
                    setOpen={setBlessingsOfKnowledgeOpen2}
                    setValue={setBlessingsOfKnowledgeValue2}
                    placeholder="Select second knowledge skill"
                    style={{
                        backgroundColor: 'black',
                        borderColor: 'rgba(255,255,255,0.2)',
                    }}
                    textStyle={{
                        color: 'white'
                    }}
                    dropDownContainerStyle={{
                        backgroundColor: 'black',
                        borderColor: 'rgba(255,255,255,0.2)',
                    }}
                    zIndex={1000}
                />
            </View>
        );
    };

    // Calculate half of the screen width
    const screenWidth = Dimensions.get('window').width;
    const section3Width = (1 / 2) * screenWidth;


    // Main Render
    return (
        <View style={styles.container}>
            {/* Section 1: Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', gap: 10, marginLeft: 10, flex: 1 }}>
                    <ImageBackground
                        source={featuresImage as ImageSourcePropType}
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            gap: 5,
                        }}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.topButton} onPress={() => setFeaturesModalVisible(true)}>
                            <MaterialIcons name="insights" size={24} color="white" />
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Features</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.userAccountButton} onPress={() => setSettingsModalVisible(true)}>
                        <Ionicons name="settings" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Section 2, 3, and 4: Main Content */}
            <View style={styles.mainContent}>



                {/* Section 3 */}
                <TouchableOpacity
                    style={{ borderWidth: 1, borderColor: 'white', borderStyle: 'solid', borderRadius: 8 }}
                    onLongPress={handleImageLongPress}
                    onPress={() => setCharacterModalVisible(true)}>
                    <View style={[styles.imageContainer, { width: section3Width, overflow: 'hidden' }]}>
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.emptyImageContainer}>
                                {!statsData.race && !statsData.class ?
                                    <>
                                        <Ionicons name="body" size={24} color="gold" />
                                        <Text style={{ color: 'gold', marginBottom: 40, marginTop: 10, fontSize: 16, textAlign: 'center' }}>
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



                {/* Section 2 */}
                <View style={styles.section2}>



                    {/* Feats */}
                    <ScrollView style={{
                        flexDirection: 'column',
                        flex: 1,
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderStyle: 'solid',
                        borderRadius: 8,
                        width: screenWidth - section3Width - 32,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                    }}>
                        {/* race features */}
                        <View style={{ gap: 5, marginBottom: 20 }}>
                            <Text style={[styles.label, { color: 'lightgrey' }]}>{statsData.race || 'Race'} Feats:</Text>
                            {(!statsData.race || raceBonuses.length === 0) && <Text style={{ color: 'lightgrey' }}>—</Text>}
                            {raceBonuses.map((race) => (
                                race.race === statsData.race && Object.entries(race.features).map(([key]) => (
                                    <View
                                        key={`race-feature-${key}`}
                                        style={{ flexDirection: 'row', alignItems: 'center', gap: 5, }}>
                                        {(
                                            (key.toLowerCase() === 'lucky' && !luckyPointsEnabled) ||
                                            (key.toLowerCase() === 'skill versatility' && !raceSkillProfGained) ||
                                            (key.toLowerCase() === 'relentless endurance' && !relentlessEnduranceGained) ||
                                            (key.toLowerCase() === 'infernal legacy' && !infernalLegacyEnabled) ||
                                            (key.toLowerCase() === 'draconic ancestry' && !draconicAncestry) ||
                                            (key.toLowerCase() === 'breath weapon' && !breathWeaponEnabled && draconicAncestry) ||
                                            (key.toLowerCase() === 'artificer specialist' && !subclass)
                                        ) && (
                                                <MaterialCommunityIcons name="alert-circle" size={16} color="gold" />
                                            )}
                                        <TouchableOpacity
                                            key={`feature-${key}`}
                                            style={{
                                                flexDirection: 'column',
                                                gap: 5,
                                                padding: 5,
                                                flexShrink: 1,
                                            }}
                                            onPress={() => {
                                                setFeatDescriptionModalVisible(true);
                                                setSelectedFeat(key);
                                            }}
                                            disabled={key.toLowerCase() === 'breath weapon' && !draconicAncestry}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>

                                                {/* Race Feats Highlighting */}
                                                <Text
                                                    key={`label-${key}`}
                                                    style={[
                                                        styles.featLabel,
                                                        {
                                                            flexShrink: 1,
                                                            flexWrap: 'wrap',
                                                            color: 'white',
                                                            borderWidth: 1,
                                                            borderColor: 'rgba(255,255,255,0.2)',
                                                            paddingVertical: 2,
                                                            paddingHorizontal: 5,
                                                            borderRadius: 4,
                                                        }
                                                    ]}
                                                >
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            ))}
                        </View>
                        {/* class features */}
                        <View style={{ gap: 5 }}>
                            <Text style={[styles.label, { color: 'lightgrey', textTransform: 'capitalize' }]}>{statsData.class || 'Class'} Feats:</Text>
                            {renderClassFeatures(true)}
                        </View>
                    </ScrollView>





                    <View style={{
                        flexDirection: 'row',
                        gap: 10,
                    }}>



                        {equipmentItems
                            .filter((item) => item.section === 2)
                            .map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.equipmentItem}
                                    onPress={() => {
                                        setArmorModalVisible(true);
                                    }}
                                >
                                    <ImageBackground
                                        source={
                                            item.customImageUri
                                                ? { uri: item.customImageUri }
                                                : item.defaultImage
                                        }
                                        style={styles.equipmentItemImage}
                                    />
                                </TouchableOpacity>
                            ))}

                        {equipmentItems
                            .filter((item) => item.section === 4)
                            .map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.equipmentItem}
                                    onPress={() => {
                                        setShieldModalVisible(true);
                                    }}
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





            </View>

            {/* Section 5: Bottom Section */}
            <View style={styles.section5}>
                <View style={styles.meleeContainer}>
                    {/* Main Hand Weapon */}
                    <TouchableOpacity
                        style={[
                            styles.weapon,
                            mainHandWeapon?.properties?.includes("Two-handed") ? styles.twoHandedWeapon : {}
                        ]}
                        onPress={() => setMainHandModalVisible(true)}
                    >
                        {mainHandWeapon?.name && mainHandWeapon?.name !== 'none' ? (
                            (() => {
                                const weapon = weapons.find((w) => w.value === mainHandWeapon.name.toLowerCase() || '');
                                const isTwoHanded = mainHandWeapon.properties?.includes("Two-handed");
                                const isProficient = weaponsProficientIn.includes(mainHandWeapon.weaponType?.toLowerCase() || '');
                                const weaponImage = getWeaponImage(mainHandWeapon.name.toLowerCase()) as ImageSourcePropType;

                                return (
                                    <ImageBackground
                                        source={weapon && weapon.image && weapon.image !== ''
                                            ? { uri: weapon.image }
                                            : weaponImage ||
                                            equipmentItems.find((item) => item.id === 'mainMelee')?.defaultImage}
                                        style={styles.equipmentItemImage}
                                    >
                                        {(!weapon?.image || weapon.image === '' || isTwoHanded) && !weaponImage && (
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 16,
                                                textAlign: 'center'
                                            }}>{weapon?.label || mainHandWeapon.name} {!isProficient && '(Inept)'}</Text>
                                        )}
                                        {isTwoHanded && (
                                            <>
                                                <View style={styles.twoHandedLabel}>
                                                    <MaterialIcons name="sign-language" size={24} color="white" />
                                                </View>
                                            </>
                                        )}
                                    </ImageBackground>
                                );
                            })()
                        ) : (
                            <ImageBackground
                                source={equipmentItems.find((item) => item.id === 'mainMelee')?.defaultImage}
                                style={styles.equipmentItemImage}
                            />
                        )}
                    </TouchableOpacity>

                    {/* Offhand Weapon */}
                    <TouchableOpacity
                        style={[
                            styles.weapon,
                            offHandWeapon?.properties?.includes("Two-handed") ? styles.twoHandedWeapon : {}
                        ]}
                        onPress={() => setOffHandModalVisible(true)}
                    >
                        {offHandWeapon?.name && offHandWeapon?.name !== 'none' ? (
                            (() => {
                                const weapon = weapons.find((w) => w.value === offHandWeapon.name.toLowerCase() || '');
                                const isTwoHanded = offHandWeapon.properties?.includes("Two-handed");
                                const isProficient = weaponsProficientIn.includes(offHandWeapon.weaponType?.toLowerCase() || '');
                                const weaponImage = getWeaponImage(offHandWeapon.name.toLowerCase()) as ImageSourcePropType;

                                return (
                                    <ImageBackground
                                        source={weapon && weapon.image && weapon.image !== ''
                                            ? { uri: weapon.image }
                                            : weaponImage ||
                                            equipmentItems.find((item) => item.id === 'offhandMelee')?.defaultImage}
                                        style={styles.equipmentItemImage}
                                    >
                                        {(!weapon?.image || weapon.image === '' || isTwoHanded) && !weaponImage && (
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 16,
                                                textAlign: 'center'
                                            }}>{weapon?.label || offHandWeapon.name} {!isProficient && '(Inept)'}</Text>
                                        )}
                                        {isTwoHanded && (
                                            <>
                                                <View style={styles.twoHandedLabel}>
                                                    <MaterialIcons name="sign-language" size={24} color="white" />
                                                </View>
                                            </>
                                        )}
                                    </ImageBackground>
                                );
                            })()
                        ) : (
                            <ImageBackground
                                source={equipmentItems.find((item) => item.id === 'offhandMelee')?.defaultImage}
                                style={styles.equipmentItemImage}
                            />
                        )}
                    </TouchableOpacity>




                    {/* Ranged Hand Weapon */}
                    {equipmentItems
                        .filter((item) => item.section === 5 && item.id === 'mainRanged')
                        .map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.weapon,
                                    rangedHandWeapon?.properties?.includes("Two-handed") ? styles.twoHandedWeapon : {}
                                ]}
                                onPress={() => {
                                    setRangedHandModalVisible(true);
                                    setOpenRangedHandPicker(true);
                                    setRangedHandValue(rangedHandWeapon?.name?.toLowerCase() || 'none');
                                }}
                            >
                                {rangedHandWeapon?.name && rangedHandWeapon?.name.toLowerCase() !== 'none' ? (
                                    (() => {
                                        const weapon = weapons.find((w) => w.value.toLowerCase() === rangedHandWeapon.name.toLowerCase() || '');
                                        const isTwoHanded = rangedHandWeapon.properties?.includes("Two-handed");
                                        const isProficient = weaponsProficientIn.includes(rangedHandWeapon.weaponType?.toLowerCase() || '');
                                        const weaponImage = getWeaponImage(rangedHandWeapon.name.toLowerCase()) as ImageSourcePropType;

                                        return (
                                            <ImageBackground
                                                source={weapon && weapon.image && weapon.image !== ''
                                                    ? { uri: weapon.image }
                                                    : weaponImage ||
                                                    equipmentItems.find((item) => item.id === 'mainRanged')?.defaultImage}
                                                style={styles.equipmentItemImage}
                                            >
                                                {(!weapon?.image || weapon.image === '' || isTwoHanded) && !weaponImage && (
                                                    <Text style={{
                                                        color: 'white',
                                                        fontSize: 16,
                                                        textAlign: 'center'
                                                    }}>
                                                        {weapon?.label || rangedHandWeapon.name} {!isProficient && '(Inept)'}
                                                    </Text>
                                                )}
                                                {isTwoHanded && (
                                                    <>
                                                        <View style={styles.twoHandedLabel}>
                                                            <MaterialIcons name="sign-language" size={24} color="white" />
                                                        </View>
                                                    </>
                                                )}
                                            </ImageBackground>
                                        );
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
            </View>

            {/* Character Modal */}
            <Modal animationType="fade" transparent={true} visible={characterModalVisible}>
                <TouchableWithoutFeedback onPress={() => setCharacterModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContainer}>
                                {statsData.class && statsData.race && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            {isRaceConfirmed && <Text style={styles.modalLabel}>{statsData.race}</Text>}
                                            {isRaceConfirmed && isClassConfirmed && <Text style={styles.modalLabel}>,</Text>}
                                            {isClassConfirmed && <Text style={[styles.modalLabel, { textTransform: 'capitalize', marginLeft: 5 }]}>{statsData.class}</Text>}
                                        </View>
                                    </View>
                                )}
                                <View style={styles.formContainer}>
                                    <View style={[styles.modalRowContainer, { zIndex: 3000 }]}>
                                        {!isRaceConfirmed && (
                                            <>
                                                <Text style={styles.modalLabel}>Race:</Text>
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
                                                    dropDownDirection="BOTTOM"
                                                />
                                            </>
                                        )}
                                    </View>
                                    <View style={[styles.modalRowContainer, { zIndex: 2000 }]}>
                                        {!isClassConfirmed && (
                                            <>
                                                <Text style={styles.modalLabel}>Class:</Text>
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
                                            </>
                                        )}
                                    </View>
                                    {(!isRaceConfirmed && !isClassConfirmed)
                                        && (raceValue && classValue)
                                        && (
                                            <TouchableOpacity
                                                style={styles.submitButton}
                                                onPress={() => {
                                                    handleSaveRaceAndClass();
                                                    setCharacterModalVisible(false);
                                                }}
                                            >
                                                <Text style={styles.submitButtonText}>Save Changes</Text>
                                            </TouchableOpacity>
                                        )}
                                    <Button title="Close" onPress={() => setCharacterModalVisible(false)} />
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
                            <Button title="Close" onPress={() => setMainHandModalVisible(false)} />
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
                            <Button title="Close" onPress={() => setOffHandModalVisible(false)} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Ranged Hand Weapon Modal */}
            <Modal animationType="fade" transparent={true} visible={rangedHandModalVisible}>
                <View style={styles.modalContainer}>
                    <Text>Select Ranged Hand Weapon</Text>
                    <DropDownPicker
                        open={openRangedHandPicker}
                        value={rangedHandValue}
                        items={filterEquipableRangedWeapons()}
                        setOpen={setOpenRangedHandPicker}
                        setValue={setRangedHandValue}
                        placeholder="Select a weapon"
                        containerStyle={{ height: 40, width: '100%' }}
                        style={{ backgroundColor: '#fafafa' }}
                        dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                    />
                    <View style={styles.modalButtons}>
                        <Button
                            title="Close"
                            color="black"
                            onPress={() => {
                                setRangedHandModalVisible(false);
                                setRangedHandValue('none');
                                setOpenRangedHandPicker(false);
                            }}
                        />
                        {rangedHandValue.toLowerCase() !== rangedHandWeapon?.name.toLowerCase() ? (
                            <Button
                                title="Equip"
                                color="blue"
                                onPress={() => {
                                    handleEquipWeapon('rangedHand', rangedHandValue);
                                    setRangedHandModalVisible(false);
                                }}
                                disabled={rangedHandValue === 'none'}
                            />
                        ) : (
                            <Button
                                title="Unequip"
                                color="blue"
                                onPress={() => {
                                    handleEquipWeapon('rangedHand', 'none');
                                    setRangedHandModalVisible(false);
                                }}
                            />
                        )}
                    </View>
                </View>
            </Modal>

            {/* Features Modal */}
            <Modal animationType="fade" transparent={true} visible={featuresModalVisible}>
                <View style={styles.modalContainer}>
                    <ScrollView style={{ flexDirection: 'column', gap: 10, flex: 1, marginBottom: 60 }}>
                        <Text style={styles.modalTitle}>Features</Text>
                        <View style={{ flexDirection: 'column', gap: 5 }}>
                            <Text style={styles.label}>Race Features:</Text>
                            {statsData.race && renderRaceFeatures()}
                        </View>
                        <View style={{ flexDirection: 'column', gap: 5 }}>
                            <Text style={styles.label}>Class Features:</Text>
                            {statsData.class && renderClassFeatures()}
                        </View>
                    </ScrollView>
                    <View style={styles.modalButtons}>
                        <Button
                            title="Close"
                            color="black"
                            onPress={() => setFeaturesModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>


            {/* Armor Modal */}
            <Modal animationType="fade" transparent={true} visible={armorModalVisible}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text>Armor:</Text>
                                <Text style={{ textTransform: 'capitalize', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                                    {equippedArmor || '(None)'}
                                </Text>
                            </View>
                            {equippedArmor &&
                                <Button title="Unequip" onPress={() => {
                                    handleEquipArmor(null);
                                }} />
                            }
                        </View>
                        <Text style={{ marginBottom: 5 }}>Select Armor</Text>
                        <DropDownPicker
                            open={openArmorPicker}
                            value={armorValue}
                            items={getArmorFromBag()}
                            setOpen={setOpenArmorPicker}
                            setValue={setArmorValue}
                            placeholder="Select a armor"
                            containerStyle={{ height: 40, width: '100%' }}
                            style={{ backgroundColor: '#fafafa' }}
                            dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                        />



                        <View style={styles.modalButtons}>
                            <Button
                                title="Close"
                                color="black"
                                onPress={() => {
                                    setArmorValue(null);
                                    setArmorModalVisible(false);
                                    setOpenArmorPicker(false);
                                }} />
                            <Button title="Equip" onPress={() => {
                                handleEquipArmor(armorValue);
                            }} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


            {/* Shield Modal */}
            <Modal animationType="fade" transparent={true} visible={shieldModalVisible}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text>
                                    Shield:
                                </Text>
                                <Text style={{ textTransform: 'capitalize', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                                    {equippedShield || '(None)'}
                                </Text>
                            </View>
                            {equippedShield &&
                                <Button title="Unequip" onPress={() => {
                                    setEquippedShield(null);
                                }} />
                            }
                        </View>



                        <Text style={{ marginBottom: 5 }}>Select Shield</Text>
                        <DropDownPicker
                            open={openShieldPicker}
                            value={shieldValue}
                            items={getShieldFromBag()}
                            setOpen={setOpenShieldPicker}
                            setValue={setShieldValue}
                            placeholder="Select a shield"
                            containerStyle={{ height: 40, width: '100%' }}
                            style={{ backgroundColor: '#fafafa' }}
                            dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                        />
                        <View style={styles.modalButtons}>
                            <Button
                                title="Close"
                                color="black"
                                onPress={() => {
                                    setShieldValue(null);
                                    setShieldModalVisible(false);
                                    setOpenShieldPicker(false);
                                }}
                            />
                            <Button
                                title="Equip"
                                onPress={() => {
                                    setEquippedShield(shieldValue);
                                }}
                                disabled={!shieldValue || (shieldValue === equippedShield)}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>



            {/* Race Feat Description Modal */}
            <Modal animationType="fade" transparent={true} visible={featDescriptionModalVisible}>
                <TouchableWithoutFeedback onPress={() => {
                    setFeatDescriptionModalVisible(false);
                    setDraconicAncestryValue(null);
                    setDraconicAncestryModalVisible(false);
                }}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={{
                                flexDirection: 'column',
                                gap: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: 20,
                                borderRadius: 10,
                                minWidth: '80%',
                                marginHorizontal: 20,
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    marginBottom: 10,
                                    textTransform: 'capitalize',
                                }}>{selectedFeat}</Text>
                                <View>
                                    {statsData.race && renderRaceFeatures(selectedFeat as string)}
                                    {/* Draconic Ancestry Description */}
                                    {selectedFeat?.toLowerCase() === "draconic ancestry" && draconicAncestry && (
                                        <View style={{ padding: 10 }}>
                                            {Object.entries(draconicAncestry).map(([key, value]) => (
                                                <Text key={key} style={{ marginBottom: 5 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>{key}: </Text>
                                                    {value}
                                                </Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                                {renderCustomFeatButton()}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


            {/* Class Feat Description Modal */}
            <Modal animationType="fade" transparent={true} visible={classFeatDescriptionModalVisible}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* Modal Title */}
                        <Text style={styles.modalTitle}>{selectedFeat}</Text>
                        {/* Artificer Infusion Dropdown */}
                        {statsData.class === 'artificer' && selectedFeat?.toLowerCase() === 'infuse item' && !infuseItemEnabled && (
                            renderArtificerInfusionDropdown()
                        )}
                        {/* Artificer Specialist --- Subclass Gained Feature */}
                        {statsData.class === 'artificer' && selectedFeat?.toLowerCase() === 'artificer specialist' && (
                            subclass === null ? (
                                renderArtificerSpecialistDropdown()
                            ) : (
                                <Text style={{ textTransform: 'capitalize' }}>Subclass: {subclass}</Text>
                            )
                        )}
                        {/* Primal Path Dropdown */}
                        {statsData.class === 'barbarian' && selectedFeat?.toLowerCase() === 'primal path' && (
                            subclass === null ? (
                                renderPrimalPathDropdown()
                            ) : (
                                <Text style={{ textTransform: 'capitalize' }}>Subclass: {subclass}</Text>
                            )
                        )}
                        {/* Bard College Dropdown */}
                        {statsData.class === 'bard' && selectedFeat?.toLowerCase() === 'bard college' && (
                            subclass === null ? (
                                renderBardCollegeDropdown()
                            ) : (
                                <Text style={{ textTransform: 'capitalize' }}>Subclass: {subclass}</Text>
                            )
                        )}
                        {/* Cleric - Divine Domain Dropdown */}
                        {statsData.class === 'cleric' && selectedFeat?.toLowerCase() === 'divine domain' && (
                            subclass === null ? (
                                renderDivineDomainDropdown()
                            ) : (
                                <Text style={{ textTransform: 'capitalize' }}>Subclass: {subclass}</Text>
                            )
                        )}
                        {/* Cleric - Subclass Features */}
                        {statsData.class === 'cleric' && selectedFeat?.toLowerCase() === 'divine domain' && (
                            <>
                                {/* Arcana Domain Features */}
                                {subclass === 'arcana' && (
                                    <>
                                        {!arcaneInitiateEnabled && renderArcaneInitiateDropdown()}
                                        {!arcaneMasteryEnabled && statsData.level >= 17 && renderArcaneMasteryDropdown()}
                                    </>
                                )}

                                {/* Death Domain Features */}
                                {subclass === 'death' && !deathDomainEnabled && renderDeathDomainDropdown()}

                                {/* Blessings of Knowledge */}
                                {subclass === 'knowledge' && !blessingsOfKnowledgeEnabled && renderBlessingsOfKnowledgeDropdown()}

                                {/* Add more subclass features here following the same pattern:
                                {subclass === '[subclass]' && (
                                    // Subclass specific dropdowns/features
                                )} 
                                */}
                            </>
                        )}
                        <ScrollView style={{ flex: 1, marginBottom: 60 }}>

                            {/* Render Specific Class Feature */}
                            {selectedFeat && renderClassFeatures(false, selectedFeat)}
                            {/* Render Specific Subclass Feature */}
                            {selectedFeat && statsData.class && subclass && renderSubclassFeatures(selectedFeat)}


                            {/* Primal Path Dropdown Value chosen --- description */}
                            {selectedFeat?.toLowerCase() === 'primal path' && subclass === null && (
                                renderPrimalPathDescription()
                            )}
                            {/* Bard College Dropdown Value chosen --- description */}
                            {selectedFeat?.toLowerCase() === 'bard college' && subclass === null && (
                                renderBardCollegeDescription()
                            )}
                            {/* Divine Domain Dropdown Value chosen --- description */}
                            {selectedFeat?.toLowerCase() === 'divine domain' && subclass === null && (
                                renderDivineDomainDescription()
                            )}
                        </ScrollView>
                    </View>
                    <View style={styles.modalButtons}>
                        <Button title="Close" onPress={() => {
                            setClassFeatDescriptionModalVisible(false);
                            setSelectedFeat(null);
                        }} />
                        {renderCustomFeatButton()}
                    </View>
                </View>
            </Modal>



            {/* Settings Modal */}
            <Modal animationType="fade" transparent={true} visible={settingsModalVisible}>
                <View style={styles.modalContainer}>
                    <Text>Settings</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>Delete Character</Text>
                        <Ionicons name="trash-bin" size={24} color="red" onPress={() => {
                            Alert.alert('Are you sure you want to delete this character?', 'This action cannot be undone.', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: async () => handleDeleteCharacter() }
                            ]);
                        }} />
                        <Button
                            title="Close"
                            onPress={() => setSettingsModalVisible(false)} />
                    </View>
                </View>
            </Modal>



            {/* Dark Modal */}
            <View
                style={[
                    styles.fullScreenModalContainer,
                    {
                        display: darkModalVisible ? 'flex' : 'none',
                        paddingBottom: 100
                    }]}
            >
                {renderSpellDetails()}
                <View style={[styles.modalButtons, { marginBottom: 20 }]}>
                    <TouchableOpacity style={styles.modalButton} onPress={() => {
                        setDarkModalVisible(false);
                        setClassFeatDescriptionModalVisible(true);
                    }}>
                        <Text style={styles.modalButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>




        </View>
    );
}



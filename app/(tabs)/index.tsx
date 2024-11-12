import { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
  ImageBackground,
  ImageSourcePropType,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/actionsStyles';
import raceBonuses from '../data/raceData.json';
import { CharacterContext, DraconicAncestry } from '../context/equipmentActionsContext';
import weapons from '../data/weapons.json';
import StatsDataContext from '../context/StatsDataContext';
import cantripsData from '../data/cantrips.json';
import spellsData from '../data/spells.json';
import reactionImage from '@actions/reaction-image.png';
import defaultLongRestImage from '@actions/long-rest-image-v2.png';
import defaultOffhandAttackImage from '@actions/default-offhand-attack-image.png';
import defaultDisengageImage from '@actions/default-disengage-image.png';
import defaultRangedAttackImage from '@actions/default-ranged-attack-image.png';
import defaultUnarmedAttackImage from '@actions/default-unarmed-attack-image.png';
import defaultAttackImage from '@actions/default-attack-image.png';
import defaultThrowImage from '@actions/default-throw-image.png';
import defaultPushImage from '@actions/default-push-image.png';
import defaultJumpImage from '@actions/default-jump-image.png';
import defaultHideImage from '@actions/default-hide-image.png';
import defaultSprintImage from '@actions/default-sprint-image.png';
import addActionImage from '@actions/add-action-image.png';
import endActionImage from '@actions/end-action-image-v3.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item, useItemEquipment } from '../context/ItemEquipmentContext';
import { useActions } from '../context/actionsSpellsContext';
import { CantripSlotsContext } from '../context/cantripSlotsContext';
import armorTypes from '../data/armorTypes.json';
import artificerFeaturesData from '../data/class-tables/artificer/artificerFeatures.json';

// Draconic Ancestry images
import draconicAncestryImage from '@actions/draconic-ancestry-image.png';

// Magical Tinkering image
import magicalTinkeringImage from '@actions/magical-tinkering-image.png';
// Infuse Item image
import infuseItemImage from '@actions/infuse-item-image.png';
import artificerInfusionsData from '../data/class-tables/artificer/artificerInfusions.json';


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
import DropDownPicker from 'react-native-dropdown-picker';

const addActionImageTyped: ImageSourcePropType = addActionImage as ImageSourcePropType;
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


// Define the base Action interface
interface BaseAction {
  id: string;
  name: string;
  cost: {
    actions: number;
    bonus: number;
    reaction?: number;
    castingTimeText?: string
  };
  details?: string;
  image?: string | ImageSourcePropType;
}

interface WeaponItem {
  name: string;
  cost: string;
  damage: string;
  damageType: string;
  weight: string;
  properties: string[];
  skill_modifiers: string[];
  range?: string;
  throwRange?: string;
  versatileDamage?: string;
  weaponType?: string;
}

interface Ability {
  id: number;
  name: string;
  value: number;
}

interface Spell {
  name: string;
  castingTime: string;
  description: string;
}

// Define Allocation History Interface
interface AllocationHistory {
  [level: number]: {
    [abilityId: number]: number;
  };
}

// Define CharacterContextType
interface CharacterContextType {
  mainHandWeapon: WeaponItem | null;
  offHandWeapon: WeaponItem | null;
  rangedHandWeapon: WeaponItem | null;
  getWeaponDamage: (weapon: WeaponItem) => string;
  getWeaponSkillModifiers: (weapon: WeaponItem) => string[];
  getWeaponProperties: (weapon: WeaponItem) => string[];
  getWeaponAttackBonus: (weapon: WeaponItem) => string;
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
  speed: number;
}

// Define specific action types if needed
interface DefaultActionBlock extends BaseAction {
  // Additional properties specific to default actions
}


interface CustomActionBlock extends BaseAction {
  // Additional properties specific to custom actions
  source?: 'race' | 'class' | 'spell' | 'cantrip' | 'custom';
}

// Create a union type for Action
type ActionBlock = DefaultActionBlock | CustomActionBlock;

// Change later to check if character has the Two-Weapon Fighting class feature
const isTwoWeaponFightingProficient = false;
const isUnarmedStrikeProficient = false;


export default function ActionsScreen() {
  const [numColumns, setNumColumns] = useState(4);
  const [actions, setActions] = useState<ActionBlock[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newActionName, setNewActionName] = useState('');
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionBlock | null>(null);
  const [newActionImage, setNewActionImage] = useState<string | undefined>(undefined); // State for the new action image
  const [newActionDetails, setNewActionDetails] = useState<string>(''); // State for the new action details
  const [editedActionName, setEditedActionName] = useState<string>(''); // State for the edited action name
  const [editingField, setEditingField] = useState<'title' | 'details' | null>(null); // Track which field is being edited
  const [hp, setHp] = useState(0);
  const [tempHp, setTempHp] = useState(0);
  const [maxHp, setMaxHp] = useState(0);
  const [inputHpValue, setInputHpValue] = useState<string>('');
  const [ac, setAc] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [newActionCost, setNewActionCost] = useState<{ actions: number; bonus: number }>({ actions: 0, bonus: 0 });
  const [currentConModifier, setCurrentConModifier] = useState<number>(0);
  const [movementSpeed, setMovementSpeed] = useState<number>(30);
  const {
    currentActionsAvailable,
    currentBonusActionsAvailable,
    currentReactionsAvailable,
    setCurrentActionsAvailable,
    setCurrentBonusActionsAvailable,
    setCurrentReactionsAvailable,
    spentSpellSlots,
    setSpentSpellSlots,
    hellishRebukeSpent,
    setHellishRebukeSpent,
    darknessSpent,
    setDarknessSpent,
    breathWeaponSpent,
    setBreathWeaponSpent,
  } = useActions();
  const { weaponsProficientIn, equippedArmor, equippedShield } = useItemEquipment();
  const { cantripSlotsData } = useContext(CantripSlotsContext);
  // Define state for combined actions
  const [combinedActions, setCombinedActions] = useState<ActionBlock[]>([]);
  // Path to the actions.json file
  const ACTIONS_FILE_PATH = `${FileSystem.documentDirectory}actions.json`;
  // Use context for statsData
  const { statsData } = useContext(StatsDataContext) as { statsData: StatsData };

  const {
    mainHandWeapon,
    rangedHandWeapon,
    offHandWeapon,
    getWeaponDamage,
    getWeaponAttackBonus,
    getWeaponSkillModifiers,
    getWeaponProperties,
    luckyPoints,
    setLuckyPoints,
    luckyPointsMax,
    relentlessEnduranceGained,
    relentlessEnduranceUsable,
    setRelentlessEnduranceUsable,
    luckyPointsEnabled,
    infernalLegacyEnabled,
    draconicAncestry,
    breathWeaponEnabled,
    magicalTinkeringEnabled,
    infuseItemEnabled,
    infuseItemSpent,
    setInfuseItemSpent,
    infusionsLearned,
  } = useContext(CharacterContext) as unknown as CharacterContextType & {
    luckyPoints: number | null;
    setLuckyPoints: (points: number) => void;
    luckyPointsMax: number;
    relentlessEnduranceGained: boolean;
    relentlessEnduranceUsable: boolean;
    setRelentlessEnduranceUsable: (value: boolean) => void;
    luckyPointsEnabled: boolean;
    infernalLegacyEnabled: boolean;
    draconicAncestry: DraconicAncestry | null;
    breathWeaponEnabled: boolean;
    magicalTinkeringEnabled: boolean;
    infuseItemEnabled: boolean;
    infuseItemSpent: boolean;
    setInfuseItemSpent: (value: boolean) => void;
    infusionsLearned: string[];
  };
  const [isArmed, setIsArmed] = useState(false);

  // Update `isArmed` when mainHandWeapon changes
  useEffect(() => {
    setIsArmed(mainHandWeapon !== null);
  }, [mainHandWeapon]);

  // Default actions that cannot be deleted
  const defaultActions: ActionBlock[] = [
    { id: '0', name: 'Rest', details: 'Recover hit points and regain spell slots', cost: { actions: 1, bonus: 1 }, image: defaultLongRestImage },
    { id: '1', name: 'Reaction', details: 'Instantly respond to a trigger', cost: { actions: 0, bonus: 0, reaction: 1 }, image: reactionImage },
    { id: '2', name: 'Sprint', details: 'Double your movement speed', cost: { actions: 1, bonus: 1 }, image: defaultSprintImage },
    { id: '3', name: 'Disengage', details: 'Move away from danger', cost: { actions: 1, bonus: 0 }, image: defaultDisengageImage },
    { id: '4', name: 'Hide', details: 'Attempt to conceal yourself', cost: { actions: 1, bonus: 0 }, image: defaultHideImage },
    { id: '5', name: 'Jump', details: 'Leap over obstacles', cost: { actions: 0, bonus: 1 }, image: defaultJumpImage },
    {
      id: '6',
      name: 'Shove',
      details: 'Push a creature forward 5m or knock it prone. You can only shove creatures up to one size larger than you. Your roll must be greater than the target\'s roll.',
      cost: { actions: 0, bonus: 1 },
      image: defaultPushImage
    },
    { id: '7', name: 'Throw', details: 'Hurl an object or creature at a target', cost: { actions: 1, bonus: 0 }, image: defaultThrowImage },
    { id: '8', name: 'Attack', details: 'Make a melee attack', cost: { actions: 1, bonus: 0 }, image: isArmed ? defaultAttackImage : defaultUnarmedAttackImage },
    { id: '9', name: 'Offhand Attack', details: 'Make an offhand attack', cost: { actions: 0, bonus: 1 }, image: defaultOffhandAttackImage },
    { id: '10', name: 'Ranged Attack', details: 'Make a ranged attack', cost: { actions: 1, bonus: 0 }, image: defaultRangedAttackImage },
  ];

  const [armorStealthDisadvantage, setArmorStealthDisadvantage] = useState<boolean>(false);
  const [knownInfusionsOpen, setKnownInfusionsOpen] = useState<boolean>(false);
  const [knownInfusionValue, setKnownInfusionValue] = useState<string>('');
  const [infusionModalVisible, setInfusionModalVisible] = useState<boolean>(false);


  if (!statsData) {
    // Render a loading indicator or return null
    return null;
  }

  // Calculate movement speed based on race
  useEffect(() => {
    if (statsData.race) {
      const raceData = raceBonuses.find((race) => race.race === statsData.race);
      setMovementSpeed(raceData ? raceData.speed : 30);
    }
  }, [statsData.race]);

  // Function to get the correct action image based on the action and if the character is armed
  function getActionImage(action: ActionBlock): ImageSourcePropType | string {
    if (action.name === 'Attack') {
      return isArmed ? defaultAttackImage : defaultUnarmedAttackImage;
    } else if (action.image) {
      if (typeof action.image === 'number') {
        return action.image; // Local image imported via require/import
      } else {
        return action.image as string; // URI from file system or remote
      }
    } else {
      return { uri: 'https://via.placeholder.com/150?text=&bg=EEEEEE' };
    }
  }


  const calculateModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };

  const getCantripImage = (cantripName: string): ImageSourcePropType => {
    const image = cantripImages[cantripName as keyof typeof cantripImages];
    if (typeof image === 'number') {
      return image; // Local image imported via require/import
    } else if (image) {
      return { uri: image }; // URI from file system or remote
    }
    return { uri: 'https://via.placeholder.com/150?text=&bg=EEEEEE' };
  };

  const generateCantripActions = (slotsData: (string | null)[]): ActionBlock[] => {
    // Filter out empty slots
    const assignedCantrips = slotsData.filter((cantripName) => cantripName !== null && cantripName !== '');
    // Map assigned cantrips to ActionBlock format
    return assignedCantrips.map((cantripName, index) => {
      const cantrip = cantripsData.find((c) => c.name === cantripName);
      const cantripImageSource = getCantripImage(cantripName || '');
      if (!cantrip) {
        return {
          id: `cantrip-${index}`,
          name: '',
          cost: { actions: 0, bonus: 0 },
          details: '',
          image: cantripImageSource,
          type: 'cantrip',
          source: 'cantrip',
        } as ActionBlock;
      }

      return {
        id: `cantrip-${index}`,
        name: cantripName || `Cantrip ${index + 1}`,
        cost: parseCastingTime(cantrip.castingTime),
        details: cantrip.description || '',
        image: cantripImageSource,
        type: 'cantrip',
        source: 'cantrip',
      } as ActionBlock;
    });
  };

  const parseCastingTime = (
    castingTime: string | undefined): {
      actions: number;
      bonus: number;
      castingTimeText?: string
    } => {
    if (!castingTime) {
      return { actions: 0, bonus: 0 };
    }
    const lowerCastingTime = castingTime.toLowerCase();
    if (lowerCastingTime.includes('bonus action')) {
      return { actions: 0, bonus: 1 };
    } else if (lowerCastingTime.includes('action')) {
      return { actions: 1, bonus: 0 };
    } else {
      // Return the original casting time string for other cases
      return { actions: 0, bonus: 0, castingTimeText: castingTime };
    }
  };

  // Update combinedActions whenever actions, cantripSlotsData, statsData.race, or statsData.level change
  useEffect(() => {
    const cantripActions = generateCantripActions(cantripSlotsData);
    const raceActions = generateRaceBasedActions();
    const classActions = generateClassBasedActions();
    // Combine all actions into one array
    const allActions = [...actions, ...cantripActions, ...raceActions, ...classActions];
    // Remove duplicates based on 'id'
    const uniqueActionsMap = new Map<string, ActionBlock>();
    allActions.forEach(action => {
      uniqueActionsMap.set(action.id, action); // 'id' should be unique for each action
    });
    const uniqueActions = Array.from(uniqueActionsMap.values());
    setCombinedActions(uniqueActions);
  }, [
    actions,
    cantripSlotsData,
    statsData.race,
    statsData.level,
    infernalLegacyEnabled,
    draconicAncestry,
    breathWeaponEnabled,
    magicalTinkeringEnabled,
    infuseItemEnabled,
  ]);


  // Extract Ability Modifiers from statsData
  useEffect(() => {
    // Get current constitution modifier
    const constitutionAbility = statsData.abilities.find((ability) => ability.name === 'Constitution');
    const constitutionScore = constitutionAbility ? constitutionAbility.value : 10; // Default to 10 if not found
    const newConModifier = calculateModifier(constitutionScore);
    setCurrentConModifier(newConModifier);

    // Get current wisdom modifier
    const wisdomAbility = statsData.abilities.find((ability) => ability.name === 'Wisdom');
    const wisdomScore = wisdomAbility ? wisdomAbility.value : 10;
    const wisdomModifier = calculateModifier(wisdomScore);
    setCurrentWisdomModifier(wisdomModifier);
  }, [statsData.abilities]);

  const { hpIncreases = {}, hitDice = 0 } = statsData || {};

  const [currentWisdomModifier, setCurrentWisdomModifier] = useState<number>(0);


  // Function to load actions from file system
  const loadActions = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(ACTIONS_FILE_PATH);
      if (fileInfo.exists) {
        const jsonString = await FileSystem.readAsStringAsync(ACTIONS_FILE_PATH);
        let parsedActions: ActionBlock[] = JSON.parse(jsonString);

        // Optional: Migrate cost from array to object if necessary
        const needsMigration = parsedActions.some(action => Array.isArray(action.cost));
        if (needsMigration) {
          parsedActions = parsedActions.map(action => {
            if (Array.isArray(action.cost)) {
              return {
                ...action,
                cost: {
                  actions: action.cost[0],
                  bonus: action.cost[1],
                },
              };
            }
            return action;
          });
          await saveActions(parsedActions);
        }


        const isValid = parsedActions.every(action => {
          return (
            action.cost &&
            typeof action.cost.actions === 'number' &&
            typeof action.cost.bonus === 'number'
          );
        });


        if (isValid) {
          setActions(parsedActions);
          // Generate cantrip actions from cantripSlotsData
          const cantripActions = generateCantripActions(cantripSlotsData);
          // Combine actions and cantripActions
          setCombinedActions([...parsedActions, ...cantripActions]);
        } else {
          // If invalid, reset to default actions
          setActions(defaultActions);
          saveActions(defaultActions);
        }
      } else {
        // If no actions in storage, initialize with default actions
        setActions(defaultActions);
        saveActions(defaultActions);
      }
    } catch (error) {
      console.error('Failed to load actions:', error);
      // In case of error, initialize with default actions
      setActions(defaultActions);
    }
  };


  // Load actions from file system when the component mounts
  useEffect(() => {
    loadActions();
  }, []);

  // Calculate AC based on Dexterity and equipped armor
  useEffect(() => {
    if (statsData.abilities) {
      const dexterity = statsData.abilities.find(
        (ability) => ability.name.toLowerCase() === 'dexterity'
      );

      if (dexterity) {
        const dexModifier = Math.floor((dexterity.value - 10) / 2);

        if (!equippedArmor) {
          // No armor equipped
          setAc(10 + dexModifier + (equippedShield ? 2 : 0));
          return;
        }

        // Initialize armorFound as null
        let armorFound = null;

        // Convert equippedArmor to lowercase for comparison
        const equippedArmorLower = equippedArmor.toLowerCase();

        // Loop through armorTypes to find the equipped armor (case-insensitive)
        for (const type of armorTypes) {
          if (type.versions) {
            // Get the keys of the versions and find the matching key (case-insensitive)
            const armorKey = Object.keys(type.versions).find(
              (key) => key.toLowerCase() === equippedArmorLower
            );
            if (armorKey) {
              armorFound = type.versions[armorKey as keyof typeof type.versions];
              break;
            }
          }
        }

        if (armorFound) {
          const armorStats = armorFound;

          // Set the stealth disadvantage state
          setArmorStealthDisadvantage(armorStats.stealthDisadvantage === true);

          let totalAc = armorStats.ac;
          if (armorStats.dexModApplied) {
            // Apply dex modifier up to max if specified
            const dexBonus =
              armorStats.maxDexBonus !== null
                ? Math.min(dexModifier, armorStats.maxDexBonus)
                : dexModifier;
            totalAc += dexBonus;
          }

          // Add shield bonus if equipped
          if (equippedShield) {
            totalAc += 2;
          }

          setAc(totalAc);
        } else {
          // Armor not found; default to base AC plus shield if equipped
          setAc(10 + dexModifier + (equippedShield ? 2 : 0));
        }
      }
    }
  }, [statsData, equippedArmor, equippedShield]);

  const [proficiencyBonus, setProficiencyBonus] = useState<number>(2);

  // Function to get proficiency bonus based on level
  const getProficiencyBonus = (level: number): number => {
    if (level >= 17) return 6;
    if (level >= 13) return 5;
    if (level >= 9) return 4;
    if (level >= 5) return 3;
    return 2;
  };

  // Update proficiency bonus when statsData.level changes
  useEffect(() => {
    if (statsData && statsData.level) {
      const newProficiencyBonus = getProficiencyBonus(statsData.level);
      if (newProficiencyBonus !== proficiencyBonus) {
        setProficiencyBonus(newProficiencyBonus);
        // Save the new proficiency bonus to AsyncStorage
        AsyncStorage.setItem('proficiencyBonus', newProficiencyBonus.toString())
          .catch(error => console.error('Failed to save proficiency bonus:', error));
      }
    }
  }, [statsData?.level]);

  // Load proficiency bonus from AsyncStorage when component mounts
  useEffect(() => {
    AsyncStorage.getItem('proficiencyBonus')
      .then(value => {
        if (value !== null) {
          setProficiencyBonus(parseInt(value, 10));
        }
      })
      .catch(error => console.error('Failed to load proficiency bonus:', error));
  }, []);




  // Function to save actions to file system
  const saveActions = async (actionsToSave: ActionBlock[]) => {
    try {
      const jsonString = JSON.stringify(actionsToSave);
      await FileSystem.writeAsStringAsync(ACTIONS_FILE_PATH, jsonString);
    } catch (error) {
      console.error('Failed to save actions:', error);
    }
  };

  const changeNumColumns = () => {
    // Cycle through column numbers from 2 to 4
    setNumColumns((prevColumns) => (prevColumns % 3) + 2);
  };

  const addAction = () => {
    if (newActionName) {
      // Generate new id based on maximum existing id
      const existingIds = actions.map((action) => Number(action.id));
      const maxId = existingIds.length > 0 ? Math.max(...existingIds) : -1;
      const newId = String(maxId + 1);

      const newAction: ActionBlock = {
        id: newId,
        name: newActionName,
        details: newActionDetails,
        image: newActionImage,
        cost: {
          actions: newActionCost.actions,
          bonus: newActionCost.bonus,
        },
      };

      const updatedActions = [...actions, newAction];
      setActions(updatedActions);
      saveActions(updatedActions);
      setNewActionName('');
      setNewActionDetails('');
      setNewActionImage(undefined);
      setNewActionCost({ actions: 0, bonus: 0 }); // Reset cost after adding
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter the name of the action.');
    }
  };



  const deleteAction = (actionId: string) => {
    // Check if the action is a default action
    const actionToDelete = actions.find((action) => action.id === actionId);
    if (actionToDelete && defaultActions.find((action) => action.id === actionId)) {
      Alert.alert('Cannot Delete', 'Default actions cannot be deleted.');
      return;
    }

    // Delete associated image file if it exists
    if (actionToDelete && actionToDelete.image) {
      FileSystem.deleteAsync(actionToDelete.image as string, { idempotent: true }).catch(error => {
        console.error('Failed to delete image file:', error);
      });
    }

    const updatedActions = actions.filter((action) => action.id !== actionId);
    setActions(updatedActions);
    saveActions(updatedActions);
  };

  const handleLongPress = (actionId: string) => {
    if (actionId.startsWith('cantrip')) {
      Alert.alert('Information', 'Cantrips cannot be deleted.');
      return;
    }
    // Check if the action is a default action
    if (defaultActions.find((action) => action.id === actionId)) {
      Alert.alert('Information', 'Default actions cannot be deleted.');
      return;
    }

    Alert.alert('Delete Action', 'Are you sure you want to delete this action?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteAction(actionId),
      },
    ]);
  };


  // Function to reset custom actions
  const resetActions = async () => {
    try {
      // Delete the actions.json file
      await FileSystem.deleteAsync(ACTIONS_FILE_PATH, { idempotent: true });

      // Delete any images associated with custom actions
      const imageDeletionPromises = actions.map(action => {
        if (!defaultActions.some(defaultAction => defaultAction.id === action.id) && action.image) {
          return FileSystem.deleteAsync(action.image as string, { idempotent: true });
        }
        return Promise.resolve();
      });
      await Promise.all(imageDeletionPromises);

      // Reset actions to default
      setActions(defaultActions);
      saveActions(defaultActions);
      setResetModalVisible(false);
    } catch (error) {
      console.error('Failed to reset actions:', error);
    }
  };

  const pickImage = async (forNewAction: boolean = false) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your media library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });


    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const fileName = imageUri.split('/').pop();
      const newPath = `${FileSystem.documentDirectory}${fileName}`;

      try {
        await FileSystem.copyAsync({ from: imageUri, to: newPath });
      } catch (error) {
        console.error('Failed to copy image:', error);
      }

      if (forNewAction) {
        setNewActionImage(newPath);
      } else {
        if (selectedAction) {
          const updatedActions = actions.map(action => {
            if (action.id === selectedAction.id) {
              // Delete previous image if it exists
              if (action.image) {
                FileSystem.deleteAsync(action.image as string, { idempotent: true }).catch(error => {
                  console.error('Failed to delete old image:', error);
                });
              }
              return { ...action, image: newPath };
            }
            return action;
          });
          setActions(updatedActions);
          saveActions(updatedActions);
          setSelectedAction(prev => (prev ? { ...prev, image: newPath } : null));
        }
      }
    }
  };

  const handleTitleLongPress = () => {
    if (selectedAction) {
      if (isDefaultAction(selectedAction.id) || ('type' in selectedAction && selectedAction.type === 'cantrip')) {
        Alert.alert('Information', 'You cannot edit the title of built-in actions');
        return;
      }

      Alert.alert(
        'Rename Action',
        'Do you want to rename this action?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Rename',
            onPress: () => {
              setEditingField('title');
              setEditedActionName(selectedAction.name);
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleDetailsLongPress = () => {
    if (selectedAction) {
      if (isDefaultAction(selectedAction.id) || ('type' in selectedAction && selectedAction.type === 'cantrip')) {
        Alert.alert('Information', 'You cannot edit the details of built-in actions');
        return;
      }

      Alert.alert(
        'Edit Details',
        'Do you want to edit the details of this action?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Edit',
            onPress: () => {
              setEditingField('details');
              setNewActionDetails(selectedAction.details || '');
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const saveActionName = () => {
    if (selectedAction) {
      const updatedActions = actions.map(action => {
        if (action.id === selectedAction.id) {
          return { ...action, name: editedActionName }; // Update the action name
        }
        return action;
      });
      setActions(updatedActions);
      saveActions(updatedActions); // Save the updated actions

      // Update the selectedAction to reflect the new name
      setSelectedAction(prev => (prev ? { ...prev, name: editedActionName } : null));

      setEditingField(null); // Exit editing mode
    }
  };


  const saveActionDetails = () => {
    if (selectedAction) {
      const updatedActions = actions.map(action => {
        if (action.id === selectedAction.id) {
          return { ...action, details: newActionDetails }; // Update the action details
        }
        return action;
      });
      setActions(updatedActions);
      saveActions(updatedActions); // Save the updated actions

      // Update the selectedAction to reflect the new details
      setSelectedAction(prev => (prev ? { ...prev, details: newActionDetails } : null));
      setEditingField(null); // Exit editing mode
    }
  };

  const handleImageLongPress = () => {
    if (selectedAction) {
      if (isDefaultAction(selectedAction.id) || ('type' in selectedAction && selectedAction.type === 'cantrip')) {
        Alert.alert('Information', 'You cannot edit the image of built-in actions');
        return;
      }

      Alert.alert(
        'Image Options',
        selectedAction.image ? 'What would you like to do with the image?' : 'You can add an image.',
        [
          ...(selectedAction.image
            ? [
              {
                text: 'Remove Image',
                onPress: () => {
                  // Delete the image file
                  if (selectedAction.image) {
                    FileSystem.deleteAsync(selectedAction.image as string, { idempotent: true }).catch(error => {
                      console.error('Failed to delete image file:', error);
                    });
                  }
                  const updatedActions = actions.map(action => {
                    if (action.id === selectedAction.id) {
                      return { ...action, image: undefined }; // Set image to undefined
                    }
                    return action;
                  });
                  setActions(updatedActions); // Update actions state
                  saveActions(updatedActions); // Save the updated actions
                  setSelectedAction({ ...selectedAction, image: undefined }); // Update selected action
                },
              },
            ]
            : []), // Only include if there is an image
          {
            text: selectedAction.image ? 'Replace Image' : 'Add Image',
            onPress: () => pickImage(false), // Call pickImage for existing action
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }
  };

  // Commit Action Function
  const commitAction = () => {
    if (selectedAction) {
      const { actions: costActions, bonus: costBonus, reaction: costReaction } = selectedAction.cost;

      if (
        currentActionsAvailable >= costActions &&
        currentBonusActionsAvailable >= costBonus &&
        (costReaction !== undefined ? currentReactionsAvailable >= costReaction : true)
      ) {
        // Subtract the cost from available actions
        setCurrentActionsAvailable(prev => prev - costActions);
        setCurrentBonusActionsAvailable(prev => prev - costBonus);
        if (costReaction !== undefined) {
          setCurrentReactionsAvailable(prev => prev - costReaction);
        }
        setActionModalVisible(false);
      } else {
        Alert.alert('Insufficient Resources', 'You do not have enough actions or bonus actions for this.');
      }
    }
  };


  const endTurn = () => {
    setCurrentActionsAvailable(1);
    setCurrentBonusActionsAvailable(1);
    setCurrentReactionsAvailable(1);
  };

  const windowWidth = Dimensions.get('window').width;
  const itemWidth = (windowWidth - (30 + (numColumns - 1) * 10)) / numColumns; // 20 for horizontal padding, 10 for gap between items

  // Render Action Blocks
  const renderActionBlocks = ({ item }: { item: ActionBlock | null }) => {
    if (item) {
      let affordable = currentActionsAvailable >= item.cost.actions &&
        currentBonusActionsAvailable >= item.cost.bonus &&
        (item.cost.reaction !== undefined ? currentReactionsAvailable >= item.cost.reaction : true);

      // Check for infernal legacy spells
      if (infernalLegacyEnabled) {
        if (item.name.toLowerCase() === 'darkness') {
          affordable = affordable && !darknessSpent;
        } else if (item.name.toLowerCase() === 'hellish rebuke') {
          affordable = affordable && !hellishRebukeSpent;
        }
      }

      // Check for breath weapon
      if (breathWeaponEnabled && item.name.toLowerCase() === 'breath weapon') {
        affordable = affordable && !breathWeaponSpent;
      }

      // Check for infuse item
      if (infuseItemEnabled && item.name.toLowerCase() === 'infuse item') {
        affordable = affordable && !infuseItemSpent;
      }

      const isRangedAttack = item.name.toLowerCase().includes('ranged');
      const isOffhandAttack = item.name.toLowerCase().includes('offhand');
      const rangedHandWeaponEquipped = rangedHandWeapon && rangedHandWeapon.name.toLowerCase() !== 'none';
      const offHandWeaponEquipped = offHandWeapon && offHandWeapon.name.toLowerCase() !== 'none';

      const isInfernalSpell = item.name.toLowerCase() === 'darkness' || item.name.toLowerCase() === 'hellish rebuke';

      return (
        <ImageBackground
          source={getActionImage(item) as ImageSourcePropType}
          style={[
            styles.itemContainer,
            {
              width: itemWidth, opacity: affordable ?
                (isRangedAttack && !rangedHandWeaponEquipped ?
                  0.2
                  :
                  (isOffhandAttack && !offHandWeaponEquipped ?
                    0.2
                    :
                    1
                  )
                )
                :
                0.2
            }
          ]}
          imageStyle={{ borderRadius: 8 }}
        >
          <TouchableOpacity
            style={styles.itemContent}
            onPress={() => {
              setSelectedAction(item);
              setActionModalVisible(true);
            }}
            onLongPress={() => handleLongPress(item.id)}
            disabled={!isInfernalSpell && (!affordable || (isRangedAttack && !rangedHandWeaponEquipped) || (isOffhandAttack && !offHandWeaponEquipped))}
          >
            {!item.image && (
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemText}>{item.name}</Text>
              </View>
            )}
          </TouchableOpacity>
        </ImageBackground>
      );
    } else {
      // Render the plus icon as a button
      return (
        <ImageBackground
          source={addActionImageTyped}
          style={[styles.addItemContainer, { width: itemWidth }]}
          imageStyle={{ borderRadius: 8 }}
        >
          <TouchableOpacity
            style={styles.addItemButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={48} color="white" />
          </TouchableOpacity>
        </ImageBackground>
      );
    }
  };

  const isDefaultAction = (actionId: string) => {
    return defaultActions.some(action => action.id === actionId);
  };

  // HP-Related Functions
  const handleHpChange = (operation: 'replenish' | 'subtract' | 'add') => {
    const changeValue = parseInt(inputHpValue) || 0;
    if (operation === 'replenish') {
      setHp(maxHp);
      setTempHp(0);
    } else if (operation === 'subtract') {
      let remainingDamage = changeValue;
      if (tempHp > 0) {
        if (tempHp >= remainingDamage) {
          // Subtract from tempHp
          setTempHp(tempHp - remainingDamage);
        } else {
          // Subtract from tempHp and hp
          remainingDamage -= tempHp;
          setTempHp(0);
          setHp(Math.max((hp ?? 0) - remainingDamage, 0));
        }
      } else {
        // Subtract from hp
        setHp(Math.max((hp ?? 0) - remainingDamage, 0));
      }
    } else if (operation === 'add') {
      const newHp = Math.min((hp ?? 0) + changeValue, maxHp);
      setHp(newHp);
    }
    setInputHpValue('');
  };

  // Load stored hp and tempHp when component mounts, hitDice changes or maxHp changes
  useEffect(() => {
    const loadHpData = async () => {
      try {
        const storedHp = await AsyncStorage.getItem('hp');
        const storedTempHp = await AsyncStorage.getItem('tempHp');
        const storedMaxHp = await AsyncStorage.getItem('maxHp');

        const hpValue = storedHp !== null ? parseInt(storedHp, 10) : null;
        const tempHpValue = storedTempHp !== null ? parseInt(storedTempHp, 10) : 0;
        const maxHpValue = storedMaxHp !== null ? parseInt(storedMaxHp, 10) : 0;

        setHp(hpValue ?? 0);
        setTempHp(tempHpValue);
        setMaxHp(maxHpValue);
      } catch (error) {
        console.error('Error loading hp data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHpData();
  }, []); // Empty dependency array to run only once on mount

  // Save hp, tempHp, maxHp, and hitDice whenever they change
  useEffect(() => {
    if (!isLoading) {
      const saveHpData = async () => {
        try {
          await AsyncStorage.setItem('hp', hp.toString());
          await AsyncStorage.setItem('tempHp', tempHp.toString());
          await AsyncStorage.setItem('maxHp', maxHp.toString());
        } catch (error) {
          console.error('Error saving HP data:', error);
        }
      };

      saveHpData();
    }
  }, [hp, tempHp, maxHp]);



  const renderHpBar = () => {
    if (hp === null || maxHp === 0) {
      return null;
    }

    const totalHp = hp + tempHp;
    const hpUnits = [];

    for (let i = 1; i <= Math.max(totalHp, maxHp); i++) {
      let unitColor = 'gray'; // Default color for missing HP

      if (i <= hp) {
        unitColor = 'red'; // Current HP
      } else if (i <= totalHp) {
        unitColor = 'cyan'; // Temporary HP
      }

      hpUnits.push(
        <View
          key={i}
          style={[styles.hpUnit, { backgroundColor: unitColor }]}
        />
      );
    }

    return (
      <View style={styles.hpBar}>
        {hpUnits}
      </View>
    );
  };

  // Calculate maxHp based on hpIncreases
  useEffect(() => {
    const calculateMaxHp = () => {
      if (!hitDice) return; // Ensure hitDice is available
      // Level 1 HP: Max of hit die + current Constitution modifier
      const level1Hp = hitDice + currentConModifier;
      const additionalHp = Object.entries(hpIncreases)
        .filter(([level, _]) => parseInt(level) >= 2)
        .reduce((total, [_, value]) => total + value, 0);
      const totalHp = level1Hp + additionalHp;
      setMaxHp(totalHp);

      // Adjust current hp if it exceeds the new maxHp
      setHp((prevHp) => {
        if (prevHp === null) {
          return totalHp;
        } else {
          return Math.min(prevHp, totalHp);
        }
      });
    };

    if (!isLoading) {
      calculateMaxHp();
    }
  }, [hpIncreases, hitDice, isLoading, currentConModifier]);

  // Function to get the current Strength modifier
  const getStrengthModifier = useCallback(() => {
    const strengthAbility = statsData.abilities.find(ability => ability.name === 'Strength');
    const strengthValue = strengthAbility ? strengthAbility.value : 10;
    return Math.floor((strengthValue - 10) / 2);
  }, [statsData.abilities]);

  const getDexModifier = useCallback(() => {
    const dexterityAbility = statsData.abilities.find(ability => ability.name === 'Dexterity');
    const dexterityValue = dexterityAbility ? dexterityAbility.value : 10;
    return Math.floor((dexterityValue - 10) / 2);
  }, [statsData.abilities]);

  // State to hold the current Strength modifier
  const [currentStrengthModifier, setCurrentStrengthModifier] = useState(getStrengthModifier());
  const [currentDexModifier, setCurrentDexModifier] = useState(getDexModifier());

  // Update the Strength modifier when statsData changes
  useEffect(() => {
    setCurrentStrengthModifier(getStrengthModifier());
    setCurrentDexModifier(getDexModifier());
  }, [statsData.abilities, getStrengthModifier, getDexModifier]);


  function isSpell(s: any): s is Spell {
    return typeof s === 'object' && s !== null && 'name' in s;
  }

  function renderDraconicAncestryDetails(draconicAncestry: DraconicAncestry): string {
    return [
      `Damage Type: ${draconicAncestry.damageType}`,
      `Breath Weapon: ${draconicAncestry.breathWeapon}`,
      'Replenishes on a long rest.',
    ].join('\n');
  }



  const generateRaceBasedActions = (): ActionBlock[] => {
    const raceActions: ActionBlock[] = [];

    if (statsData.race?.toLowerCase() === 'tiefling' && infernalLegacyEnabled) {
      // Level 1: Thaumaturgy
      if (statsData.level >= 1) {
        const cantrip = cantripsData.find(c => c.name === 'Thaumaturgy');
        if (cantrip) {
          const cantripImageSource = getCantripImage(cantrip.name);
          raceActions.push({
            id: 'race-cantrip-thaumaturgy',
            name: 'Thaumaturgy',
            cost: parseCastingTime(cantrip.castingTime),
            image: cantripImageSource,
            details: cantrip.description || '',
            type: 'cantrip',
            source: 'race',
          } as ActionBlock);
        }
      }

      // Level 3: Hellish Rebuke
      if (statsData.level >= 3) {
        // Search through all spell levels 1-9
        const spell = spellsData
          .filter(levelData => levelData.level >= 1 && levelData.level <= 9)
          .flatMap(levelData => {
            // Handle both spell objects and strings in the spells array
            return levelData.spells.map(spell => {
              if (typeof spell === 'string') {
                return { name: spell };
              }
              return spell;
            });
          })
          .filter(isSpell)
          .find(s => s.name === 'Hellish Rebuke');

        if (spell) {
          raceActions.push({
            id: 'race-spell-hellish-rebuke',
            name: 'Hellish Rebuke',
            cost: parseCastingTime(spell.castingTime),
            details: spell.description || '',
            type: 'spell',
            source: 'race',
          } as ActionBlock);
        }
      }

      // Level 5: Darkness
      if (statsData.level >= 5) {
        // Search through all spell levels 1-9
        const spell = spellsData
          .filter(levelData => levelData.level >= 1 && levelData.level <= 9)
          .flatMap(levelData => {
            // Handle both spell objects and strings in the spells array
            return levelData.spells.map(spell => {
              if (typeof spell === 'string') {
                return { name: spell };
              }
              return spell;
            });
          })
          .filter(isSpell)
          .find(s => s.name === 'Darkness');

        if (spell) {
          raceActions.push({
            id: 'race-spell-darkness',
            name: 'Darkness',
            cost: parseCastingTime(spell.castingTime),
            details: spell.description || '',
            type: 'spell',
            source: 'race',
          } as ActionBlock);
        }
      }
    }


    // Draconic Ancestry
    // For Dragonborn's Breath Weapon
    if (statsData.race?.toLowerCase() === 'dragonborn' && (draconicAncestry !== null) && breathWeaponEnabled) {
      // Add 'Breath Weapon' action
      raceActions.push({
        id: 'race-breath-weapon',
        name: 'Breath Weapon',
        cost: { actions: 1, bonus: 0 },
        details: renderDraconicAncestryDetails(draconicAncestry),
        image: draconicAncestryImage as ImageSourcePropType,
        type: 'feature',
        source: 'race',
      } as ActionBlock);
    }


    return raceActions;
  };

  // Generate class based actions
  const generateClassBasedActions = (): ActionBlock[] => {
    const classActions: ActionBlock[] = [];

    // Artificer
    if (statsData.class?.toLowerCase() === 'artificer') {
      if (magicalTinkeringEnabled === true) {
        // find details from artificerFeatures
        const feature = artificerFeaturesData.find((feat: any) => feat.name.toLowerCase() === 'magical tinkering');
        // Add 'Magical Tinkering' action
        classActions.push({
          id: 'class-magical-tinkering',
          name: 'Magical Tinkering',
          cost: { actions: 1, bonus: 0 },
          details: `${feature?.description ? feature.description : ''} (see ${statsData.class ? statsData.class : 'class'} feats)`,
          image: magicalTinkeringImage as ImageSourcePropType,
          type: 'feature',
          source: 'class',
        } as ActionBlock);

      }
      if (infuseItemEnabled === true) {
        const feature = artificerFeaturesData.find((feat: any) => feat.name.toLowerCase() === 'infuse item');
        if (feature && feature.features) {
          // Add 'Infuse Item' action
          classActions.push({
            id: 'class-infuse-item',
            name: 'Infuse Item',
            cost: { actions: 1, bonus: 0 },
            details: `(see ${statsData.class ? statsData.class : 'class'} feats for details)`,
            image: infuseItemImage as ImageSourcePropType,
            type: 'feature',
            source: 'class',
          } as ActionBlock);
        }
      }
    }

    // Other classes
    return classActions;
  }


  const renderKnownInfusionsDropdown = () => {
    return (
      <View style={{ zIndex: 2000, flexDirection: 'row', alignItems: 'center', width: '100%', gap: 10 }}>
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: 'black',
            borderRadius: 8,
            borderWidth: 1,
            opacity: knownInfusionValue === '' ? 0.1 : 1,
          }}
          onPress={() => {
            console.log('open', knownInfusionValue);
            setInfusionModalVisible(true);
            setActionModalVisible(false);
          }}
          disabled={knownInfusionValue === ''}
        >
          <Text style={{ color: 'white' }}>open</Text>
        </TouchableOpacity>
        <DropDownPicker
          items={infusionsLearned.map((infusion) => ({
            label: infusion.charAt(0).toUpperCase() + infusion.slice(1),
            value: infusion,
          }))}
          value={knownInfusionValue}
          setValue={setKnownInfusionValue}
          open={knownInfusionsOpen}
          setOpen={setKnownInfusionsOpen}
          placeholder="Select an infusion"
          containerStyle={{ zIndex: 2000, flex: 1 }}
        />
      </View>
    );
  }


  const renderInfusionDetails = () => {
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
        {knownInfusionValue &&
          artificerInfusionsData.map(infusion => {
            if (infusion.id.toLowerCase() === knownInfusionValue.toLowerCase()) {
              return (
                <View key={infusion.id}>
                  {Object.entries(infusion).map(([key, value]) => {
                    if (key === 'id') return null;
                    return (
                      <View key={key} style={{ marginBottom: 15 }}>
                        <Text style={{ color: 'white' }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Text>
                        {renderValue(value)}
                      </View>
                    );
                  })}
                </View>
              );
            }
            return null;
          })
        }
      </ScrollView>
    );
  }


  // Main Contents
  return (
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

          {/* Show if lucky points */}
          {luckyPoints !== null && luckyPoints !== -1 && (
            <View style={styles.headerTextContainer}>
              <TouchableOpacity
                disabled={luckyPoints === 0}
                style={[styles.headerTextContainer, {
                  paddingVertical: 3,
                  paddingHorizontal: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  opacity: luckyPoints === 0 ? 0.1 : 1
                }]}
                onPress={() => {
                  Alert.alert(
                    `${luckyPoints} lucky point(s)`,
                    `When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can choose to spend your lucky point and reroll. You regain your lucky points after a long rest.`,
                    [
                      {
                        text: 'OK',
                        style: 'cancel'
                      },
                      {
                        text: 'Use',
                        onPress: () => {
                          if (luckyPoints && luckyPoints > 0) {
                            setLuckyPoints(luckyPoints - 1);
                          }
                        }
                      }
                    ],
                  );
                }}
              >
                <Text style={[styles.headerText, { marginRight: 4 }]}>{luckyPoints}</Text>
                <MaterialCommunityIcons name="clover" size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}


          {/* Show if relentless endurance is gained */}
          {relentlessEnduranceGained && (
            <View style={[styles.headerTextContainer, { opacity: relentlessEnduranceUsable ? 1 : 0.1 }]}>
              <TouchableOpacity
                disabled={!relentlessEnduranceUsable}
                onPress={() => {
                  Alert.alert(
                    'Relentless Endurance',
                    'If you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can use this once per long rest.',
                    [
                      {
                        text: 'OK',
                        style: 'cancel'
                      },
                      {
                        text: 'Use',
                        onPress: () => {
                          // Add logic here to use Relentless Endurance
                          setRelentlessEnduranceUsable(false);
                        }
                      }
                    ]
                  );
                }}>
                <Ionicons name="fitness" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}


          {/* Show if stealth disadvantage from equipped armor */}
          {armorStealthDisadvantage && (
            <View style={styles.headerTextContainer}>
              <TouchableOpacity onPress={() => {
                Alert.alert('Stealth Disadvantage', 'Your equipped armor imposes disadvantage on Dexterity (Stealth) checks.');
              }}>
                <MaterialCommunityIcons name="incognito-off" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={changeNumColumns}>
            <Ionicons
              name="grid-outline"
              size={24}
              color="black"
              style={styles.headerIcon}
            />
          </TouchableOpacity>
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {statsData.class !== '' && statsData.race !== '' ?
          <View style={styles.subheader}>

            {/* HP Container */}

            <View style={styles.hpContainer}>
              <View style={styles.hpTextContainer}>
                {hp !== null && hp > 0
                  ?
                  <Text style={[styles.hpText, { marginLeft: 5 }]}>
                    {hp + tempHp}
                  </Text>
                  :
                  <Ionicons name="skull" size={16} color="lightgrey" />
                }
                <Text style={styles.subheaderText}>/{maxHp}</Text>
              </View>
              {(hp !== null && maxHp > 0) && (
                <View style={styles.hpBarContainer}>
                  {renderHpBar()}
                </View>
              )}
            </View>
            <View style={styles.subheaderInline}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                {/* Useful Stats */}
                <View style={styles.subheaderSideBySide}>

                  <View style={[styles.subheaderHpContainer, { borderColor: 'rgba(255, 255, 255, 0.1)', flexDirection: 'row' }]}>
                    {/* Proficiency Bonus */}
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={styles.hpText}>+{proficiencyBonus}</Text>
                      <View style={styles.subheaderSideBySide}>
                        <TouchableOpacity
                          onPress={() => Alert.alert('Proficiency Bonus', 'Your proficiency bonus is determined by your proficiency rank, which is based on your class and level. It is used to calculate the effectiveness of your skills and abilities.')}
                        >
                          <Ionicons name="ribbon" size={24} color="lightgrey"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* AC */}
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={styles.hpText}>{ac}</Text>
                      <View style={styles.subheaderSideBySide}>
                        <TouchableOpacity
                          onPress={() => Alert.alert('Armor Class', 'Your Armor Class is determined by your Dexterity modifier, armor, and shield. It is used to calculate the effectiveness of your armor and shield against attacks.')}
                        >
                          <MaterialCommunityIcons name="shield-sword" size={24} color="lightgrey"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Movement Speed */}
                  <View style={[styles.subheaderHpContainer, { borderColor: 'rgba(255, 255, 255, 0.1)', flexDirection: 'row' }]}>
                    {/* Perception */}
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={styles.hpText}>+{currentWisdomModifier + proficiencyBonus}</Text>
                      <View style={styles.subheaderSideBySide}>
                        <TouchableOpacity
                          onPress={() => Alert.alert('Perception', 'Your Perception is determined by your Wisdom modifier and your proficiency bonus. It is used to calculate your ability to detect and respond to hidden or subtle details.')}
                        >
                          <Ionicons name="eye" size={24} color="lightgrey" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* Movement Speed */}
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={styles.hpText}>{movementSpeed}</Text>
                      <View style={styles.subheaderSideBySide}>
                        <TouchableOpacity
                          onPress={() => Alert.alert('Movement Speed', 'Your Movement Speed is determined by your base speed and any bonuses or penalties from your equipment or abilities. It is used to calculate how far you can move in a single turn.')}
                        >
                          <Ionicons name="footsteps" size={24} color="lightgrey" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                </View>


                <View style={styles.subheaderSideBySide}>

                  {/* Third Box Quick Stats */}
                  <View style={[styles.subheaderHpContainer, { borderColor: 'rgba(255, 255, 255, 0.1)', flexDirection: 'row' }]}>
                    {/* Initiative */}
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={styles.hpText}>{currentDexModifier < 0 ? '' : '+'}{currentDexModifier}</Text>
                      <View style={styles.subheaderSideBySide}>
                        <TouchableOpacity
                          onPress={() => Alert.alert('Initiative', 'Your Initiative is determined by your Dexterity modifier. It is used to calculate your order of turn in combat.')}
                        >
                          <Ionicons name="alert" size={24} color="lightgrey" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Hit Dice */}
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={styles.hpText}>{hitDice}</Text>
                      <View style={styles.subheaderSideBySide}>
                        <TouchableOpacity
                          onPress={() => Alert.alert('Hit Dice', 'Your Hit Dice is determined by your class. It is used to calculate your maximum hit points and is the dice you roll to regain hit points in short rest.')}
                        >
                          <Ionicons name="dice" size={24} color="lightgrey" />
                        </TouchableOpacity>
                      </View>
                    </View>

                  </View>

                  {/* Temporary HP Input */}
                  <View style={styles.subheaderHpContainer}>
                    <TextInput
                      placeholder="0"
                      keyboardType="number-pad"
                      placeholderTextColor="gray"
                      style={[styles.modalInputTempHp, { fontSize: 20 }]}
                      onChangeText={(value: string) => {
                        if (value === '') {
                          setTempHp(0);
                        } else {
                          const parsedValue = parseInt(value) || 0;
                          setTempHp(Math.min(parsedValue, 999));
                        }
                      }}
                      value={tempHp === 0 ? '' : tempHp.toString()}
                      maxLength={3}
                    />
                    <View style={styles.subheaderSideBySide}>
                      <Ionicons name="heart-circle" size={24} color="cyan" />
                    </View>
                  </View>

                </View>

              </View>

              {/* Input HP Container add or subtract */}
              <View style={[styles.subheaderHpContainer, { borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
                <TextInput
                  placeholder="0"
                  keyboardType="number-pad"
                  placeholderTextColor="gray"
                  onChangeText={setInputHpValue}
                  style={[styles.modalInputTempHp, { fontSize: 60 }]}
                  value={inputHpValue}
                  maxLength={3}
                />
                <View style={[styles.subheaderSideBySide, { padding: 5, paddingTop: 0 }]}>
                  <TouchableOpacity
                    style={styles.modalButtonSubtract}
                    onPress={() => handleHpChange('subtract')}
                  >
                    <MaterialCommunityIcons name="skull-crossbones" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButtonAdd}
                    onPress={() => handleHpChange('add')}
                  >
                    <MaterialCommunityIcons name="heart-plus" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          :
          <View style={[styles.subheader, { padding: 10, borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
            <Text style={[styles.subheaderText, { color: 'white', textAlign: 'center' }]}>Please create a character</Text>
          </View>
        }

      </TouchableWithoutFeedback>

      {/* Actions Grid */}
      <FlatList
        // data={dataWithAddButton}
        data={[...combinedActions, null]}
        renderItem={renderActionBlocks}
        keyExtractor={(item: ActionBlock | null) => (item ? item.id : 'add-button')}
        key={numColumns} // Important for resetting the layout
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
      />

      {/* Footer Section */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Footer Button */}
        <ImageBackground source={endActionImageTyped} style={styles.footerButtonContainer} resizeMode="cover" >
          <TouchableOpacity style={styles.footerButton} onPress={endTurn}>
            <Text style={styles.footerButtonText}>Wait 6s</Text>
            <Ionicons name="hourglass" size={22} color="white" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        </ImageBackground>

      </View>


      {/* Action Details Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={actionModalVisible}
      >
        <TouchableWithoutFeedback onPress={() => {
          setActionModalVisible(false);
          setKnownInfusionValue('');
        }}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                {selectedAction && (
                  <View>
                    {/* Image, Title and Cost Section */}
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      {/* Image Section */}
                      <TouchableWithoutFeedback onLongPress={handleImageLongPress} style={styles.itemModalImageContainer}>
                        {selectedAction?.image ? (
                          <Image
                            source={getActionImage(selectedAction) as ImageSourcePropType}
                            style={styles.itemModalImage}
                          />
                        ) : (
                          <View style={styles.itemModalNoImage}>
                            <Text>No Image Available</Text>
                          </View>
                        )}
                      </TouchableWithoutFeedback>
                      <View style={{ flex: 1 }}>
                        {/* Title Section */}
                        {editingField === 'title' && !defaultActions.find(action => action.id === selectedAction?.id) ? (
                          <TextInput
                            style={styles.modalInput}
                            value={editedActionName}
                            onChangeText={setEditedActionName}
                            keyboardType="default"
                            onBlur={saveActionName}
                            onSubmitEditing={saveActionName}
                            autoFocus={true}
                          />
                        ) : (
                          <TouchableWithoutFeedback onLongPress={handleTitleLongPress}>
                            <Text style={styles.modalTitle}>
                              {selectedAction.name === 'Attack'
                                ? (isArmed ? 'Armed ' : 'Unarmed ')
                                : ''}{selectedAction?.name}
                            </Text>
                          </TouchableWithoutFeedback>
                        )}

                        {/* Weapon Type Section */}
                        {['Attack', 'Ranged Attack', 'Offhand Attack'].map((actionType) => {
                          const weapon = actionType === 'Attack'
                            ? mainHandWeapon
                            : actionType === 'Ranged Attack'
                              ? rangedHandWeapon
                              : offHandWeapon;
                          const weaponType =
                            weapon && weapon.name !== 'none'
                              ? weapon.weaponType || '?'
                              : '?';

                          if (selectedAction.name !== actionType) {
                            return null;
                          }

                          return (
                            <View
                              key={actionType}
                              style={{ flexDirection: 'column', marginBottom: 5 }}
                            >
                              <View style={{ flexDirection: 'row' }}>
                                <Text>Name: </Text>
                                <Text>{weapon?.name || '?'}</Text>
                              </View>
                              <View style={{ flexDirection: 'row' }}>
                                <Text>Weapon Type: </Text>
                                <Text style={{ textTransform: 'capitalize' }}>
                                  {weaponType}{weaponsProficientIn.map(w => w.toLowerCase()).includes(weaponType.toLowerCase()) ? '' : ' (Inept)'}
                                </Text>
                              </View>
                            </View>
                          );
                        })}

                        {/* Cost Section */}
                        <View style={styles.modalCostContainer}>
                          <Text>Cost: </Text>
                          {selectedAction.cost.actions > 0 && (
                            <View style={styles.costTextContainer}>
                              <Text>{selectedAction.cost.actions}</Text>
                              <Ionicons name="ellipse" size={16} color="green" />
                            </View>
                          )}
                          {selectedAction.cost.actions > 0 && selectedAction.cost.bonus > 0 && (
                            <Text>, </Text>
                          )}
                          {selectedAction.cost.bonus > 0 && (
                            <View style={styles.costTextContainer}>
                              <Text>{selectedAction.cost.bonus}</Text>
                              <Ionicons name="triangle" size={16} color="#FF8C00" />
                            </View>
                          )}
                          {selectedAction.cost.reaction !== undefined && (
                            <View style={styles.costTextContainer}>
                              <Text>{selectedAction.cost.reaction}</Text>
                              <Ionicons name="square" size={16} color="rgb(200, 0, 255)" />
                            </View>
                          )}
                          {selectedAction.cost.castingTimeText && (
                            <View>
                              <Text style={{ color: 'black' }}>{selectedAction.cost.castingTimeText}</Text>
                            </View>
                          )}

                        </View>


                        {/* If Cantrip, show this text */}
                        {('type' in selectedAction && selectedAction.type === 'cantrip') &&
                          <Text style={{ fontStyle: 'italic', marginBottom: 5, color: 'black' }}>
                            (Detailed in Spellbook)
                          </Text>
                        }

                        {/* If infernal legacy is enabled, and Hellish Rebuke is selected, show this text */}
                        {infernalLegacyEnabled &&
                          ('source' in selectedAction && selectedAction.source === 'race') &&
                          (
                            selectedAction.name.toLowerCase() === 'hellish rebuke' ||
                            selectedAction.name.toLowerCase() === 'darkness' ||
                            selectedAction.name.toLowerCase() === 'thaumaturgy'
                          ) && (
                            <View style={{ flexDirection: 'row', gap: 5 }}>
                              <MaterialCommunityIcons name="emoticon-devil" size={16} color="black" />
                              {selectedAction.name.toLowerCase() === 'hellish rebuke' && (
                                <Text style={{ fontStyle: 'italic', marginBottom: 5, color: 'black' }}>
                                  SpLv2 (3d10)
                                </Text>
                              )}
                            </View>
                          )}

                      </View>
                    </View>

                    {/* Details Section */}
                    {editingField === 'details' && !defaultActions.find(action => action.id === selectedAction?.id) ? (
                      <TextInput
                        style={[styles.modalInput, styles.detailsInput]}
                        value={newActionDetails}
                        onChangeText={setNewActionDetails}
                        keyboardType="default"
                        onBlur={saveActionDetails}
                        onSubmitEditing={saveActionDetails}
                        multiline={true}
                        textAlignVertical="top"
                        autoFocus={true}
                      />
                    ) : (
                      <TouchableWithoutFeedback onLongPress={handleDetailsLongPress}>
                        <Text style={styles.modalDetails}>
                          {selectedAction?.details || 'No details available.'}
                        </Text>
                      </TouchableWithoutFeedback>
                    )}



                    {/* Properties Section */}
                    {/* Melee Weapon Properties Section */}
                    {(selectedAction.name === 'Attack') &&
                      <>
                        {mainHandWeapon && mainHandWeapon.name !== 'none' ? (
                          <>
                            {/* Attack Roll Row */}
                            <View style={[styles.modalWeaponProperty, { padding: 0, paddingHorizontal: 5 }]}>
                              <MaterialCommunityIcons name="sword" size={20} color="black" />
                              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', gap: 5 }}>
                                  <MaterialCommunityIcons name="dice-d20" size={20} color="black" />
                                  {getWeaponAttackBonus(mainHandWeapon) && (
                                    <Text>
                                      +{getWeaponAttackBonus(mainHandWeapon)}
                                    </Text>
                                  )}
                                  <Text>
                                    +({getWeaponSkillModifiers(mainHandWeapon).includes("Strength") && `${currentStrengthModifier} Str`})
                                  </Text>
                                  {getWeaponSkillModifiers(mainHandWeapon).includes("Strength") &&
                                    getWeaponSkillModifiers(mainHandWeapon).includes("Dexterity") &&
                                    <Text> or </Text>}
                                  {getWeaponSkillModifiers(mainHandWeapon).includes("Dexterity") && <Text>+({currentDexModifier} Dex)</Text>}
                                </View>
                                {weaponsProficientIn.includes(mainHandWeapon?.weaponType?.toLowerCase() || '') && (
                                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 5, borderRadius: 5 }}>
                                    <Text>+{proficiencyBonus}</Text>
                                    <Ionicons name="ribbon" size={16} color="black" />
                                  </View>
                                )}
                              </View>
                            </View>
                            {/* Damage Row */}
                            <View style={styles.modalWeaponProperty}>
                              <MaterialCommunityIcons name="skull-crossbones" size={20} color="black" />
                              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <Text>
                                  {getWeaponDamage(mainHandWeapon)}
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                  {getWeaponSkillModifiers(mainHandWeapon).includes("Strength") && <Text>+({currentStrengthModifier} Str)</Text>}
                                  {getWeaponSkillModifiers(mainHandWeapon).includes("Strength") &&
                                    getWeaponSkillModifiers(mainHandWeapon).includes("Dexterity") &&
                                    <Text> or </Text>}
                                  {getWeaponSkillModifiers(mainHandWeapon).includes("Dexterity") && <Text>+({currentDexModifier} Dex)</Text>}
                                </View>
                              </View>
                            </View>
                            <View style={styles.modalWeaponProperty}>
                              <Text>Type: </Text>
                              <Text style={{ textTransform: 'capitalize' }}>
                                {mainHandWeapon && mainHandWeapon.weaponType !== 'none'
                                  ? weapons.weapons.find(
                                    w => w.items.find(
                                      i => i.weaponType?.toLowerCase() === mainHandWeapon.weaponType?.toLowerCase()
                                    ))?.items.find(i => i.weaponType?.toLowerCase() === mainHandWeapon.weaponType?.toLowerCase())?.damageType || '—'
                                  : (!isArmed && selectedAction.name === 'Attack' ? 'Bludgeoning' : '—')}
                              </Text>
                            </View>
                            <View style={styles.modalWeaponProperty}>
                              <Text>Range: </Text>
                              <Text>
                                {mainHandWeapon && mainHandWeapon.weaponType !== 'none'
                                  ? (weapons.weapons.find(
                                    w => w.items.find(
                                      i => i.weaponType?.toLowerCase() === mainHandWeapon.weaponType?.toLowerCase()
                                    ))?.items.find(i => i.weaponType?.toLowerCase() === mainHandWeapon.weaponType?.toLowerCase()) as WeaponItem)?.range || '—'
                                  : '—'}
                              </Text>
                            </View>
                            <View style={styles.modalWeaponProperty}>
                              <Text>Throw Range: </Text>
                              <Text>
                                {mainHandWeapon && mainHandWeapon.weaponType !== 'none'
                                  ? weapons.weapons.find(
                                    w => w.items.find(
                                      i => i.weaponType?.toLowerCase() === mainHandWeapon.weaponType?.toLowerCase()
                                    ))?.items.find(i => i.weaponType?.toLowerCase() === mainHandWeapon.weaponType?.toLowerCase())?.throwRange || '—'
                                  : '—'}
                              </Text>
                            </View>
                            <View style={styles.modalWeaponProperty}>
                              <Text>Properties: </Text>
                              <Text>
                                {mainHandWeapon && mainHandWeapon.name !== 'none'
                                  ? getWeaponProperties(mainHandWeapon).join(', ') || '—'
                                  : '—'}
                                {/* put custom properties here */}
                              </Text>
                            </View>
                            {mainHandWeapon.versatileDamage &&
                              <View style={styles.modalWeaponProperty}>
                                <Text>Versatile: </Text>
                                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                  <Text>{mainHandWeapon.versatileDamage}</Text>
                                  <MaterialIcons name="sign-language" size={20} color="black" />
                                </View>
                              </View>
                            }
                          </>
                        ) : (
                          <View style={{ flexDirection: 'column', gap: 0, padding: 0 }}>
                            <View style={[styles.modalWeaponProperty, { padding: 0, margin: 0, marginLeft: 5, paddingRight: 10 }]}>
                              <MaterialCommunityIcons name="sword" size={20} color="black" />
                              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <MaterialCommunityIcons name="dice-d20" size={20} color="black" />
                                <Text>+({currentStrengthModifier} Str) or +({currentDexModifier} Dex)</Text>
                                {isUnarmedStrikeProficient &&
                                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 5, borderRadius: 5 }}>
                                    <Text>+{proficiencyBonus}</Text>
                                    <Ionicons name="ribbon" size={16} color="black" />
                                  </View>
                                }
                              </View>
                            </View>
                            <View style={styles.modalWeaponProperty}>
                              <MaterialCommunityIcons name="skull-crossbones" size={20} color="black" />
                              <Text>1+({currentStrengthModifier} Str)</Text>
                            </View>
                          </View>

                        )}
                      </>
                    }

                    {/* Ranged Weapon Properties Section */}
                    {(selectedAction.name === 'Ranged Attack') && (
                      <>
                        {rangedHandWeapon && rangedHandWeapon.name !== 'none' ? (
                          <>
                            {/* Modifiers Row */}
                            <View style={[styles.modalWeaponProperty, { padding: 0, paddingHorizontal: 5 }]}>
                              <MaterialCommunityIcons name="sword" size={20} color="black" />
                              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', gap: 5 }}>
                                  <MaterialCommunityIcons name="dice-d20" size={20} color="black" />
                                  {getWeaponAttackBonus(rangedHandWeapon) && (
                                    <Text style={{ marginRight: 5 }}>
                                      +{getWeaponAttackBonus(rangedHandWeapon)}
                                    </Text>
                                  )}
                                  {getWeaponSkillModifiers(rangedHandWeapon).includes("Strength") && <Text>+({currentStrengthModifier} Str)</Text>}
                                  {getWeaponSkillModifiers(rangedHandWeapon).includes("Strength") &&
                                    getWeaponSkillModifiers(rangedHandWeapon).includes("Dexterity") &&
                                    <Text> or </Text>}
                                  {getWeaponSkillModifiers(rangedHandWeapon).includes("Dexterity") && <Text>+({currentDexModifier} Dex)</Text>}
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 5, borderRadius: 5 }}>
                                  <Text>+{proficiencyBonus}</Text>
                                  <Ionicons name="ribbon" size={16} color="black" />
                                </View>
                              </View>
                            </View>
                            {/* Damage Row */}
                            <View style={styles.modalWeaponProperty}>
                              <MaterialCommunityIcons name="skull-crossbones" size={20} color="black" />
                              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <Text>
                                  {getWeaponDamage(rangedHandWeapon)}
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                  {getWeaponSkillModifiers(rangedHandWeapon).includes("Strength") && <Text>+({currentStrengthModifier} Str)</Text>}
                                  {getWeaponSkillModifiers(rangedHandWeapon).includes("Strength") &&
                                    getWeaponSkillModifiers(rangedHandWeapon).includes("Dexterity") &&
                                    <Text> or </Text>}
                                  {getWeaponSkillModifiers(rangedHandWeapon).includes("Dexterity") && <Text>+({currentDexModifier} Dex)</Text>}
                                </View>
                              </View>
                            </View>
                            {/* Type Row */}
                            <View style={styles.modalWeaponProperty}>
                              <Text>Type: </Text>
                              <Text style={{ textTransform: 'capitalize' }}>
                                {rangedHandWeapon && rangedHandWeapon.name !== 'none'
                                  ? weapons.weapons.find(w => w.items.find(i => i.name.toLowerCase() === rangedHandWeapon.name.toLowerCase()))?.items.find(i => i.name.toLowerCase() === rangedHandWeapon.name.toLowerCase())?.damageType || '—'
                                  : '—'}
                              </Text>
                            </View>
                            {/* Range Row */}
                            <View style={styles.modalWeaponProperty}>
                              <Text>Range: </Text>
                              <Text>
                                {rangedHandWeapon && rangedHandWeapon.name !== 'none'
                                  ? (weapons.weapons.find(w => w.items.find(i => i.name.toLowerCase() === rangedHandWeapon.name.toLowerCase()))?.items.find(i => i.name.toLowerCase() === rangedHandWeapon.name.toLowerCase()) as WeaponItem)?.range || '—'
                                  : '—'}
                              </Text>
                            </View>
                            {/* Throw Range Row */}
                            <View style={styles.modalWeaponProperty}>
                              <Text>Throw Range: </Text>
                              <Text>
                                {rangedHandWeapon && rangedHandWeapon.name !== 'none'
                                  ? weapons.weapons.find(w => w.items.find(i => i.name === rangedHandWeapon.name))?.items.find(i => i.name === rangedHandWeapon.name)?.throwRange || '—'
                                  : '—'}
                              </Text>
                            </View>
                            {/* Properties Row */}
                            <View style={styles.modalWeaponProperty}>
                              <Text>Properties: </Text>
                              <Text>
                                {rangedHandWeapon && rangedHandWeapon.name !== 'none'
                                  ? weapons.weapons.find(w => w.items.find(i => i.name === rangedHandWeapon.name))?.items.find(i => i.name === rangedHandWeapon.name)?.properties.join(', ') || '—'
                                  : '—'}
                                {/* put custom properties here */}
                              </Text>
                            </View>
                          </>
                        ) : (
                          <Text>No Ranged Weapon Equipped</Text>
                        )}
                      </>
                    )}

                    {/* Shove Details */}
                    {(selectedAction.name === 'Shove') && (
                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                          <MaterialCommunityIcons name="dice-d20" size={20} color="black" />
                          <Text>+({calculateModifier(statsData.abilities.find(a => a.name === 'Strength')?.value || 10)} Athle)</Text>
                        </View>
                        <Text style={{ fontSize: 24 }}>{'>'}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                          <View style={styles.enemyDiceContainer}>
                            <MaterialCommunityIcons name="dice-d20" size={20} color="red" />
                          </View>
                          <Text>+(Athle) or +(Acrob)</Text>
                        </View>
                      </View>
                    )}

                    {/* Offhand Attack Details */}
                    {(selectedAction.name === 'Offhand Attack') && (
                      <View>
                        {offHandWeapon && offHandWeapon.name !== 'none' ? (
                          <>
                            {/* Modifiers Row */}
                            <View style={[styles.modalWeaponProperty, { padding: 0, paddingHorizontal: 5 }]}>
                              <MaterialCommunityIcons name="sword" size={20} color="black" />
                              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', gap: 5 }}>
                                  <MaterialCommunityIcons name="dice-d20" size={20} color="black" />
                                  {getWeaponAttackBonus(offHandWeapon) && (
                                    <Text style={{ marginRight: 5 }}>
                                      +{getWeaponAttackBonus(offHandWeapon)}
                                    </Text>
                                  )}
                                  {getWeaponSkillModifiers(offHandWeapon).includes("Strength") && <Text>+({currentStrengthModifier} Str)</Text>}
                                  {getWeaponSkillModifiers(offHandWeapon).includes("Strength") &&
                                    getWeaponSkillModifiers(offHandWeapon).includes("Dexterity") &&
                                    <Text>or</Text>}
                                  {getWeaponSkillModifiers(offHandWeapon).includes("Dexterity") && <Text>+({currentDexModifier} Dex)</Text>}
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 5, borderRadius: 5 }}>
                                  <Text>+{proficiencyBonus}</Text>
                                  <Ionicons name="ribbon" size={16} color="black" />
                                </View>
                              </View>
                            </View>
                            {/* Damage Row */}
                            <View style={styles.modalWeaponProperty}>
                              <MaterialCommunityIcons name="skull-crossbones" size={20} color="black" />
                              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <Text>
                                  {getWeaponDamage(offHandWeapon)}
                                </Text>
                                {isTwoWeaponFightingProficient &&
                                  <View style={{ flexDirection: 'row' }}>
                                    {getWeaponSkillModifiers(offHandWeapon).includes("Strength") && <Text>+({currentStrengthModifier} Str)</Text>}
                                    {getWeaponSkillModifiers(offHandWeapon).includes("Strength") &&
                                      getWeaponSkillModifiers(offHandWeapon).includes("Dexterity") &&
                                      <Text> or </Text>}
                                    {getWeaponSkillModifiers(offHandWeapon).includes("Dexterity") && <Text>+({currentDexModifier} Dex)</Text>}
                                  </View>
                                }
                              </View>
                            </View>
                          </>
                        ) : (
                          <Text>No Offhand Weapon Equipped</Text>
                        )}
                      </View>
                    )}

                    {/* Cantrip Features */}
                    {cantripsData.find(c => c.name.toLowerCase() === selectedAction.name.toLowerCase()) && (
                      <View style={styles.modalWeaponProperty}>
                        <View style={{ gap: 5 }}>
                          {(() => {
                            const features = cantripsData.find(c => c.name === selectedAction.name)?.features;
                            if (!features) return null;

                            // Handle array of strings or objects
                            if (Array.isArray(features)) {
                              return features.map((feature, index) => {
                                if (typeof feature === 'object') {
                                  return (
                                    <View key={index} style={{ marginBottom: 5 }}>
                                      <Text style={{ fontWeight: 'bold' }}>{feature.effect}</Text>
                                      <Text style={{ marginLeft: 10 }}>{feature.details}</Text>
                                    </View>
                                  );
                                }
                                return (
                                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>{`${index + 1}). ${feature}`}</Text>
                                  </View>
                                );
                              });
                            }

                            // Handle string
                            if (typeof features === 'string') {
                              return <Text>• {features}</Text>;
                            }

                            // Handle object
                            return Object.entries(features).map(([key, value]) => {
                              if (typeof value === 'object' && value !== null) {
                                return (
                                  <View key={key} style={{ marginBottom: 5 }}>
                                    <Text style={{ fontWeight: 'bold' }}>{key}</Text>
                                    {Object.entries(value).map(([subKey, subValue]) => (
                                      <Text key={subKey} style={{ marginLeft: 10 }}>
                                        Level {subKey}: {String(subValue)}
                                      </Text>
                                    ))}
                                  </View>
                                );
                              }
                              return (
                                <Text key={key}>
                                  <Text style={{ fontWeight: 'bold' }}>{key}:</Text> {value}
                                </Text>
                              );
                            });
                          })()}
                        </View>
                      </View>
                    )}

                    {/* Draconic Damage Details */}
                    {('source' in selectedAction) && (selectedAction.source === 'race') &&
                      (statsData?.race?.toLowerCase() === 'dragonborn') && (
                        <>
                          <View style={styles.modalWeaponProperty}>
                            <MaterialCommunityIcons name="skull-scan" size={20} color="black" />
                            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                              <Text>8 + ({calculateModifier(statsData.abilities.find(a => a.name === 'Constitution')?.value || 10)} Con)</Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 5, borderRadius: 5 }}>
                                <Text>+{proficiencyBonus}</Text>
                                <Ionicons name="ribbon" size={16} color="black" />
                              </View>
                            </View>
                          </View>
                          <View style={styles.modalWeaponProperty}>
                            <MaterialCommunityIcons name="skull-crossbones" size={20} color="black" />
                            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                              <Text>
                                {statsData.level <= 5 ? '2d6' :
                                  statsData.level <= 10 ? '3d6' :
                                    statsData.level <= 15 ? '4d6' : '5d6'}
                              </Text>
                              <MaterialCommunityIcons name="shield-check" size={16} color="black" />
                              <Text>or {statsData.level <= 5 ? '2d6' :
                                statsData.level <= 10 ? '3d6' :
                                  statsData.level <= 15 ? '4d6' : '5d6'}/2</Text>
                              <MaterialCommunityIcons name="shield-off" size={16} color="black" />
                            </View>
                          </View>

                        </>
                      )}

                    {/* Artificer Infuse Item */}
                    {statsData.class === 'artificer' && selectedAction.name.toLowerCase() === 'infuse item' && (
                      renderKnownInfusionsDropdown()
                    )}



                    {/* Modal Buttons */}
                    <View style={[styles.modalButtons, { flexDirection: 'row', gap: 10 }]}>
                      {/* short rest button -- only show if action is rest */}
                      {selectedAction.name.toLowerCase() === 'rest' && (
                        <TouchableOpacity
                          style={[styles.modalButtonCommit, { flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center' }]}
                          onPress={() => {
                            Alert.alert('Short Rest', `Roll 1d${hitDice} + (${calculateModifier(statsData.abilities.find(a => a.name === 'Constitution')?.value || 10)} Con) and add the result to your hit points.`);
                            setActionModalVisible(false);
                            setCurrentActionsAvailable(1);
                            setCurrentBonusActionsAvailable(1);
                            setCurrentReactionsAvailable(1);
                          }}>
                          <MaterialCommunityIcons name="sleep" size={16} color="black" />
                          <Text>Short Rest</Text>
                        </TouchableOpacity>
                      )}

                      {/* Commit Button */}
                      <TouchableOpacity
                        style={[
                          styles.modalButtonCommit,
                          selectedAction &&
                          (currentActionsAvailable < selectedAction.cost.actions ||
                            currentBonusActionsAvailable < selectedAction.cost.bonus ||
                            selectedAction.cost.reaction !== undefined && currentReactionsAvailable < selectedAction.cost.reaction ||
                            (selectedAction.name.toLowerCase() === 'hellish rebuke' && hellishRebukeSpent) ||
                            (selectedAction.name.toLowerCase() === 'darkness' && darknessSpent)) && { opacity: 0.2 }
                        ]}
                        onPress={() => {
                          if (selectedAction.name.toLowerCase() === 'rest') {
                            handleHpChange('replenish');
                            setSpentSpellSlots({
                              ...spentSpellSlots,
                              SpLv1: 0,
                              SpLv2: 0,
                              SpLv3: 0,
                              SpLv4: 0,
                              SpLv5: 0,
                              SpLv6: 0,
                              SpLv7: 0,
                              SpLv8: 0,
                              SpLv9: 0
                            });
                            if (!luckyPoints && luckyPointsEnabled) {
                              setLuckyPoints(luckyPointsMax);
                            }
                            if (relentlessEnduranceGained && !relentlessEnduranceUsable) {
                              setRelentlessEnduranceUsable(true);
                            }
                            if (infernalLegacyEnabled) {
                              setDarknessSpent(false);
                              setHellishRebukeSpent(false);
                            }
                            if (breathWeaponEnabled) {
                              setBreathWeaponSpent(false);
                            }
                            if (infuseItemEnabled) {
                              setInfuseItemSpent(false);
                            }
                          }

                          // if action is hellish rebuke, set hellish rebuke spent to true
                          if (selectedAction.name.toLowerCase() === 'hellish rebuke') {
                            setHellishRebukeSpent(true);
                          }
                          // if action is darkness, set darkness spent to true
                          if (selectedAction.name.toLowerCase() === 'darkness') {
                            setDarknessSpent(true);
                          }
                          if (selectedAction.name.toLowerCase() === 'breath weapon') {
                            setBreathWeaponSpent(true);
                          }
                          if (selectedAction.name.toLowerCase() === 'infuse item') {
                            setInfuseItemSpent(true);
                            setKnownInfusionValue('');
                          }

                          // Default commit action
                          commitAction();
                        }}
                        disabled={
                          !selectedAction ||
                          currentActionsAvailable < selectedAction.cost.actions ||
                          currentBonusActionsAvailable < selectedAction.cost.bonus ||
                          (selectedAction.cost.reaction !== undefined && currentReactionsAvailable < selectedAction.cost.reaction) ||
                          (selectedAction.name.toLowerCase() === 'hellish rebuke' && hellishRebukeSpent) ||
                          (selectedAction.name.toLowerCase() === 'darkness' && darknessSpent) ||
                          (selectedAction.name.toLowerCase() === 'infuse item' && infuseItemSpent)
                        }
                      >
                        <View style={styles.modalButtonTextContainer}>

                          {selectedAction.name.toLowerCase() !== 'rest' ? (
                            <Text>
                              {selectedAction.name}
                            </Text>
                          ) :
                            <View style={styles.costTextContainer}>
                              <MaterialCommunityIcons name="campfire" size={16} color="black" />
                              <Text style={styles.modalButtonTextBlack}>Long Rest</Text>
                            </View>
                          }

                        </View>
                      </TouchableOpacity>
                    </View>

                  </View>
                )}

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Infusion Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={infusionModalVisible}
      >
        <View style={styles.fullScreenModalContainer}>
          {renderInfusionDetails()}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={() => {
              setInfusionModalVisible(false);
              setActionModalVisible(true);
            }}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Action Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Create New Action</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Action Name"
                  placeholderTextColor="gray"
                  onChangeText={(text: string) => setNewActionName(text)}
                  value={newActionName}
                />
                <TextInput
                  style={[styles.modalInput, styles.detailsInput]}
                  placeholder="Action Details"
                  placeholderTextColor="gray"
                  onChangeText={(text: string) => setNewActionDetails(text)}
                  value={newActionDetails}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                {/* Cost Input Fields */}
                <Text>Cost</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Actions"
                  placeholderTextColor="gray"
                  keyboardType="number-pad"
                  value={newActionCost.actions.toString()}
                  onChangeText={(text: string) => setNewActionCost({ ...newActionCost, actions: Number(text) || 0 })}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Bonus Actions"
                  placeholderTextColor="gray"
                  keyboardType="number-pad"
                  value={newActionCost.bonus.toString()}
                  onChangeText={(text: string) => setNewActionCost({ ...newActionCost, bonus: Number(text) || 0 })}
                />

                <TouchableOpacity style={styles.imagePickerButton} onPress={() => pickImage(true)}>
                  <Text style={styles.imagePickerButtonText}>Select Image</Text>
                </TouchableOpacity>
                {newActionImage && (
                  <Image
                    source={{ uri: newActionImage }}
                    style={styles.selectedImage}
                  />
                )}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButtonAddAction}
                    onPress={addAction}
                  >
                    <Text style={styles.modalButtonText}>Create Action</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={resetModalVisible}
      >
        <TouchableWithoutFeedback onPress={() => setResetModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Reset Actions</Text>
              <Text style={styles.modalText}>
                Are you sure? This will delete all custom actions. This cannot be undone.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setResetModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonReset}
                  onPress={resetActions}
                >
                  <Ionicons
                    name="nuclear"
                    size={24}
                    color="red"
                    style={[styles.headerIcon, { color: 'white' }]}
                  />
                  <Text style={styles.modalButtonText}>Reset to Default</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
}
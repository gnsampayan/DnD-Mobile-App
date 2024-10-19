import { useState, useEffect, useContext } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/actionsStyles';

import defaultAttackImage from '@actions/default-attack-image.png';
import defaultThrowImage from '@actions/default-throw-image.png';
import defaultPushImage from '@actions/default-push-image.png';
import defaultJumpImage from '@actions/default-jump-image.png';
import defaultHideImage from '@actions/default-hide-image.png';
import defaultSprintImage from '@actions/default-sprint-image.png';
import addActionImage from '@actions/add-action-image.png';
import endActionImage from '@actions/end-action-image-v3.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StatsDataContext from '../context/StatsDataContext';
const addActionImageTyped: ImageSourcePropType = addActionImage as ImageSourcePropType;
const endActionImageTyped: ImageSourcePropType = endActionImage as ImageSourcePropType;
// Define the base Action interface
interface BaseAction {
  id: string;
  name: string;
  cost: { actions: number; bonus: number };
  details?: string;
  image?: string; // Add optional image property
}

interface Ability {
  id: number;
  name: string;
  value: number;
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

// Define specific action types if needed
interface DefaultActionBlock extends BaseAction {
  // Additional properties specific to default actions
}


interface CustomActionBlock extends BaseAction {
  // Additional properties specific to custom actions
}

// Create a union type for Action
type ActionBlock = DefaultActionBlock | CustomActionBlock;

// Default actions that cannot be deleted
const defaultActions: ActionBlock[] = [
  { id: '0', name: 'Sprint', details: 'Double your movement speed', cost: { actions: 1, bonus: 0 }, image: defaultSprintImage },
  { id: '1', name: 'Hide', details: 'Attempt to conceal yourself', cost: { actions: 1, bonus: 0 }, image: defaultHideImage },
  { id: '2', name: 'Jump', details: 'Leap over obstacles', cost: { actions: 1, bonus: 0 }, image: defaultJumpImage },
  { id: '3', name: 'Push', details: 'Move an object or creature forward', cost: { actions: 0, bonus: 1 }, image: defaultPushImage },
  { id: '4', name: 'Throw', details: 'Hurl an object or creature at a target', cost: { actions: 1, bonus: 0 }, image: defaultThrowImage },
  { id: '5', name: 'Attack', details: 'Make a melee or ranged attack', cost: { actions: 1, bonus: 0 }, image: defaultAttackImage },
];

const movementSpeed = 30;


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
  // State for new action cost
  const [newActionCost, setNewActionCost] = useState<{ actions: number; bonus: number }>({ actions: 0, bonus: 0 });
  // State to hold the current Constitution modifier
  const [currentConModifier, setCurrentConModifier] = useState<number>(0);

  // Convert available actions to state
  const [currentActionsAvailable, setCurrentActionsAvailable] = useState<number>(1);
  const [currentBonusActionsAvailable, setCurrentBonusActionsAvailable] = useState<number>(1);

  // Path to the actions.json file
  const ACTIONS_FILE_PATH = `${FileSystem.documentDirectory}actions.json`;
  // Use context for statsData
  const { statsData } = useContext(StatsDataContext) as { statsData: StatsData };

  if (!statsData) {
    // Render a loading indicator or return null
    return null;
  }

  const calculateModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };
  // Extract Constitution ability from statsData
  useEffect(() => {
    const constitutionAbility = statsData.abilities.find((ability) => ability.name === 'Constitution');
    const constitutionScore = constitutionAbility ? constitutionAbility.value : 10; // Default to 10 if not found
    const newConModifier = calculateModifier(constitutionScore);
    setCurrentConModifier(newConModifier);
  }, [statsData.abilities]);

  const { hpIncreases = {}, hitDice = 0 } = statsData || {};

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

  // Calculate AC based on Dexterity
  useEffect(() => {
    if (statsData.abilities) {
      const dexterity = statsData.abilities.find(
        (ability) => ability.name === 'Dexterity'
      );
      if (dexterity) {
        const dexModifier = Math.floor((dexterity.value - 10) / 2);
        setAc(10 + dexModifier);
      }
    }
  }, [statsData]);

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
      setProficiencyBonus(newProficiencyBonus);
    }
  }, [statsData?.level]);




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
      FileSystem.deleteAsync(actionToDelete.image, { idempotent: true }).catch(error => {
        console.error('Failed to delete image file:', error);
      });
    }

    const updatedActions = actions.filter((action) => action.id !== actionId);
    setActions(updatedActions);
    saveActions(updatedActions);
  };

  const handleLongPress = (actionId: string) => {
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
          return FileSystem.deleteAsync(action.image, { idempotent: true });
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
                FileSystem.deleteAsync(action.image, { idempotent: true }).catch(error => {
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
      if (isDefaultAction(selectedAction.id)) {
        Alert.alert('Information', 'You cannot edit the title of default actions.');
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
      if (isDefaultAction(selectedAction.id)) {
        Alert.alert('Information', 'You cannot edit the details of default actions.');
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
      if (isDefaultAction(selectedAction.id)) {
        Alert.alert('Information', 'You cannot edit the image of default actions.');
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
                    FileSystem.deleteAsync(selectedAction.image, { idempotent: true }).catch(error => {
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
      const { actions: costActions, bonus: costBonus } = selectedAction.cost;

      if (
        currentActionsAvailable >= costActions &&
        currentBonusActionsAvailable >= costBonus
      ) {
        // Subtract the cost from available actions
        setCurrentActionsAvailable(prev => prev - costActions);
        setCurrentBonusActionsAvailable(prev => prev - costBonus);
        setActionModalVisible(false);
        Alert.alert('Success', `${selectedAction.name} committed.`);
      } else {
        Alert.alert('Insufficient Resources', 'You do not have enough actions or bonus actions for this.');
      }
    }
  };


  const endTurn = () => {
    setCurrentActionsAvailable(1);
    setCurrentBonusActionsAvailable(1);
  };

  const windowWidth = Dimensions.get('window').width;
  const itemWidth = (windowWidth - (30 + (numColumns - 1) * 10)) / numColumns; // 20 for horizontal padding, 10 for gap between items

  const renderActionBlocks = ({ item }: { item: ActionBlock | null }) => {
    if (item) {
      const affordable =
        currentActionsAvailable >= item.cost.actions &&
        currentBonusActionsAvailable >= item.cost.bonus;

      return (
        <ImageBackground
          source={
            item?.image
              ? typeof item.image === 'number'
                ? item.image // Local image imported via require/import
                : { uri: item.image } // URI from file system or remote
              : { uri: 'https://via.placeholder.com/150?text=&bg=EEEEEE' }
          }
          style={[
            styles.itemContainer,
            { width: itemWidth, opacity: affordable ? 1 : 0.2 }
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
            disabled={!affordable}
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

  // Prepare data by adding a null item to represent the add button
  const dataWithAddButton = [...actions, null];

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
            <View style={styles.hpContainer}>
              {(hp !== null && maxHp > 0) && (
                <View style={styles.hpBarContainer}>
                  {renderHpBar()}
                </View>
              )}
              <View style={styles.hpTextContainer}>
                <Text style={styles.hpText}>
                  {hp !== null && hp > 0
                    ? `${hp + tempHp}`
                    : <Ionicons name="skull" size={14} color="white" />}
                </Text>
                <Text style={styles.subheaderText}>/{maxHp}</Text>
              </View>
            </View>
            <View style={styles.subheaderInline}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={styles.subheaderSideBySide}>
                  <View style={[styles.subheaderHpContainer, { borderColor: 'rgba(255, 255, 255, 0.1)', flexDirection: 'row' }]}>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={styles.hpText}>{proficiencyBonus}</Text>
                      <View style={styles.subheaderSideBySide}>
                        <Ionicons name="aperture" size={24} color="darkgoldenrod" />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={styles.hpText}>{ac}</Text>
                      <View style={styles.subheaderSideBySide}>
                        <Ionicons name="shield" size={24} color="rgb(146, 187, 204)" />
                      </View>
                    </View>
                  </View>

                  <View style={[styles.subheaderHpContainer, { borderColor: 'darkgoldenrod' }]}>
                    <TextInput
                      placeholder="0"
                      keyboardType="number-pad"
                      placeholderTextColor="gray"
                      style={[styles.modalInputTempHp, { fontSize: 20 }]}
                      onChangeText={(value) => {
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
                <View style={styles.subheaderSideBySide}>


                  <View style={[styles.subheaderHpContainer, { borderColor: 'rgba(255, 255, 255, 0.1)', flexDirection: 'row' }]}>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={styles.hpText}>{movementSpeed}</Text>
                      <View style={styles.subheaderSideBySide}>
                        <Ionicons name="footsteps" size={24} color="gray" />
                      </View>
                    </View>

                  </View>



                  <TouchableOpacity
                    style={styles.replenishContainer}
                    onPress={() => handleHpChange('replenish')}
                  >
                    {/* <ImageBackground source={longRestImageTyped} style={styles.modalButtonReplenish} resizeMode="cover" >
                    </ImageBackground> */}
                    <Ionicons name="bed" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.subheaderHpContainer, { borderColor: 'rgba(218, 165, 32, 0.3)' }]}>
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
                    {/* <ImageBackground source={damageOrbImageTyped} style={styles.hpButtonImage} resizeMode="cover" >
                    </ImageBackground> */}
                    <Ionicons name="remove" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButtonAdd}
                    onPress={() => handleHpChange('add')}
                  >
                    {/* <ImageBackground source={healingOrbImageTyped} style={styles.hpButtonImage} resizeMode="cover" >
                    </ImageBackground> */}
                    <Ionicons name="add" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          :
          <View style={styles.subheader}>
            <Text style={[styles.subheaderText, { color: 'white' }]}>Please create a character</Text>
          </View>
        }

      </TouchableWithoutFeedback>

      {/* Actions Grid */}
      <FlatList
        data={dataWithAddButton}
        renderItem={renderActionBlocks}
        keyExtractor={(item) => (item ? item.id : 'add-button')}
        key={numColumns} // Important for resetting the layout
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
      />

      {/* Footer Button */}
      <ImageBackground source={endActionImageTyped} style={styles.footerButtonContainer} resizeMode="cover" >
        <TouchableOpacity style={styles.footerButton} onPress={endTurn}>
          <Text style={styles.footerButtonText}>Next Turn</Text>
          <Ionicons name="refresh" size={28} color="white" style={{ marginLeft: 5 }} />
        </TouchableOpacity>
      </ImageBackground>

      {/* Action Details Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={actionModalVisible}
      >
        <TouchableWithoutFeedback onPress={() => setActionModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                {selectedAction && (
                  <>

                    {/* Image Section */}
                    <TouchableWithoutFeedback onLongPress={handleImageLongPress} style={styles.itemModalImageContainer}>
                      {selectedAction?.image ? (
                        <Image
                          source={
                            typeof selectedAction.image === 'number'
                              ? selectedAction.image
                              : { uri: selectedAction.image }
                          }
                          style={styles.itemModalImage}
                        />
                      ) : (
                        <View style={styles.itemModalNoImage}>
                          <Text>No Image Available</Text>
                        </View>
                      )}
                    </TouchableWithoutFeedback>

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
                        <Text style={styles.modalTitle}>{selectedAction?.name}</Text>
                      </TouchableWithoutFeedback>
                    )}

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

                    {/* Cost Section */}
                    <View style={styles.modalCostContainer}>
                      <Text>Cost: </Text>
                      {selectedAction.cost.actions === 0 ? null : (
                        <View style={styles.costTextContainer}>
                          <Text>{selectedAction.cost.actions}</Text>
                          <Ionicons name="ellipse" size={16} color="green" />
                        </View>
                      )}
                      {selectedAction.cost.actions !== 0 && selectedAction.cost.bonus !== 0 && (
                        <Text>, </Text>
                      )}
                      {selectedAction.cost.bonus === 0 ? null : (
                        <View style={styles.costTextContainer}>
                          <Text>{selectedAction.cost.bonus}</Text>
                          <Ionicons name="triangle" size={16} color="#FF8C00" />
                        </View>
                      )}
                    </View>

                    {/* Modal Buttons */}
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[
                          styles.modalButtonCommit,
                          selectedAction &&
                          (currentActionsAvailable < selectedAction.cost.actions ||
                            currentBonusActionsAvailable < selectedAction.cost.bonus) && { opacity: 0.5 }
                        ]}
                        onPress={commitAction}
                        disabled={
                          !selectedAction ||
                          currentActionsAvailable < selectedAction.cost.actions ||
                          currentBonusActionsAvailable < selectedAction.cost.bonus
                        }
                      >
                        <View style={styles.modalButtonTextContainer}>
                          <Text>Commit: </Text>
                          {selectedAction.cost.actions === 0 ? null : (
                            <View style={styles.costTextContainer}>
                              <Text style={styles.modalButtonTextBlack}>{selectedAction.cost.actions}</Text>
                              <Ionicons name="ellipse" size={16} color="green" />
                            </View>
                          )}
                          {selectedAction.cost.actions !== 0 && selectedAction.cost.bonus !== 0 && (
                            <Text>, </Text>
                          )}
                          {selectedAction.cost.bonus === 0 ? null : (
                            <View style={styles.costTextContainer}>
                              <Text style={styles.modalButtonTextBlack}>{selectedAction.cost.bonus}</Text>
                              <Ionicons name="triangle" size={16} color="#FF8C00" />
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
                <Text style={styles.modalTitle}>Add New Action</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Action Name"
                  placeholderTextColor="gray"
                  onChangeText={(text) => setNewActionName(text)}
                  value={newActionName}
                />
                <TextInput
                  style={[styles.modalInput, styles.detailsInput]}
                  placeholder="Action Details"
                  placeholderTextColor="gray"
                  onChangeText={(text) => setNewActionDetails(text)}
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
                  onChangeText={(text) => setNewActionCost({ ...newActionCost, actions: Number(text) || 0 })}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Bonus Actions"
                  placeholderTextColor="gray"
                  keyboardType="number-pad"
                  value={newActionCost.bonus.toString()}
                  onChangeText={(text) => setNewActionCost({ ...newActionCost, bonus: Number(text) || 0 })}
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
                    style={styles.modalButtonAdd}
                    onPress={addAction}
                  >
                    <Text style={styles.modalButtonText}>Add</Text>
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
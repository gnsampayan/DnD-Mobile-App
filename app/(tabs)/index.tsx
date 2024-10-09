import { useState, useEffect } from 'react';
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

  // State for new action cost
  const [newActionCost, setNewActionCost] = useState<{ actions: number; bonus: number }>({ actions: 0, bonus: 0 });

  // Convert available actions to state
  const [currentActionsAvailable, setCurrentActionsAvailable] = useState<number>(1);
  const [currentBonusActionsAvailable, setCurrentBonusActionsAvailable] = useState<number>(1);

  // Path to the actions.json file
  const ACTIONS_FILE_PATH = `${FileSystem.documentDirectory}actions.json`;

  // Load actions from file system when the component mounts
  useEffect(() => {
    loadActions();
  }, []);


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
            { opacity: affordable ? 1 : 0.2 }
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
          style={styles.addItemContainer}
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>
              Actions: {currentActionsAvailable}
            </Text>
            <Ionicons name="ellipse" size={16} color="green" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>
              Bonus Actions: {currentBonusActionsAvailable}
            </Text>
            <Ionicons name="triangle" size={16} color="#FF8C00" />
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
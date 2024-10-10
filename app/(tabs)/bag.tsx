import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  AlertButton,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/bagStyles';

import bedrollImage from '@items/default-item-bedroll.png';
import campingSuppliesImage from '@items/default-item-camping-supplies.png';
import coinPouchImage from '@items/default-item-coin-pouch.png';
import addItemImage from '@items/add-item-image.png';
const addItemImageTyped: ImageSourcePropType = addItemImage as ImageSourcePropType;

// Define the base Item interface
interface BaseItem {
  id: string;
  name: string;
  quantity: number;
  image?: string; // Optional image property
  details?: string; // **Add the details property**
}


// Define specific item types
interface Food extends BaseItem {
  // Additional properties specific to Food
}

interface Weapon extends BaseItem {
  // Additional properties specific to Weapon
}


interface Wares extends BaseItem {
  // Additional properties specific to Wares
}

interface MagicItem extends BaseItem {
  // Additional properties specific to MagicItem
}

interface Special extends BaseItem {
  // Additional properties specific to Special
}

interface Misc extends BaseItem {
  // Additional properties specific to Misc
}

// Create a union type for Item
type Item = Food | Weapon | Wares | MagicItem | Special | Misc;

// **Default starting items with details**
const defaultItems: Item[] = [
  {
    id: '0',
    name: 'Bed Roll',
    quantity: 1,
    image: bedrollImage,
    details: 'A simple bed roll for resting.',
  },
  {
    id: '1',
    name: 'Camping Supplies',
    quantity: 4,
    image: campingSuppliesImage,
    details: 'Supplies needed for camping in the wilderness.',
  },
  {
    id: '2',
    name: 'Coin Pouch',
    quantity: 1,
    image: coinPouchImage,
    details: 'A small pouch containing coins.',
  },
];


export default function BagScreen() {
  const [numColumns, setNumColumns] = useState(4);
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [newItem, setNewItem] = useState<{ name: string; quantity: number; image?: string; details?: string }>({
    name: '',
    quantity: 1,
    image: undefined,
    details: '',
  });


  // Path to the items.json file
  const ITEMS_FILE_PATH = `${FileSystem.documentDirectory}items.json`;

  // Load items from local storage when the component mounts
  useEffect(() => {
    loadItems();
  }, []);


  // Function to load items from file system
  const loadItems = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(ITEMS_FILE_PATH);
      if (fileInfo.exists) {
        const jsonString = await FileSystem.readAsStringAsync(ITEMS_FILE_PATH);
        const parsedItems: Item[] = JSON.parse(jsonString);

        setItems(parsedItems);
      } else {
        // If no items in storage, initialize with default items
        setItems(defaultItems);
        saveItems(defaultItems);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
      // In case of error, initialize with default items
      setItems(defaultItems);
    }
  };


  // Function to save items to local storage
  const saveItems = async (itemsToSave: Item[]) => {
    try {
      const jsonString = JSON.stringify(itemsToSave);
      await FileSystem.writeAsStringAsync(ITEMS_FILE_PATH, jsonString);
    } catch (error) {
      console.error('Failed to save items:', error);
    }
  };


  // Function to clear items and reset to default
  const resetItems = async () => {
    try {
      await FileSystem.deleteAsync(ITEMS_FILE_PATH, { idempotent: true });
      // Delete custom item images
      for (const item of items) {
        if (!isDefaultItem(item.id) && item.image) {
          await FileSystem.deleteAsync(item.image, { idempotent: true }).catch((error) => {
            console.error('Failed to delete image file:', error);
          });
        }
      }
      setItems(defaultItems);
      saveItems(defaultItems);
      setResetModalVisible(false);
    } catch (error) {
      console.error('Failed to reset items:', error);
    }
  };


  const changeNumColumns = () => {
    // Cycle through column numbers from 2 to 4
    setNumColumns((prevColumns) => (prevColumns % 3) + 2);
  };


  // Function to pick an image from the media library
  async function pickImage(forNewItem: boolean = false) {
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

      if (forNewItem) {
        setNewItem((prev) => ({ ...prev, image: newPath }));
      } else if (selectedItem) {
        const updatedItems = items.map((item) => {
          if (item.id === selectedItem.id) {
            return { ...item, image: newPath };
          }
          return item;
        });
        setItems(updatedItems);
        saveItems(updatedItems); // Save updated items
        setSelectedItem((prev) => (prev ? { ...prev, image: newPath } : null));
      }
    }
  }

  // Function to check if an item is a default item
  const isDefaultItem = (itemId: string) => {
    return defaultItems.some((item) => item.id === itemId);
  };

  // Function to find a default item by ID
  function getDefaultItemImage(itemId: string): ImageSourcePropType | undefined {
    const defaultItem = defaultItems.find(item => item.id === itemId);
    return defaultItem ? { uri: defaultItem.image } : undefined;
  }


  // Function to add a new item to the items array
  function addItem() {
    if (newItem.name) {
      // Generate new id based on maximum existing id
      const existingIds = items.map((item) => Number(item.id));
      const maxId = existingIds.length > 0 ? Math.max(...existingIds) : -1;
      const newId = String(maxId + 1);

      const newItemToAdd: Item = {
        id: newId,
        name: newItem.name,
        quantity: Number(newItem.quantity),
        image: newItem.image,
        details: newItem.details,
      };

      const updatedItems = [...items, newItemToAdd];
      setItems(updatedItems);
      saveItems(updatedItems);
      setNewItem({ name: '', quantity: 1, image: undefined, details: '' });
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter the Name of the item.');
    }
  }


  // Function to delete an item from the items array
  const deleteItem = (itemId: string) => {
    const itemToDelete = items.find((item) => item.id === itemId);
    if (itemToDelete && itemToDelete.image) {
      FileSystem.deleteAsync(itemToDelete.image, { idempotent: true }).catch((error) => {
        console.error('Failed to delete image file:', error);
      });
    }

    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    saveItems(updatedItems);
  };


  // Function to handle long press on the item
  const handleLongPress = (itemId: string) => {
    // Check if the item is a default item
    if (isDefaultItem(itemId)) {
      Alert.alert('Information', 'Default items cannot be deleted.');
      return;
    }

    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteItem(itemId),
      },
    ]);
  };



  // Function to render each item in the grid
  const renderItem = ({ item }: { item: Item | null }) => {
    if (item) {
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            setSelectedItem(item);
            setItemModalVisible(true);
          }}
          onLongPress={() => handleLongPress(item.id)}
        >
          {/* Display the item as an ImageBackground */}
          <ImageBackground
            source={
              item?.image
                ? typeof item.image === 'number'
                  ? item.image // Local image imported via require/import
                  : { uri: item.image } // URI from file system or remote
                : { uri: 'https://via.placeholder.com/150?text=&bg=EEEEEE' }
            }
            style={styles.itemImageBackground}
            imageStyle={{ borderRadius: 8 }}
            resizeMode="cover"
          >
            <View style={styles.itemContent}>
              <View style={styles.itemTextContainer}>
                {!item.image && (
                  <Text style={styles.itemText}>{item.name}</Text>
                )}
              </View>
              {item.quantity > 1 && (
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityText}>x{item.quantity}</Text>
                </View>
              )}
            </View>
          </ImageBackground>
        </TouchableOpacity>
      );
    } else {
      // Render the plus icon as a button
      return (
        <ImageBackground source={addItemImageTyped} style={styles.addItemContainer}>
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
  const dataWithAddButton = [...items, null];

  // Existing state variables
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // State variable for modal quantity (number)
  const [modalQuantity, setModalQuantity] = useState<number>(0);

  // New state variable for quantity input (string)
  const [modalQuantityInput, setModalQuantityInput] = useState<string>('');

  // Initialize modal quantity and quantity input when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      setModalQuantity(selectedItem.quantity);
      setModalQuantityInput(String(selectedItem.quantity));
    }
  }, [selectedItem]);


  // Function to update the item's quantity in the items array
  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setItems(updatedItems);
    saveItems(updatedItems);
  };


  // Increment quantity by 1
  const incrementQuantity = () => {
    const newQuantity = modalQuantity + 1;
    setModalQuantity(newQuantity);
    setModalQuantityInput(String(newQuantity));
    if (selectedItem) {
      updateItemQuantity(selectedItem.id, newQuantity);
    }
  };


  // Decrement quantity by 1, minimum of 1
  const decrementQuantity = () => {
    if (modalQuantity > 1) {
      const newQuantity = modalQuantity - 1;
      setModalQuantity(newQuantity);
      setModalQuantityInput(String(newQuantity));
      if (selectedItem) {
        updateItemQuantity(selectedItem.id, newQuantity);
      }
    }
  };


  // Update the quantity input as the user types
  const handleQuantityChange = (text: string) => {
    setModalQuantityInput(text);
  };


  // Handle when the user finishes editing the quantity input
  const handleQuantityEndEditing = () => {
    const newQuantity = parseInt(modalQuantityInput);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setModalQuantity(newQuantity);
      if (selectedItem) {
        updateItemQuantity(selectedItem.id, newQuantity);
      }
    } else {
      // If input is invalid or empty, restore the previous quantity input
      setModalQuantityInput(String(modalQuantity));
    }
  };


  // Function to handle long press on the item image
  const handleImageLongPress = () => {
    if (selectedItem) {
      if (isDefaultItem(selectedItem.id)) {
        Alert.alert('Information', 'You cannot edit the image of default items.');
        return;
      }

      const buttons: AlertButton[] = [];

      // If the item has an image, include the "Remove Image" button
      if (selectedItem.image) {
        buttons.push({
          text: 'Remove Image',
          onPress: () => {
            if (selectedItem.image) {
              const updatedItems = items.map((item) => {
                if (item.id === selectedItem.id) {
                  return { ...item, image: undefined };
                }
                return item;
              });
              setItems(updatedItems);
              saveItems(updatedItems);
              setSelectedItem({ ...selectedItem, image: undefined });
            } else {
              pickImage();
            }
          },
        });
      }

      // Include the "Replace Image" or "Add Image" button
      buttons.push({
        text: selectedItem.image ? 'Replace Image' : 'Add Image',
        onPress: () => {
          pickImage();
        },
      });

      // Include the "Cancel" button with a valid 'style' property
      buttons.push({
        text: 'Cancel',
        style: 'cancel',
      });


      // Show the alert with the constructed buttons
      Alert.alert(
        'Image Options',
        selectedItem.image
          ? 'What would you like to do with the image?'
          : 'You can add an image.',
        buttons,
        { cancelable: true }
      );
    }
  };


  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null); // Track which item is being edited

  const handleTitleLongPress = (itemId: string) => {
    if (isDefaultItem(itemId)) {
      Alert.alert('Information', 'You cannot edit the name of default items.');
      return;
    }

    const itemToEdit = items.find((item) => item.id === itemId);
    if (itemToEdit) {
      Alert.alert(
        'Rename Item',
        'Do you want to rename this item?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Rename',
            onPress: () => {
              setIsEditing(true);
              setEditedName(itemToEdit.name); // Set the current name for editing
              setEditingItemId(itemId); // Set the ID of the item being edited
            },
          },
        ],
        { cancelable: true }
      );
    }
  };


  // Function to handle long press on item details
  const handleDetailsLongPress = () => {
    if (selectedItem) {
      if (isDefaultItem(selectedItem.id)) {
        Alert.alert('Information', 'You cannot edit the details of default items.');
        return;
      }

      Alert.alert(
        'Edit Details',
        'Do you want to edit the details of this item?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Edit',
            onPress: () => {
              setEditingField('details');
              setEditedDetails(selectedItem.details || '');
            },
          },
        ],
        { cancelable: true }
      );
    }
  };


  const updateItemName = (itemId: string, newName: string) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, name: newName }; // Update the name
      }
      return item;
    });
    setItems(updatedItems);
    saveItems(updatedItems); // Save the updated items to the file system
  };


  const updateItemDetails = (itemId: string, newDetails: string) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, details: newDetails }; // Update the details
      }
      return item;
    });
    setItems(updatedItems);
    saveItems(updatedItems); // Save the updated items to the file system
  };


  const [editingField, setEditingField] = useState<'details' | null>(null);
  const [editedDetails, setEditedDetails] = useState<string>('');

  const saveItemName = () => {
    if (selectedItem && editingItemId) {
      updateItemName(editingItemId, editedName);
      setSelectedItem((prev) => (prev ? { ...prev, name: editedName } : null));
      setIsEditing(false);
      setEditingItemId(null);
    }
  };


  const saveItemDetails = () => {
    if (selectedItem) {
      updateItemDetails(selectedItem.id, editedDetails);
      setSelectedItem((prev) => (prev ? { ...prev, details: editedDetails } : null));
      setEditingField(null);
    }
  };

  // Money and Carrying Capacity -- Move to a different file later
  const money = 100;
  const carryingCapacity = 50;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerTextContainer}>
            <MaterialCommunityIcons name="weight-pound" size={18} color="#a8a8a8" />
            <Text style={styles.headerText}>{carryingCapacity}</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Ionicons name="diamond" size={14} color="gold" />
            <Text style={styles.headerText}>{money}</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={changeNumColumns}>
            <Ionicons
              name="grid-outline"
              size={24}
              color="white"
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

      {/* Items Grid */}
      <FlatList
        data={dataWithAddButton}
        renderItem={renderItem}
        keyExtractor={(item, index) => (item ? item.id : 'add-button')}
        key={numColumns} // Important for resetting the layout
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
      />

      {/* Add Item Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add New Item</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Name"
                  placeholderTextColor="gray"
                  onChangeText={(text) =>
                    setNewItem({ ...newItem, name: text })
                  }
                  value={newItem.name}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Quantity"
                  placeholderTextColor="gray"
                  keyboardType="number-pad"
                  onChangeText={(text) =>
                    setNewItem({ ...newItem, quantity: Number(text) || 1 })
                  }
                  value={newItem.quantity.toString()}
                />
                {/* Add details input */}
                <TextInput
                  style={[styles.modalInput, styles.detailsInput]}
                  placeholder="Item Details"
                  placeholderTextColor="gray"
                  onChangeText={(text) => setNewItem({ ...newItem, details: text })}
                  value={newItem.details}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <TouchableOpacity style={styles.imagePickerButton} onPress={() => pickImage(true)}>
                  <Text style={styles.imagePickerButtonText}>Select Image</Text>
                </TouchableOpacity>
                {newItem.image && (
                  <Image
                    source={{ uri: newItem.image }}
                    style={styles.selectedImage}
                  />
                )}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButtonAdd}
                    onPress={addItem}
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
                  onPress={resetItems}
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
      </Modal>{/* Reset Confirmation Modal */}
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
                  onPress={resetItems}
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
      </Modal>{/* Reset Confirmation Modal */}
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
                  onPress={resetItems}
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
      </Modal>{/* Reset Confirmation Modal */}
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
                  onPress={resetItems}
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
      </Modal>{/* Reset Confirmation Modal */}
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
                  onPress={resetItems}
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

      {/* Item Details Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={itemModalVisible}
      >
        <TouchableWithoutFeedback onPress={() => setItemModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.itemModalContainer}>
                <TouchableWithoutFeedback onLongPress={() => handleTitleLongPress(selectedItem?.id || '')}>
                  {isEditing && editingItemId === selectedItem?.id ? (
                    <TextInput
                      style={styles.modalInput}
                      value={editedName}
                      onChangeText={setEditedName}
                      onBlur={saveItemName}
                      onSubmitEditing={saveItemName}
                      autoFocus={true}
                    />
                  ) : (
                    <Text style={styles.itemModalTitle}>{selectedItem?.name}</Text>
                  )}
                </TouchableWithoutFeedback>
                {selectedItem && (
                  <>
                    {/* Wrap the image in a TouchableWithoutFeedback */}
                    <TouchableWithoutFeedback onLongPress={handleImageLongPress}>
                      {selectedItem.image ? (
                        <Image
                          source={
                            typeof selectedItem.image === 'number'
                              ? selectedItem.image
                              : { uri: selectedItem.image }
                          }
                          style={styles.itemModalImage}
                        />
                      ) : (
                        <View style={styles.itemModalNoImage}>
                          <Text>No Image Available</Text>
                        </View>
                      )}
                    </TouchableWithoutFeedback>

                    {/* Details Section */}
                    {editingField === 'details' && !isDefaultItem(selectedItem.id) ? (
                      <TextInput
                        style={[styles.modalInput, styles.detailsInput]}
                        value={editedDetails}
                        onChangeText={setEditedDetails}
                        keyboardType="default"
                        onBlur={saveItemDetails}
                        onSubmitEditing={saveItemDetails}
                        multiline={true}
                        textAlignVertical="top"
                        autoFocus={true}
                      />
                    ) : (
                      <TouchableWithoutFeedback onLongPress={handleDetailsLongPress}>
                        <Text style={styles.itemModalDetails}>
                          {selectedItem.details || 'No details available.'}
                        </Text>
                      </TouchableWithoutFeedback>
                    )}

                    {/* Quantity Row */}
                    <View style={styles.quantityRow}>
                      <TouchableOpacity
                        onPress={decrementQuantity}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>−</Text>
                      </TouchableOpacity>
                      <TextInput
                        style={styles.quantityInput}
                        keyboardType="number-pad"
                        onChangeText={handleQuantityChange}
                        onEndEditing={handleQuantityEndEditing}
                        value={modalQuantityInput}
                      />
                      <TouchableOpacity
                        onPress={incrementQuantity}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Buttons */}
                    <View style={styles.itemModalButtons}>
                      <TouchableOpacity style={styles.itemModalButton}>
                        <Text style={styles.itemModalButtonText}>Send To</Text>
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
}
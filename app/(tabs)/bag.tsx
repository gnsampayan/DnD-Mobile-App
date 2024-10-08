import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/bagStyles';

// Define the base Item interface
interface BaseItem {
  id: string;
  name: string;
  quantity: number;
  image?: string; // Optional image property
  // You can add common properties here
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

// Default starting items
const defaultItems: Item[] = [
  {
    id: '0',
    name: 'Bed Roll',
    quantity: 1,
    image: 'https://via.placeholder.com/150', // Replace with your image URI
  },
  {
    id: '1',
    name: 'Camping Supplies',
    quantity: 4,
    image: 'https://via.placeholder.com/150', // Replace with your image URI
  },
  {
    id: '2',
    name: 'Coin Purse',
    quantity: 1,
    image: 'https://via.placeholder.com/150', // Replace with your image URI
  },
];


export default function BagScreen() {
  const [numColumns, setNumColumns] = useState(4);
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState<{ name: string; quantity: number; image?: string }>({
    name: '',
    quantity: 1,
    image: undefined,
  });

  // New state for reset confirmation modal
  const [resetModalVisible, setResetModalVisible] = useState(false);

  // Load items from local storage when the component mounts
  useEffect(() => {
    loadItems();
  }, []);


  // Function to load items from local storage
  const loadItems = async () => {
    try {
      const storedItems = await SecureStore.getItemAsync('items');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
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
      // Convert items to a format that only includes URIs
      const itemsWithUris = itemsToSave.map(item => ({
        ...item,
        image: item.image, // Ensure only the URI is stored
      }));
      await SecureStore.setItemAsync('items', JSON.stringify(itemsWithUris));
    } catch (error) {
      console.error('Failed to save items:', error);
    }
  };

  // Function to clear items and reset to default
  const resetItems = async () => {
    try {
      await SecureStore.deleteItemAsync('items');
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
      if (forNewItem) {
        setNewItem(prev => ({ ...prev, image: imageUri }));
      } else if (selectedItem) {
        const updatedItems = items.map(item => {
          if (item.id === selectedItem.id) {
            return { ...item, image: imageUri };
          }
          return item;
        });
        setItems(updatedItems);
        saveItems(updatedItems); // Save only the URI
        setSelectedItem(prev => (prev ? { ...prev, image: imageUri } : null));
      }
    }
  }

  function addItem() {
    if (newItem.name) {
      // Generate new id based on maximum existing id
      const existingIds = items.map((item) => Number(item.id));
      const maxId = existingIds.length > 0 ? Math.max(...existingIds) : -1;
      const newId = String(maxId + 1);

      const updatedItems = [
        ...items,
        {
          id: newId,
          name: newItem.name,
          quantity: Number(newItem.quantity),
          image: newItem.image,
        },
      ];
      setItems(updatedItems);
      saveItems(updatedItems);
      setNewItem({ name: '', quantity: 1, image: undefined });
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter the Name of the item.');
    }
  }

  const deleteItem = (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    saveItems(updatedItems);
  };

  const handleLongPress = (itemId: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteItem(itemId),
      },
    ]);
  };

  const renderItem = ({ item, index }: { item: Item | null; index: number }) => {
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
            source={{ uri: item.image || 'https://via.placeholder.com/150' }}
            style={styles.itemImageBackground}
            imageStyle={{ borderRadius: 8 }}
            resizeMode="contain"
          >
            <View style={styles.itemContent}>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemText}>{item.name}</Text>
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
        <TouchableOpacity
          style={styles.addItemContainer}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={48} color="white" />
        </TouchableOpacity>
      );
    }
  };

  // Prepare data by adding a null item to represent the add button
  const dataWithAddButton = [...items, null];

  // ... existing state variables
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
      Alert.alert(
        'Image Options',
        selectedItem.image ? 'What would you like to do with the image?' : 'You can add an image.',
        [
          // Conditionally render the "Remove Image" button
          ...(selectedItem.image ? [{
            text: 'Remove Image',
            onPress: () => {
              if (selectedItem.image) {
                // Remove the image by setting it to undefined
                const updatedItems = items.map((item) => {
                  if (item.id === selectedItem.id) {
                    return { ...item, image: undefined }; // Set image to undefined
                  }
                  return item;
                });
                setItems(updatedItems);
                saveItems(updatedItems);
                setSelectedItem({ ...selectedItem, image: undefined }); // Update selected item
              } else {
                // If there's no image, call the pickImage function
                pickImage();
              }
            },
          }] : []), // Only include if there is an image
          {
            text: selectedItem.image ? 'Replace Image' : 'Add Image',
            onPress: () => {
              pickImage(); // Call the existing pickImage function
            },
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

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null); // Track which item is being edited

  const handleTitleLongPress = (itemId: string) => {
    const itemToEdit = items.find(item => item.id === itemId);
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

  const updateItemName = (itemId: string, newName: string) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, name: newName }; // Update the name
      }
      return item;
    });
    setItems(updatedItems);
    saveItems(updatedItems); // Save the updated items to secure storage
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Gold: 100</Text>
          <Text style={styles.headerText}>Total Weight: 50 lbs</Text>
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
              name="refresh-circle"
              size={32}
              color="red"
              style={[styles.headerIcon, { color: '#ff6e6e' }]}
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
                    setNewItem({
                      ...newItem,
                      quantity: Number(text),
                    })
                  }
                  value={String(newItem.quantity)}
                />
                {/* Image Picker Button */}
                <TouchableOpacity style={styles.imagePickerButton} onPress={() => pickImage(true)}>
                  <Text style={styles.imagePickerButtonText}>Select Image</Text>
                </TouchableOpacity>

                {/* Display Selected Image */}
                {newItem.image && (
                  <Image
                    source={{ uri: newItem.image }}
                    style={styles.selectedImage}
                  />
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButtonCancel}
                    onPress={() => {
                      setModalVisible(false);
                      setNewItem({ name: '', quantity: 1, image: undefined });
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
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
              <Text style={styles.modalTitle}>Reset Items</Text>
              <Text style={styles.modalText}>
                Are you sure you want to reset all items to default? This
                action cannot be undone.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => setResetModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonReset}
                  onPress={resetItems}
                >
                  <Text style={styles.modalButtonText}>Reset</Text>
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
                      onBlur={() => {
                        if (editingItemId) {
                          updateItemName(editingItemId, editedName); // Update the item's name
                          setSelectedItem((prev) => prev ? { ...prev, name: editedName } : null); // Update selected item with new name
                          setIsEditing(false); // Exit editing mode
                          setEditingItemId(null); // Clear the editing item ID
                        }
                      }}
                      onSubmitEditing={() => {
                        if (editingItemId) {
                          updateItemName(editingItemId, editedName); // Update the item's name
                          setSelectedItem((prev) => prev ? { ...prev, name: editedName } : null); // Update selected item with new name
                          setIsEditing(false); // Exit editing mode
                          setEditingItemId(null); // Clear the editing item ID
                        }
                      }}
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
                          source={{ uri: selectedItem.image }}
                          style={styles.itemModalImage}
                        />
                      ) : (
                        <View style={styles.itemModalNoImage}>
                          <Text>No Image Available</Text>
                        </View>
                      )}
                    </TouchableWithoutFeedback>

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
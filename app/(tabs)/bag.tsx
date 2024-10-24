import React, { useState, useEffect, useContext } from 'react';
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
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/bagStyles';
import itemTypes from '../data/itemTypes.json';
import { useItemEquipment } from '../context/ItemEquipmentContext';
import weapons from '../data/weapons.json';
import classData from '../data/classData.json';
import StatsDataContext from '../context/StatsDataContext';
import raceData from '../data/raceData.json';

import bedrollImage from '@items/default-item-bedroll.png';
import campingSuppliesImage from '@items/default-item-camping-supplies.png';
import coinPouchImage from '@items/default-item-coin-pouch.png';
import addItemImage from '@items/add-item-image.png';
import DropDownPicker from 'react-native-dropdown-picker';
const addItemImageTyped: ImageSourcePropType = addItemImage as ImageSourcePropType;

// Define the base Item interface
interface BaseItem {
  id: string;
  name: string;
  quantity: number;
  image?: string;
  details?: string;
  type?: string;
}


// Define specific item types
interface Food extends BaseItem {
  // Additional properties specific to Food
}

interface Weapon extends BaseItem {
  // Additional properties specific to Weapon
}


interface Equipment extends BaseItem {
  // Additional properties specific to Equipment
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
type Item = Food | Weapon | Equipment | MagicItem | Special | Misc;

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
  const [numColumns, setNumColumns] = useState(3);
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [newItem, setNewItem] = useState<{ name: string; quantity: number; image?: string; details?: string; }>({
    name: '',
    quantity: 1,
    image: undefined,
    details: '',
  });
  const [openItemType, setOpenItemType] = useState(false);
  const [itemTypeValue, setItemTypeValue] = useState<string | null>(null);
  const { saveItems } = useItemEquipment();
  // Load items from local storage when the component mounts
  useEffect(() => {
    loadItems();
  }, []);

  // Food Units
  const [foodUnitsValue, setFoodUnitsValue] = useState<number>(0);

  // Weapon Type
  const [openWeaponType, setOpenWeaponType] = useState(false);
  const [weaponTypeValue, setWeaponTypeValue] = useState<string | null>(null);
  const [weaponTypesOptionsFiltered, setWeaponTypesOptionsFiltered] = useState<{ label: string; value: string; parent?: string; selectable?: boolean }[]>([]);

  // State for weapon proficiency (to be made dynamic later)
  // Use context for statsData
  const { statsData } = useContext(StatsDataContext);

  if (!statsData) {
    // Render a loading indicator or return null
    return null;
  }
  const [isProficientInMartialWeapons, setIsProficientInMartialWeapons] = useState(false);
  const [classSpecificWeapons, setClassSpecificWeapons] = useState<string[]>([]);

  useEffect(() => {
    const checkWeaponProficiency = () => {
      const characterClass = classData.find(c => c.value === statsData.class);
      if (characterClass && characterClass.weaponProficiency) {
        const isProficient = characterClass.weaponProficiency.includes('martial');
        setIsProficientInMartialWeapons(isProficient);

        // Extract specific weapons
        const specificWeapons = characterClass.weaponProficiency.filter(wp =>
          !['simple', 'martial'].includes(wp.toLowerCase())
        );
        setClassSpecificWeapons(specificWeapons);
      }
    };

    checkWeaponProficiency();
  }, [statsData.class]);

  // Function to filter and group weapons based on proficiency
  const filterAndGroupWeapons = () => {
    const groupedWeapons = weapons.weapons.reduce((acc, category) => {
      // Show both simple and martial weapons if race or class is not available
      if (!statsData.race || !statsData.class || statsData.race === '' || statsData.class === '') {
        // Add group label with bold font
        acc.push({
          label: category.category,
          value: category.category.toLowerCase(),
          parent: null,
          selectable: false,
          labelStyle: {
            fontWeight: 'bold',
          },
        });

        // Add all weapons under the current category
        category.items.forEach(item => {
          acc.push({
            label: item.name,
            value: item.name.toLowerCase(),
            parent: category.category.toLowerCase(),
            selectable: true,
            labelStyle: {
              fontWeight: 'normal',
            },
          });
        });
      } else if (
        isProficientInMartialWeapons ||
        !category.category.toLowerCase().includes('martial')
      ) {
        // Add group label with bold font
        acc.push({
          label: category.category,
          value: category.category.toLowerCase(),
          parent: null,
          selectable: false,
          labelStyle: {
            fontWeight: 'bold',
          },
        });

        // Add weapons under the current category
        category.items.forEach(item => {
          acc.push({
            label: item.name,
            value: item.name.toLowerCase(),
            parent: category.category.toLowerCase(),
            selectable: true,
            labelStyle: {
              fontWeight: 'normal',
            },
          });
        });
      }
      return acc;
    }, [] as {
      label: string;
      value: string;
      parent: string | null;
      selectable: boolean;
      labelStyle?: object;
    }[]);

    // If race and class are available, proceed with class and race specific weapons
    if (statsData.race && statsData.class && statsData.race !== '' && statsData.class !== '') {
      // Create a Set of existing weapon values to avoid duplicates
      const existingWeaponValues = new Set(
        groupedWeapons
          .filter(w => w.selectable)
          .map(w => w.value.toLowerCase())
      );

      // Add class-specific weapons, ensuring no duplicates
      if (classSpecificWeapons.length > 0) {
        // Filter out class-specific weapons that already exist in main categories
        const uniqueClassWeapons = classSpecificWeapons.filter(weapon =>
          !existingWeaponValues.has(weapon.toLowerCase())
        );

        if (uniqueClassWeapons.length > 0) {
          // Add the "Class Specific" group label
          groupedWeapons.push({
            label: `${statsData.class} Specific`,
            value: 'class-specific',
            parent: null,
            selectable: false,
            labelStyle: {
              fontWeight: 'bold',
              textTransform: 'capitalize',
            },
          });

          // Add each unique class-specific weapon
          uniqueClassWeapons.forEach(weapon => {
            groupedWeapons.push({
              label: weapon,
              value: weapon.toLowerCase(),
              parent: 'class-specific',
              selectable: true,
              labelStyle: {
                fontWeight: 'normal',
                textTransform: 'capitalize',
              },
            });
            // Add to existingWeaponValues to avoid duplicates in race-specific weapons
            existingWeaponValues.add(weapon.toLowerCase());
          });
        }
      }

      // Add race-specific weapons
      const characterRace = raceData.find(r => r.race.toLowerCase() === statsData.race?.toLowerCase());
      if (characterRace && characterRace.proficiencies && characterRace.proficiencies.weaponProficiency) {
        const raceSpecificWeapons = characterRace.proficiencies.weaponProficiency.filter(weapon =>
          !existingWeaponValues.has(weapon.toLowerCase())
        );

        if (raceSpecificWeapons.length > 0) {
          // Add the "Race Specific" group label
          groupedWeapons.push({
            label: `${statsData.race} Specific`,
            value: 'race-specific',
            parent: null,
            selectable: false,
            labelStyle: {
              fontWeight: 'bold',
            },
          });

          // Add each unique race-specific weapon
          raceSpecificWeapons.forEach(weapon => {
            groupedWeapons.push({
              label: weapon,
              value: weapon.toLowerCase(),
              parent: 'race-specific',
              selectable: true,
              labelStyle: {
                fontWeight: 'normal',
                textTransform: 'capitalize',
              },
            });
          });
        }
      }
    }
    return groupedWeapons;
  };

  // Update weaponTypesOptionsFiltered when relevant data changes
  useEffect(() => {
    if (itemTypeValue && itemTypeValue.toLowerCase() === 'weapon') {
      const groupedAndFilteredWeapons = filterAndGroupWeapons();
      setWeaponTypesOptionsFiltered(groupedAndFilteredWeapons as { label: string; value: string; parent?: string | undefined; selectable?: boolean | undefined }[]);
    }
  }, [itemTypeValue, isProficientInMartialWeapons, classSpecificWeapons, statsData.race, statsData.class]);

  // Function to load items from AsyncStorage
  const loadItems = async () => {
    try {
      const jsonString = await AsyncStorage.getItem('items');
      if (jsonString) {
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

  // Function to clear items and reset to default
  const resetItems = async () => {
    try {
      // Remove all items from AsyncStorage
      await AsyncStorage.removeItem('items');

      // Delete custom item images from AsyncStorage
      for (const item of items) {
        if (!isDefaultItem(item.id) && item.image) {
          // Check if item.image contains the expected substrings
          const imageSplitCommas = item.image.split(',');
          if (imageSplitCommas.length > 0) {
            const imageSplitSlashes = imageSplitCommas[0].split('/');
            if (imageSplitSlashes.length > 3) {
              const imageSplitSemicolons = imageSplitSlashes[3].split(';');
              if (imageSplitSemicolons.length > 0) {
                const imageKey = imageSplitSemicolons[0];
                await AsyncStorage.removeItem(imageKey).catch((error) => {
                  console.error('Failed to delete image from AsyncStorage:', error);
                });
              }
            }
          }
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
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;

      if (forNewItem) {
        setNewItem((prev) => ({ ...prev, image: base64Image }));
      } else if (selectedItem) {
        const updatedItems = items.map((item) => {
          if (item.id === selectedItem.id) {
            return { ...item, image: base64Image };
          }
          return item;
        });
        setItems(updatedItems);
        saveItems(updatedItems); // Save updated items
        setSelectedItem((prev) => (prev ? { ...prev, image: base64Image } : null));
      }

      // Save the base64 image to AsyncStorage
      try {
        const imageKey = `image_${Date.now()}`;
        await AsyncStorage.setItem(imageKey, base64Image);
      } catch (error) {
        console.error('Failed to save image to AsyncStorage:', error);
      }
    }
  }

  // Function to check if an item is a default item
  const isDefaultItem = (itemId: string) => {
    return defaultItems.some((item) => item.id === itemId);
  };


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
        image: newItem.image ?? undefined,
        details: newItem.details ?? '',
        type: itemTypeValue ?? '',
      };

      const updatedItems = [...items, newItemToAdd];
      setItems(updatedItems);
      saveItems(updatedItems);
      setNewItem({ name: '', quantity: 1, image: undefined, details: '' });
      setItemTypeValue(null);
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter the Name of the item.');
    }
  }


  // Function to delete an item from the items array
  const deleteItem = async (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    await saveItems(updatedItems);

    // Remove the item's image from AsyncStorage if it exists
    const itemToDelete = items.find((item) => item.id === itemId);
    if (itemToDelete && itemToDelete.image) {
      try {
        await AsyncStorage.removeItem(`itemImage_${itemId}`);
      } catch (error) {
        console.error('Failed to delete image from AsyncStorage:', error);
      }
    }
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


  const windowWidth = Dimensions.get('window').width;
  const itemWidth = (windowWidth - (30 + (numColumns - 1) * 10)) / numColumns; // 20 for horizontal padding, 10 for gap between items

  // Function to render each item in the grid
  const renderItem = ({ item }: { item: Item | null }) => {
    if (item) {
      return (
        <TouchableOpacity
          style={[styles.itemContainer, { width: itemWidth }]}
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
                  : { uri: item.image } // URI from async storage or remote
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
        <ImageBackground source={addItemImageTyped} style={[styles.addItemContainer, { width: itemWidth }]}>
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
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
            setItemTypeValue(null);
          }}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add New Item</Text>
                <Text>Item Type</Text>
                <DropDownPicker
                  open={openItemType}
                  value={itemTypeValue}
                  items={itemTypes}
                  setOpen={setOpenItemType}
                  setValue={setItemTypeValue}
                  placeholder="Select an item type"
                  style={{ marginBottom: 10 }}
                  zIndex={2000}
                  onChangeValue={(value) => setItemTypeValue(value)}
                />
                {(itemTypeValue && itemTypeValue.toLowerCase() === 'weapon') && (
                  <>
                    <Text>Weapon Type</Text>
                    <DropDownPicker
                      open={openWeaponType}
                      value={weaponTypeValue}
                      items={weaponTypesOptionsFiltered}
                      setOpen={setOpenWeaponType}
                      setValue={setWeaponTypeValue}
                      placeholder="Select a weapon type"
                      style={{ marginBottom: 10 }}
                      textStyle={{ textTransform: 'capitalize' }}
                      zIndex={1000}
                      listMode="SCROLLVIEW"
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                      onChangeValue={(value) => {
                        setWeaponTypeValue(value);
                        if (value) {
                          const capitalizedName = value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                          setNewItem({ ...newItem, name: capitalizedName });
                        }
                      }}
                    />
                  </>
                )}
                {(itemTypeValue && itemTypeValue.toLowerCase() === 'food') && (
                  <>
                    <Text>Food Units</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Food Units"
                      placeholderTextColor="gray"
                      keyboardType="number-pad"
                      onChangeText={(text) =>
                        setFoodUnitsValue(Number(text) || 0)
                      }
                      value={foodUnitsValue.toString()}
                    />
                  </>
                )}

                {itemTypeValue && itemTypeValue.toLowerCase() === 'custom' && (
                  <>

                    {/* Name Input */}
                    <Text>Name</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Name"
                      placeholderTextColor="gray"
                      onChangeText={(text) =>
                        setNewItem({ ...newItem, name: text })
                      }
                      value={newItem.name}
                    />
                    {/* Add details input */}
                    <Text>Details</Text>
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

                  </>
                )}
                {/* Quantity Input */}
                <Text>Quantity</Text>
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

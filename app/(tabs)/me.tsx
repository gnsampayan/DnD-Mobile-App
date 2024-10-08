import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, Keyboard, Image, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import styles from '../styles/meStyles';
import { Ionicons } from '@expo/vector-icons';

export default function MeScreen() {
    const [hp, setHp] = useState(20); // Initial HP
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null); // State for image URI

    useEffect(() => {
        // Retrieve the stored image URI when the component mounts
        const loadImageUri = async () => {
            const storedImageUri = await SecureStore.getItemAsync('imageUri');
            if (storedImageUri) {
                setImageUri(storedImageUri);
            }
        };
        loadImageUri();
    }, []);

    const handleHpChange = (operation: 'add' | 'subtract') => {
        const changeValue = parseInt(inputValue) || 0; // Default to 0 if input is invalid
        if (operation === 'add') {
            setHp((prevHp) => Math.max(prevHp + changeValue, 0)); // Prevent HP from going below 0
        } else if (operation === 'subtract') {
            setHp((prevHp) => Math.max(prevHp - changeValue, 0)); // Prevent HP from going below 0
        }
        setInputValue(''); // Clear input
        setModalVisible(false); // Close modal
    };

    const handleImagePress = () => {
        if (imageUri) {
            // If there is an image, show options to replace or delete
            Alert.alert('Image Options', 'What would you like to do?', [
                {
                    text: 'Replace Image',
                    onPress: pickImage,
                },
                {
                    text: 'Delete Image',
                    onPress: () => {
                        setImageUri(null); // Clear the image
                        SecureStore.deleteItemAsync('imageUri'); // Remove from secure storage
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ]);
        } else {
            // If no image, allow user to pick an image
            pickImage();
        }
    };

    const pickImage = async () => {
        // Ask for permission to access media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need permission to access your media library.');
            return;
        }

        // Open image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri; // Get the selected image URI
            setImageUri(selectedImageUri); // Set the selected image URI
            await SecureStore.setItemAsync('imageUri', selectedImageUri); // Store the image URI securely
        }
    };

    // Calculate 2/3 of the screen width
    const screenWidth = Dimensions.get('window').width;
    const section3Width = (1 / 2) * screenWidth;

    return (
        <View style={styles.container}>
            {/* Section 1: Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.hpText}>{hp > 0 ? `HP: ${hp}` : 'HP: Death Saving Throw'}</Text>
                </TouchableOpacity>
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.characterStatsButton}>
                        <Ionicons name="person" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userAccountButton}>
                        <Ionicons name="settings" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Section 2, 3, and 4: Main Content */}
            <View style={styles.mainContent}>
                <View style={styles.section2}>
                    <TouchableOpacity style={styles.equipmentItem} onPress={() => { }}>
                        <Text>Helmet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.equipmentItem} onPress={() => { }}>
                        <Text>Cape</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.equipmentItem} onPress={() => { }}>
                        <Text>Armor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.equipmentItem} onPress={() => { }}>
                        <Text>Gauntlets</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.equipmentItem} onPress={() => { }}>
                        <Text>Boots</Text>
                    </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback style={styles.section3} onLongPress={handleImagePress}>
                    <View style={[styles.imageContainer, { width: section3Width }]}>
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.emptyImageContainer}>
                                <Text>No Image available</Text>
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.section4}>
                    <TouchableOpacity style={styles.equipmentItem} onPress={() => { }}>
                        <Text>Necklace</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.equipmentItem} onPress={() => { }}>
                        <Text>Ring 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.equipmentItem} onPress={() => { }}>
                        <Text>Ring 2</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Section 5: Bottom Section */}
            <View style={styles.section5}>
                <View style={styles.melee}>
                    <TouchableOpacity style={styles.weapon} onPress={() => { }}>
                        <Text>Main Melee</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.weapon} onPress={() => { }}>
                        <Text>Offhand Melee</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.ranged}>
                    <TouchableOpacity style={styles.weapon} onPress={() => { }}>
                        <Text>Main Ranged</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* HP Change Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Current HP: {hp}</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Enter number"
                                    keyboardType="number-pad"
                                    placeholderTextColor="gray"
                                    onChangeText={setInputValue}
                                    value={inputValue}
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.modalButtonSubtract}
                                        onPress={() => handleHpChange('subtract')}
                                    >
                                        <Text style={styles.modalButtonText}>Subtract</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modalButtonAdd}
                                        onPress={() => handleHpChange('add')}
                                    >
                                        <Text style={styles.modalButtonText}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
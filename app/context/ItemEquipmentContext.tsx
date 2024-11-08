import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Define the shape of our Item
export interface Item {
    id: string;
    name: string;
    quantity: number;
    image?: string;
    details?: string;
    type?: string;
    properties?: string[];
    damage?: string;
    attackBonus?: string;
    weaponType?: string;
    skill_modifiers?: string[];
    savingThrow?: string;
    dc?: number;
}


// Define the shape of our context
interface ItemEquipmentContextType {
    items: Item[];
    weaponsProficientIn: string[];
    setWeaponsProficientIn: (weapons: string[]) => void;
    loadItems: () => Promise<void>;
    saveItems: (itemsToSave: Item[]) => Promise<void>;
    equippedArmor: string | null;
    setEquippedArmor: (armor: string | null) => void;
    equippedShield: string | null;
    setEquippedShield: (shield: string | null) => void;
}

const EQUIPPED_ARMOR_KEY = '@equipped_armor';
const EQUIPPED_SHIELD_KEY = '@equipped_shield';

// Create the context
const ItemEquipmentContext = createContext<ItemEquipmentContextType | undefined>(undefined);

// Create a provider component
export const ItemEquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [weaponsProficientIn, setWeaponsProficientInState] = useState<string[]>([]);
    const [equippedArmor, setEquippedArmor] = useState<string | null>(null);
    const [equippedShield, setEquippedShield] = useState<string | null>(null);

    // Function to load items from AsyncStorage
    const loadItems = async () => {
        try {
            const jsonString = await AsyncStorage.getItem('items');
            if (jsonString) {
                const parsedItems: Item[] = JSON.parse(jsonString);
                setItems(parsedItems);
            }
        } catch (error) {
            console.error('Failed to load items:', error);
        }
    };

    useEffect(() => {
        // Load items
        loadItems();

        // Load weapon proficiencies
        const loadWeaponProficiencies = async () => {
            try {
                const proficienciesJson = await AsyncStorage.getItem('@weapon_proficiencies');
                if (proficienciesJson) {
                    setWeaponsProficientIn(JSON.parse(proficienciesJson));
                } else {
                    // Initialize with default proficiencies if needed
                    setWeaponsProficientIn([]);
                }
            } catch (error) {
                console.error('Error loading weapon proficiencies:', error);
            }
        };

        // Load equipped armor
        const loadEquippedArmor = async () => {
            const equippedArmor = await AsyncStorage.getItem(EQUIPPED_ARMOR_KEY);
            if (equippedArmor) {
                setEquippedArmor(equippedArmor);
            } else {
                setEquippedArmor(null);
            }
        }

        // Load equipped shield
        const loadEquippedShield = async () => {
            const equippedShield = await AsyncStorage.getItem(EQUIPPED_SHIELD_KEY);
            if (equippedShield) {
                setEquippedShield(equippedShield);
            } else {
                setEquippedShield(null);
            }
        }

        loadWeaponProficiencies();
        loadEquippedArmor();
        loadEquippedShield();
    }, []);

    // Whenever weaponsProficientIn changes, save it to AsyncStorage
    useEffect(() => {
        const saveWeaponProficiencies = async () => {
            try {
                await AsyncStorage.setItem('@weapon_proficiencies', JSON.stringify(weaponsProficientIn));
            } catch (error) {
                console.error('Error saving weapon proficiencies:', error);
            }
        };

        saveWeaponProficiencies();
    }, [weaponsProficientIn]);

    // Function to save items to AsyncStorage
    const saveItems = async (itemsToSave: Item[]) => {
        try {
            const jsonString = JSON.stringify(itemsToSave);
            await AsyncStorage.setItem('items', jsonString);
            setItems(itemsToSave);
        } catch (error) {
            console.error('Failed to save items:', error);
        }
    };

    // Function to save weaponsProficientIn to AsyncStorage
    const saveWeaponsProficientIn = async (weapons: string[]) => {
        try {
            const jsonString = JSON.stringify(weapons);
            await AsyncStorage.setItem('weaponsProficientIn', jsonString);
            setWeaponsProficientInState(weapons);
        } catch (error) {
            console.error('Failed to save weaponsProficientIn:', error);
        }
    };

    // Function to set weaponsProficientIn and save it to AsyncStorage
    const setWeaponsProficientIn = (weapons: string[]) => {
        saveWeaponsProficientIn(weapons);
    };

    // Function to save equippedArmor to AsyncStorage
    const saveEquippedArmor = async (armor: string | null) => {
        await AsyncStorage.setItem(EQUIPPED_ARMOR_KEY, armor || '');
    };

    // Function to save equippedShield to AsyncStorage
    const saveEquippedShield = async (shield: string | null) => {
        await AsyncStorage.setItem(EQUIPPED_SHIELD_KEY, shield || '');
    };

    // UseEffect to save equippedArmor to AsyncStorage whenever it changes
    useEffect(() => {
        saveEquippedArmor(equippedArmor);
    }, [equippedArmor]);

    // UseEffect to save equippedShield to AsyncStorage whenever it changes
    useEffect(() => {
        saveEquippedShield(equippedShield);
    }, [equippedShield]);

    return (
        <ItemEquipmentContext.Provider value={{
            items,
            loadItems,
            saveItems,
            weaponsProficientIn,
            setWeaponsProficientIn,
            equippedArmor,
            setEquippedArmor,
            equippedShield,
            setEquippedShield,
        }}>
            {children}
        </ItemEquipmentContext.Provider>
    );
};

// Custom hook to use the ItemEquipment context
export const useItemEquipment = () => {
    const context = useContext(ItemEquipmentContext);
    if (context === undefined) {
        throw new Error('useItemEquipment must be used within a ItemEquipmentProvider');
    }
    return context;
};

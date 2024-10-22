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
    imageUri?: string;
}


// Define the shape of our context
interface ItemEquipmentContextType {
    items: Item[];
    loadItems: () => Promise<void>;
    saveItems: (itemsToSave: Item[]) => Promise<void>;
}

// Create the context
const ItemEquipmentContext = createContext<ItemEquipmentContextType | undefined>(undefined);

// Create a provider component
export const ItemEquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Item[]>([]);

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

    // Load items when the component mounts
    useEffect(() => {
        loadItems();
    }, []);

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

    return (
        <ItemEquipmentContext.Provider value={{
            items,
            loadItems,
            saveItems,
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

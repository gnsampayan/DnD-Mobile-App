// CantripSlotsContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CantripSlotsContext = createContext<{
    cantripSlotsData: (string | null)[];
    setCantripSlotsData: React.Dispatch<React.SetStateAction<(string | null)[]>>;
    saveCantripSlots: (slots: (string | null)[]) => Promise<void>;
}>({
    cantripSlotsData: [],
    setCantripSlotsData: () => { },
    saveCantripSlots: async () => { }
});

const CANTRIP_SLOTS_KEY = '@cantrip_slots';

export const CantripSlotsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cantripSlotsData, setCantripSlotsData] = useState<(string | null)[]>([]);

    // Function to save cantrip slots to AsyncStorage
    const saveCantripSlots = async (slots: (string | null)[]) => {
        try {
            await AsyncStorage.setItem(CANTRIP_SLOTS_KEY, JSON.stringify(slots));
        } catch (error) {
            console.error('Failed to save cantrip slots to storage', error);
        }
    };

    // Load cantrip slots from AsyncStorage
    useEffect(() => {
        const loadCantripSlots = async () => {
            try {
                const savedSlots = await AsyncStorage.getItem(CANTRIP_SLOTS_KEY);
                if (savedSlots !== null) {
                    setCantripSlotsData(JSON.parse(savedSlots));
                }
            } catch (error) {
                console.error('Failed to load cantrip slots from storage', error);
            }
        };
        loadCantripSlots();
    }, []);

    // Save cantrip slots whenever they change
    useEffect(() => {
        saveCantripSlots(cantripSlotsData);
    }, [cantripSlotsData]);

    return (
        <CantripSlotsContext.Provider value={{ cantripSlotsData, setCantripSlotsData, saveCantripSlots }}>
            {children}
        </CantripSlotsContext.Provider>
    );
};
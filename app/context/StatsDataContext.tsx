import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define interfaces for statsData
interface Ability {
    id: number;
    name: string;
    value: number;
}

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
}

// Define context types
interface StatsDataContextProps {
    statsData: StatsData;
    updateStatsData: (newStatsData: StatsData) => void;
}

// Create context
const StatsDataContext = createContext<StatsDataContextProps | undefined>(undefined);

// Create provider component
export const StatsDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [statsData, setStatsData] = useState<StatsData>({
        xp: 0,
        level: 1,
        abilities: [],
        allocationsPerLevel: { 1: {} },
    });

    // Load statsData from AsyncStorage
    const loadStatsData = async () => {
        try {
            const dataString = await AsyncStorage.getItem('statsData');
            if (dataString) {
                const data = JSON.parse(dataString);
                setStatsData(data);
            } else {
                // Initialize default data if none exists
                // You can define a function to initialize default data here
            }
        } catch (error) {
            console.error('Error loading stats data:', error);
        }
    };

    // Save statsData to AsyncStorage
    const saveStatsData = async (data: StatsData) => {
        try {
            await AsyncStorage.setItem('statsData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving stats data:', error);
        }
    };

    // Update statsData and save to AsyncStorage
    const updateStatsData = (newStatsData: StatsData) => {
        setStatsData(newStatsData);
        saveStatsData(newStatsData);
    };

    // Load statsData on mount
    useEffect(() => {
        loadStatsData();
    }, []);

    return (
        <StatsDataContext.Provider value={{ statsData, updateStatsData }}>
            {children}
        </StatsDataContext.Provider>
    );
};

export default StatsDataContext;

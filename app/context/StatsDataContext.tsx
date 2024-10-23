import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import classData from '../data/classData.json';

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
    race?: string;
    class?: string;
    hpIncreases: { [level: number]: number };
    hitDice: number;
    speed: number;
    proficiencyBonus: number;
}

// Define context types
interface StatsDataContextProps {
    statsData: StatsData;
    updateStatsData: (data: Partial<StatsData>) => void;
    isSpellCaster: boolean;
}

// Define initial abilities
const initialAbilities: Ability[] = [
    { id: 1, name: 'Strength', value: 8 },
    { id: 2, name: 'Dexterity', value: 8 },
    { id: 3, name: 'Constitution', value: 8 },
    { id: 4, name: 'Intelligence', value: 8 },
    { id: 5, name: 'Wisdom', value: 8 },
    { id: 6, name: 'Charisma', value: 8 },
];

// Initial stats data
const initialStatsData: StatsData = {
    xp: 0,
    level: 1,
    abilities: initialAbilities,
    allocationsPerLevel: { 1: {} },
    race: '',
    class: '',
    hpIncreases: {},
    hitDice: 0,
    speed: 30,
    proficiencyBonus: 2,
};

// Create context
const StatsDataContext = createContext<StatsDataContextProps>({
    statsData: initialStatsData,
    updateStatsData: () => { },
    isSpellCaster: false,
});

// Create provider component
export const StatsDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [statsData, setStatsData] = useState<StatsData>(initialStatsData);
    const [isSpellCaster, setIsSpellCaster] = useState(false);

    // Load statsData from AsyncStorage
    const loadStatsData = async () => {
        try {
            const dataString = await AsyncStorage.getItem('statsData');
            if (dataString) {
                const data = JSON.parse(dataString);
                setStatsData(data);
            } else {
                setStatsData(initialStatsData);
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
    const updateStatsData = (newData: Partial<StatsData>) => {
        setStatsData((prev) => {
            const updatedData = { ...prev, ...newData };
            saveStatsData(updatedData);
            setStatsData(updatedData);
            return updatedData;
        });
    };

    // Get the class object and set the isSpellCaster state
    const handleSpellCaster = () => {
        const classValue = statsData.class?.toLowerCase();
        const classObject = classData.find((c) => c.value.toLowerCase() === classValue);
        const isSpellCaster = classObject ? classObject.spellcaster : false;
        setIsSpellCaster(isSpellCaster);
    }

    // Load statsData on mount
    useEffect(() => {
        loadStatsData();
    }, []);

    // Set the isSpellCaster state based on the class
    useEffect(() => {
        handleSpellCaster();
    }, [statsData.class]);


    return (
        <StatsDataContext.Provider value={{ statsData, updateStatsData, isSpellCaster }}>
            {children}
        </StatsDataContext.Provider>
    );
};

export default StatsDataContext;

import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import classData from '../app/data/classData.json';

// Define interfaces for statsData
interface Ability {
    id: number;
    name: string;
    value: number;
    maxValue?: number;
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

// Define context types
interface StatsDataContextProps {
    statsData: StatsData;
    updateStatsData: (data: Partial<StatsData>) => void;
    isSpellCaster: boolean;
    unusedSkillPoints: number;
    setUnusedSkillPoints: (value: number) => void;
    raceSkillProfGained: boolean;
    setRaceSkillProfGained: (value: boolean) => void;
    skillProficiency: string[];
    setSkillProficiency: (value: string[]) => void;
    subclass: string | null;
    setSubclass: (value: string | null) => void;
}
// Create context
const StatsDataContext = createContext<StatsDataContextProps>({
    statsData: initialStatsData,
    updateStatsData: () => { },
    isSpellCaster: false,
    unusedSkillPoints: 0,
    setUnusedSkillPoints: () => { },
    raceSkillProfGained: false,
    setRaceSkillProfGained: () => { },
    skillProficiency: [],
    setSkillProficiency: () => { },
    subclass: null,
    setSubclass: () => { },
});

const UNUSED_SKILL_POINTS_KEY = 'unusedSkillPoints';
const STATS_DATA_KEY = 'statsData';
const RACE_SKILL_PROF_GAINED_KEY = 'raceSkillProfGained';
const SKILL_PROFICIENCY_KEY = 'skillProficiency';
const SUBCLASS_KEY = 'subclass';

// Create provider component
export const StatsDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [statsData, setStatsData] = useState<StatsData>(initialStatsData);
    const [isSpellCaster, setIsSpellCaster] = useState(false);
    const [unusedSkillPoints, setUnusedSkillPoints] = useState(0);
    const [raceSkillProfGained, setRaceSkillProfGained] = useState(false);
    const [skillProficiency, setSkillProficiency] = useState<string[]>([]);
    const [subclass, setSubclass] = useState<string | null>(null);

    const unusedSkillPointsLoaded = useRef(false);
    const raceSkillProfGainedLoaded = useRef(false);
    const skillProficiencyLoaded = useRef(false);
    const subclassLoaded = useRef(false);
    const [statsDataLoaded, setStatsDataLoaded] = useState(false);

    // Inside your StatsDataProvider component
    const prevClassRef = useRef<string | null>(null);
    const firstUpdate = useRef(true);


    // Load subclass from AsyncStorage
    const loadSubclass = async () => {
        try {
            const value = await AsyncStorage.getItem(SUBCLASS_KEY);
            if (value && value !== 'null') {
                const parsedValue = JSON.parse(value);
                // Ensure we set the string value of the subclass
                setSubclass(typeof parsedValue === 'string' ? parsedValue : String(parsedValue));
            } else {
                setSubclass(null);
            }
        } catch (error) {
            console.error('Error loading subclass:', error);
        } finally {
            subclassLoaded.current = true;
        }
    }

    // Save subclass to AsyncStorage
    const saveSubclass = async (value: string | null) => {
        try {
            await AsyncStorage.setItem(SUBCLASS_KEY, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving subclass:', error);
        }
    }

    // Delete subclass from AsyncStorage
    const deleteSubclass = async () => {
        try {
            await AsyncStorage.removeItem(SUBCLASS_KEY);
        } catch (error) {
            console.error('Error deleting subclass:', error);
        }
    }

    // Load skill proficiency from AsyncStorage
    const loadSkillProficiency = async () => {
        try {
            const value = await AsyncStorage.getItem(SKILL_PROFICIENCY_KEY);
            setSkillProficiency(value ? JSON.parse(value) : []);
        } catch (error) {
            console.error('Error loading skill proficiency:', error);
        } finally {
            skillProficiencyLoaded.current = true;
        }
    }

    // Save skill proficiency to AsyncStorage
    const saveSkillProficiency = async (value: string[]) => {
        try {
            await AsyncStorage.setItem(SKILL_PROFICIENCY_KEY, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving skill proficiency:', error);
        }
    }

    // Save skill proficiency to AsyncStorage after initial load
    useEffect(() => {
        if (skillProficiencyLoaded.current) {
            saveSkillProficiency(skillProficiency);
        }
    }, [skillProficiency]);


    // Load statsData from AsyncStorage
    const loadStatsData = async () => {
        try {
            const dataString = await AsyncStorage.getItem(STATS_DATA_KEY);
            if (dataString) {
                const data = JSON.parse(dataString);
                setStatsData(data);

                // Initialize prevClassRef.current with the loaded class
                prevClassRef.current = data.class || null;
            } else {
                setStatsData(initialStatsData);
                prevClassRef.current = initialStatsData.class || null;
            }
        } catch (error) {
            console.error('Error loading stats data:', error);
        } finally {
            setStatsDataLoaded(true);
        }
    };

    // Save statsData to AsyncStorage
    const saveStatsData = async (data: StatsData) => {
        try {
            await AsyncStorage.setItem(STATS_DATA_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving stats data:', error);
        }
    };

    // Update statsData and save to AsyncStorage
    const updateStatsData = (newData: Partial<StatsData>) => {
        setStatsData((prev) => {
            const updatedData = { ...prev, ...newData };
            saveStatsData(updatedData);
            return updatedData;
        });
    };

    // Load race skill prof gained from AsyncStorage
    const loadRaceSkillProfGained = async () => {
        try {
            const value = await AsyncStorage.getItem(RACE_SKILL_PROF_GAINED_KEY);
            setRaceSkillProfGained(value ? JSON.parse(value) : false);
        } catch (error) {
            console.error('Error loading race skill prof gained:', error);
        } finally {
            raceSkillProfGainedLoaded.current = true;
        }
    };

    // Save race skill prof gained to AsyncStorage
    const saveRaceSkillProfGained = async (value: boolean) => {
        try {
            await AsyncStorage.setItem(RACE_SKILL_PROF_GAINED_KEY, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving race skill prof gained:', error);
        }
    }

    // Save race skill prof gained to AsyncStorage after initial load
    useEffect(() => {
        if (raceSkillProfGainedLoaded.current) {
            saveRaceSkillProfGained(raceSkillProfGained);
        }
    }, [raceSkillProfGained]);

    // Load unused skill points from AsyncStorage
    const loadUnusedSkillPoints = async () => {
        try {
            const points = await AsyncStorage.getItem(UNUSED_SKILL_POINTS_KEY);
            setUnusedSkillPoints(points ? parseInt(points) : 0);
        } catch (error) {
            console.error('Error loading unused skill points:', error);
        } finally {
            unusedSkillPointsLoaded.current = true;
        }
    };

    // Save unused skill points to AsyncStorage
    const saveUnusedSkillPoints = async (points: number) => {
        try {
            await AsyncStorage.setItem(UNUSED_SKILL_POINTS_KEY, points.toString());
        } catch (error) {
            console.error('Error saving unused skill points:', error);
        }
    }

    // Save unused skill points to AsyncStorage after initial load
    useEffect(() => {
        if (unusedSkillPointsLoaded.current) {
            saveUnusedSkillPoints(unusedSkillPoints);
        }
    }, [unusedSkillPoints]);


    // Get the class object and set the isSpellCaster state
    const handleSpellCaster = () => {
        const classValue = statsData.class?.toLowerCase();
        const classObject = classData.find((c) => c.value.toLowerCase() === classValue);
        const isSpellCaster = classObject ? classObject.spellcaster : false;
        setIsSpellCaster(isSpellCaster);
    }

    const deleteSkillProficiency = async () => {
        try {
            await AsyncStorage.removeItem(SKILL_PROFICIENCY_KEY);
        } catch (error) {
            console.error('Error deleting skill proficiency:', error);
        }
    }

    // Load statsData on mount
    useEffect(() => {
        const loadData = async () => {
            await loadStatsData();
            await loadUnusedSkillPoints();
            await loadRaceSkillProfGained();
            await loadSkillProficiency();
            await loadSubclass();
        }
        loadData();
    }, []);

    // Set the isSpellCaster state based on the class
    useEffect(() => {
        if (!statsDataLoaded) return;
        handleSpellCaster();
        loadRaceSkillProfGained();

        if (prevClassRef.current === null) {
            // This should not happen since we initialize prevClassRef.current in loadStatsData
            prevClassRef.current = statsData.class || null;
            return;
        }
        if (statsData.class !== prevClassRef.current) {
            // The class has changed after data has been loaded
            setSkillProficiency([]);
            deleteSkillProficiency();
            deleteSubclass();
            setSubclass(null);
        }
        // Update the ref with the current class value
        prevClassRef.current = statsData.class || null;
    }, [statsData.class, statsDataLoaded]);

    useEffect(() => {
        switch (statsData.class?.toLowerCase()) {
            case 'artificer':
            case 'barbarian':
                setUnusedSkillPoints(2);
                break;
            case 'bard':
                setUnusedSkillPoints(3);
                break;
            case 'cleric':
                setUnusedSkillPoints(2);
                break;
            default:
                setUnusedSkillPoints(0);
                break;
        }
    }, [statsData.class]);


    // Save subclass to AsyncStorage when it changes
    useEffect(() => {
        if (subclassLoaded.current) {
            saveSubclass(subclass);
        }
    }, [subclass]);


    return (
        <StatsDataContext.Provider value={{
            statsData,
            updateStatsData,
            isSpellCaster,
            unusedSkillPoints,
            setUnusedSkillPoints,
            raceSkillProfGained,
            setRaceSkillProfGained,
            skillProficiency,
            setSkillProficiency,
            subclass,
            setSubclass,
        }}>
            {children}
        </StatsDataContext.Provider>
    );
};

export default StatsDataContext;

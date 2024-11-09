import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIONS_STORAGE_KEY = 'actions_available';
const BONUS_ACTIONS_STORAGE_KEY = 'bonus_actions_available';
const REACTIONS_STORAGE_KEY = 'reactions_available';
const SPENT_SPELL_SLOTS_STORAGE_KEY = 'spent_spell_slots';
const HELLISH_REBUKE_SPENT_STORAGE_KEY = 'hellish_rebuke_spent';
const DARKNESS_SPENT_STORAGE_KEY = 'darkness_spent';
const BREATH_WEAPON_SPENT_STORAGE_KEY = 'breath_weapon_spent';

interface ActionsContextType {
    currentActionsAvailable: number;
    setCurrentActionsAvailable: React.Dispatch<React.SetStateAction<number>>;
    currentBonusActionsAvailable: number;
    setCurrentBonusActionsAvailable: React.Dispatch<React.SetStateAction<number>>;
    currentReactionsAvailable: number;
    setCurrentReactionsAvailable: React.Dispatch<React.SetStateAction<number>>;
    spentSpellSlots: { [key: string]: number };
    setSpentSpellSlots: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
    hellishRebukeSpent: boolean;
    setHellishRebukeSpent: React.Dispatch<React.SetStateAction<boolean>>;
    darknessSpent: boolean;
    setDarknessSpent: React.Dispatch<React.SetStateAction<boolean>>;
    breathWeaponSpent: boolean;
    setBreathWeaponSpent: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionsContext = createContext<ActionsContextType | undefined>(undefined);

export const ActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentActionsAvailable, setCurrentActionsAvailable] = useState<number>(1);
    const [currentBonusActionsAvailable, setCurrentBonusActionsAvailable] = useState<number>(1);
    const [currentReactionsAvailable, setCurrentReactionsAvailable] = useState<number>(1);
    const [spentSpellSlots, setSpentSpellSlots] = useState<{ [key: string]: number }>({
        SpLv1: 0,
        SpLv2: 0,
        SpLv3: 0,
        SpLv4: 0,
        SpLv5: 0,
        SpLv6: 0,
        SpLv7: 0,
        SpLv8: 0,
        SpLv9: 0
    });
    const [hellishRebukeSpent, setHellishRebukeSpent] = useState<boolean>(false);
    const [darknessSpent, setDarknessSpent] = useState<boolean>(false);
    const [breathWeaponSpent, setBreathWeaponSpent] = useState<boolean>(false);

    // Load saved values on mount
    useEffect(() => {
        const loadSavedValues = async () => {
            try {
                const savedActions = await AsyncStorage.getItem(ACTIONS_STORAGE_KEY);
                const savedBonusActions = await AsyncStorage.getItem(BONUS_ACTIONS_STORAGE_KEY);
                const savedReactions = await AsyncStorage.getItem(REACTIONS_STORAGE_KEY);
                const savedSpentSpellSlots = await AsyncStorage.getItem(SPENT_SPELL_SLOTS_STORAGE_KEY);
                const savedHellishRebukeSpent = await AsyncStorage.getItem(HELLISH_REBUKE_SPENT_STORAGE_KEY);
                const savedDarknessSpent = await AsyncStorage.getItem(DARKNESS_SPENT_STORAGE_KEY);
                const savedBreathWeaponSpent = await AsyncStorage.getItem(BREATH_WEAPON_SPENT_STORAGE_KEY);

                if (savedActions) {
                    setCurrentActionsAvailable(Number(savedActions));
                }
                if (savedBonusActions) {
                    setCurrentBonusActionsAvailable(Number(savedBonusActions));
                }
                if (savedReactions) {
                    setCurrentReactionsAvailable(Number(savedReactions));
                }
                if (savedSpentSpellSlots) {
                    setSpentSpellSlots(JSON.parse(savedSpentSpellSlots));
                }
                if (savedHellishRebukeSpent) {
                    setHellishRebukeSpent(savedHellishRebukeSpent === 'true');
                }
                if (savedDarknessSpent) {
                    setDarknessSpent(savedDarknessSpent === 'true');
                }
                if (savedBreathWeaponSpent) {
                    setBreathWeaponSpent(savedBreathWeaponSpent === 'true');
                }
            } catch (error) {
                console.error('Error loading actions from storage:', error);
            }
        };

        loadSavedValues();
    }, []);

    // Save values when they change
    useEffect(() => {
        const saveValues = async () => {
            try {
                await AsyncStorage.setItem(ACTIONS_STORAGE_KEY, currentActionsAvailable.toString());
                await AsyncStorage.setItem(BONUS_ACTIONS_STORAGE_KEY, currentBonusActionsAvailable.toString());
                await AsyncStorage.setItem(REACTIONS_STORAGE_KEY, currentReactionsAvailable.toString());
                await AsyncStorage.setItem(SPENT_SPELL_SLOTS_STORAGE_KEY, JSON.stringify(spentSpellSlots));
                await AsyncStorage.setItem(HELLISH_REBUKE_SPENT_STORAGE_KEY, hellishRebukeSpent.toString());
                await AsyncStorage.setItem(DARKNESS_SPENT_STORAGE_KEY, darknessSpent.toString());
                await AsyncStorage.setItem(BREATH_WEAPON_SPENT_STORAGE_KEY, breathWeaponSpent.toString());
            } catch (error) {
                console.error('Error saving actions to storage:', error);
            }
        };

        saveValues();
    }, [currentActionsAvailable, currentBonusActionsAvailable, currentReactionsAvailable, spentSpellSlots, hellishRebukeSpent, darknessSpent, breathWeaponSpent]);

    return (
        <ActionsContext.Provider
            value={{
                currentActionsAvailable,
                setCurrentActionsAvailable,
                currentBonusActionsAvailable,
                setCurrentBonusActionsAvailable,
                currentReactionsAvailable,
                setCurrentReactionsAvailable,
                spentSpellSlots,
                setSpentSpellSlots,
                hellishRebukeSpent,
                setHellishRebukeSpent,
                darknessSpent,
                setDarknessSpent,
                breathWeaponSpent,
                setBreathWeaponSpent,
            }}
        >
            {children}
        </ActionsContext.Provider>
    );
};

export const useActions = (): ActionsContextType => {
    const context = useContext(ActionsContext);
    if (!context) {
        throw new Error('useActions must be used within an ActionsProvider');
    }
    return context;
};

import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIONS_STORAGE_KEY = 'actions_available';
const BONUS_ACTIONS_STORAGE_KEY = 'bonus_actions_available';

interface ActionsContextType {
    currentActionsAvailable: number;
    setCurrentActionsAvailable: React.Dispatch<React.SetStateAction<number>>;
    currentBonusActionsAvailable: number;
    setCurrentBonusActionsAvailable: React.Dispatch<React.SetStateAction<number>>;
}

const ActionsContext = createContext<ActionsContextType | undefined>(undefined);

export const ActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentActionsAvailable, setCurrentActionsAvailable] = useState<number>(1);
    const [currentBonusActionsAvailable, setCurrentBonusActionsAvailable] = useState<number>(1);

    // Load saved values on mount
    useEffect(() => {
        const loadSavedValues = async () => {
            try {
                const savedActions = await AsyncStorage.getItem(ACTIONS_STORAGE_KEY);
                const savedBonusActions = await AsyncStorage.getItem(BONUS_ACTIONS_STORAGE_KEY);

                if (savedActions) {
                    setCurrentActionsAvailable(Number(savedActions));
                }
                if (savedBonusActions) {
                    setCurrentBonusActionsAvailable(Number(savedBonusActions));
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
            } catch (error) {
                console.error('Error saving actions to storage:', error);
            }
        };

        saveValues();
    }, [currentActionsAvailable, currentBonusActionsAvailable]);

    return (
        <ActionsContext.Provider
            value={{
                currentActionsAvailable,
                setCurrentActionsAvailable,
                currentBonusActionsAvailable,
                setCurrentBonusActionsAvailable,
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

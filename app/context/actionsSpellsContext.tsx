import { createContext, useContext, useState } from "react";

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

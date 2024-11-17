import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Item, useItemEquipment } from './ItemEquipmentContext'; // Assuming you have an Item interface defined here.
import AsyncStorage from '@react-native-async-storage/async-storage';
import weaponsData from '../app/data/weapons.json';
import StatsDataContext from './StatsDataContext';

export type WeaponSlot = 'mainHand' | 'offHand' | 'rangedHand';

export interface DraconicAncestry {
    dragon: string;
    damageType: string;
    breathWeapon: string;
    typicalAlignment: string;
}

export interface CharacterContextProps {
    mainHandWeapon: Item | null;
    offHandWeapon: Item | null;
    rangedHandWeapon: Item | null;
    equipWeapon: (slot: WeaponSlot, weapon: Item | null) => void;
    getWeaponDamage: (weapon: Item) => string;
    getWeaponSkillModifiers: (weapon: Item) => string[];
    getWeaponProperties: (weapon: Item) => string[];
    getWeaponAttackBonus: (weapon: Item) => string;
    luckyPointsEnabled: boolean;
    setLuckyPointsEnabled: (value: boolean) => void;
    luckyPoints: number | null;
    setLuckyPoints: (points: number) => void;
    luckyPointsMax: number;
    setLuckyPointsMax: (points: number) => void;
    relentlessEnduranceGained: boolean;
    setRelentlessEnduranceGained: (value: boolean) => void;
    relentlessEnduranceUsable: boolean;
    setRelentlessEnduranceUsable: (value: boolean) => void;
    infernalLegacyEnabled: boolean;
    setInfernalLegacyEnabled: (value: boolean) => void;
    draconicAncestry: DraconicAncestry | null;
    setDraconicAncestry: (value: DraconicAncestry | null) => void;
    breathWeaponEnabled: boolean;
    setBreathWeaponEnabled: (value: boolean) => void;
    magicalTinkeringEnabled: boolean;
    setMagicalTinkeringEnabled: (value: boolean) => void;
    infuseItemEnabled: boolean;
    setInfuseItemEnabled: (value: boolean) => void;
    infuseItemSpent: boolean;
    setInfuseItemSpent: (value: boolean) => void;
    infusionsLearned: string[];
    setInfusionsLearned: (value: string[]) => void;
    primalKnowledgeEnabled: boolean;
    setPrimalKnowledgeEnabled: (value: boolean) => void;
    primalKnowledgeEnabledAgain: boolean;
    setPrimalKnowledgeEnabledAgain: (value: boolean) => void;
    primalChampionEnabled: boolean;
    setPrimalChampionEnabled: (value: boolean) => void;
}

export const CharacterContext = createContext<CharacterContextProps | undefined>(undefined);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
    const [weapons, setWeapons] = useState<{
        mainHandWeapon: Item | null;
        offHandWeapon: Item | null;
        rangedHandWeapon: Item | null;
    }>({
        mainHandWeapon: null,
        offHandWeapon: null,
        rangedHandWeapon: null,
    });
    const { statsData } = useContext(StatsDataContext);
    const { items } = useItemEquipment();
    const [isLoading, setIsLoading] = useState(true);
    const [luckyPoints, setLuckyPoints] = useState<number | null>(null);
    const [luckyPointsMax, setLuckyPointsMax] = useState<number>(1);
    const [relentlessEnduranceGained, setRelentlessEnduranceGained] = useState<boolean>(false);
    const [relentlessEnduranceUsable, setRelentlessEnduranceUsable] = useState<boolean>(false);
    const [luckyPointsEnabled, setLuckyPointsEnabled] = useState<boolean>(false);
    const [infernalLegacyEnabled, setInfernalLegacyEnabled] = useState<boolean>(false);
    const [draconicAncestry, setDraconicAncestry] = useState<DraconicAncestry | null>(null);
    const [breathWeaponEnabled, setBreathWeaponEnabled] = useState<boolean>(false);
    const [magicalTinkeringEnabled, setMagicalTinkeringEnabled] = useState<boolean>(false);
    const [infuseItemEnabled, setInfuseItemEnabled] = useState<boolean>(false);
    const [infuseItemSpent, setInfuseItemSpent] = useState<boolean>(false);
    const [infusionsLearned, setInfusionsLearned] = useState<string[]>([]);
    const [primalKnowledgeEnabled, setPrimalKnowledgeEnabled] = useState<boolean>(false);
    const [primalKnowledgeEnabledAgain, setPrimalKnowledgeEnabledAgain] = useState<boolean>(false);
    const [primalChampionEnabled, setPrimalChampionEnabled] = useState<boolean>(false);

    const WEAPONS_STORAGE_KEY = '@equipped_weapons';
    const LUCKY_POINTS_STORAGE_KEY = '@lucky_points';
    const LUCKY_POINTS_MAX_STORAGE_KEY = '@lucky_points_max';
    const RELLENTLESS_ENDURANCE_GAINED_STORAGE_KEY = '@relentless_endurance_gained';
    const RELLENTLESS_ENDURANCE_USABLE_STORAGE_KEY = '@relentless_endurance_usable';
    const LUCKY_POINTS_ENABLED_STORAGE_KEY = '@lucky_points_enabled';
    const INFERNAL_LEGACY_ENABLED_STORAGE_KEY = '@infernal_legacy_enabled';
    const DRACONIC_ANCESTRY_ENABLED_STORAGE_KEY = '@draconic_ancestry_enabled';
    const BREATH_WEAPON_ENABLED_STORAGE_KEY = '@breath_weapon_enabled';
    const MAGICAL_TINKERING_ENABLED_STORAGE_KEY = '@magical_tinkering_enabled';
    const INFUSE_ITEM_ENABLED_STORAGE_KEY = '@infuse_item_enabled';
    const INFUSE_ITEM_SPENT_STORAGE_KEY = '@infuse_item_spent';
    const INFUSIONS_LEARNED_STORAGE_KEY = '@infusions_learned';
    const PRIMAL_KNOWLEDGE_ENABLED_STORAGE_KEY = '@primal_knowledge_enabled';
    const PRIMAL_KNOWLEDGE_ENABLED_AGAIN_STORAGE_KEY = '@primal_knowledge_enabled_again';
    const PRIMAL_CHAMPION_ENABLED_STORAGE_KEY = '@primal_champion_enabled';

    // Load data from AsyncStorage on component mount
    useEffect(() => {
        const loadDataFromStorage = async () => {
            try {
                const storedWeapons = await AsyncStorage.getItem(WEAPONS_STORAGE_KEY);
                if (storedWeapons) {
                    setWeapons(JSON.parse(storedWeapons));
                }
                const storedLuckyPoints = await AsyncStorage.getItem(LUCKY_POINTS_STORAGE_KEY);
                if (storedLuckyPoints) {
                    setLuckyPoints(parseInt(storedLuckyPoints));
                }
                const storedLuckyPointsMax = await AsyncStorage.getItem(LUCKY_POINTS_MAX_STORAGE_KEY);
                if (storedLuckyPointsMax) {
                    setLuckyPointsMax(parseInt(storedLuckyPointsMax));
                }
                const storedRelentlessEnduranceGained = await AsyncStorage.getItem(RELLENTLESS_ENDURANCE_GAINED_STORAGE_KEY);
                if (storedRelentlessEnduranceGained) {
                    setRelentlessEnduranceGained(storedRelentlessEnduranceGained === 'true');
                }
                const storedRelentlessEnduranceUsable = await AsyncStorage.getItem(RELLENTLESS_ENDURANCE_USABLE_STORAGE_KEY);
                if (storedRelentlessEnduranceUsable) {
                    setRelentlessEnduranceUsable(storedRelentlessEnduranceUsable === 'true');
                }
                const storedLuckyPointsEnabled = await AsyncStorage.getItem(LUCKY_POINTS_ENABLED_STORAGE_KEY);
                if (storedLuckyPointsEnabled) {
                    setLuckyPointsEnabled(storedLuckyPointsEnabled === 'true');
                }
                const storedInfernalLegacyEnabled = await AsyncStorage.getItem(INFERNAL_LEGACY_ENABLED_STORAGE_KEY);
                if (storedInfernalLegacyEnabled) {
                    setInfernalLegacyEnabled(storedInfernalLegacyEnabled === 'true');
                }
                const storedDraconicAncestryEnabled = await AsyncStorage.getItem(DRACONIC_ANCESTRY_ENABLED_STORAGE_KEY);
                if (storedDraconicAncestryEnabled) {
                    setDraconicAncestry(JSON.parse(storedDraconicAncestryEnabled));
                }
                const storedBreathWeaponEnabled = await AsyncStorage.getItem(BREATH_WEAPON_ENABLED_STORAGE_KEY);
                if (storedBreathWeaponEnabled) {
                    setBreathWeaponEnabled(storedBreathWeaponEnabled === 'true');
                }
                const storedMagicalTinkeringEnabled = await AsyncStorage.getItem(MAGICAL_TINKERING_ENABLED_STORAGE_KEY);
                if (storedMagicalTinkeringEnabled) {
                    setMagicalTinkeringEnabled(storedMagicalTinkeringEnabled === 'true');
                }
                const storedInfuseItemEnabled = await AsyncStorage.getItem(INFUSE_ITEM_ENABLED_STORAGE_KEY);
                if (storedInfuseItemEnabled) {
                    setInfuseItemEnabled(storedInfuseItemEnabled === 'true');
                }
                const storedInfuseItemSpent = await AsyncStorage.getItem(INFUSE_ITEM_SPENT_STORAGE_KEY);
                if (storedInfuseItemSpent) {
                    setInfuseItemSpent(storedInfuseItemSpent === 'true');
                }
                const storedInfusionsLearned = await AsyncStorage.getItem(INFUSIONS_LEARNED_STORAGE_KEY);
                if (storedInfusionsLearned) {
                    setInfusionsLearned(JSON.parse(storedInfusionsLearned));
                }
                const storedPrimalKnowledgeEnabled = await AsyncStorage.getItem(PRIMAL_KNOWLEDGE_ENABLED_STORAGE_KEY);
                if (storedPrimalKnowledgeEnabled) {
                    setPrimalKnowledgeEnabled(storedPrimalKnowledgeEnabled === 'true');
                }
                const storedPrimalKnowledgeEnabledAgain = await AsyncStorage.getItem(PRIMAL_KNOWLEDGE_ENABLED_AGAIN_STORAGE_KEY);
                if (storedPrimalKnowledgeEnabledAgain) {
                    setPrimalKnowledgeEnabledAgain(storedPrimalKnowledgeEnabledAgain === 'true');
                }
                const storedPrimalChampionEnabled = await AsyncStorage.getItem(PRIMAL_CHAMPION_ENABLED_STORAGE_KEY);
                if (storedPrimalChampionEnabled) {
                    setPrimalChampionEnabled(storedPrimalChampionEnabled === 'true');
                }
            } catch (error) {
                console.error('Error loading weapons from AsyncStorage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDataFromStorage();
    }, []);


    // set relentless endurance boolean to false when class is changed
    useEffect(() => {
        setRelentlessEnduranceGained(false);
        setRelentlessEnduranceUsable(false);
        setLuckyPointsEnabled(false);
        setInfernalLegacyEnabled(false);
        setDraconicAncestry(null);
        setBreathWeaponEnabled(false);
        setMagicalTinkeringEnabled(false);
        setInfuseItemEnabled(false);
        setInfuseItemSpent(false);
        setInfusionsLearned([]);
        setPrimalKnowledgeEnabled(false);
        setPrimalKnowledgeEnabledAgain(false);
        setPrimalChampionEnabled(false);
    }, [statsData.class]);

    // save primal champion enabled to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const savePrimalChampionEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(PRIMAL_CHAMPION_ENABLED_STORAGE_KEY, primalChampionEnabled.toString());
                } catch (error) {
                    console.error('Error saving primal champion enabled to AsyncStorage:', error);
                }
            }
            savePrimalChampionEnabledToStorage();
        }
    }, [primalChampionEnabled, isLoading]);

    // save primal knowledge enabled again to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const savePrimalKnowledgeEnabledAgainToStorage = async () => {
                try {
                    await AsyncStorage.setItem(PRIMAL_KNOWLEDGE_ENABLED_AGAIN_STORAGE_KEY, primalKnowledgeEnabledAgain.toString());
                } catch (error) {
                    console.error('Error saving primal knowledge enabled again to AsyncStorage:', error);
                }
            }
            savePrimalKnowledgeEnabledAgainToStorage();
        }
    }, [primalKnowledgeEnabledAgain, isLoading]);

    // save primal knowledge enabled to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const savePrimalKnowledgeEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(PRIMAL_KNOWLEDGE_ENABLED_STORAGE_KEY, primalKnowledgeEnabled.toString());
                } catch (error) {
                    console.error('Error saving primal knowledge enabled to AsyncStorage:', error);
                }
            }
            savePrimalKnowledgeEnabledToStorage();
        }
    }, [primalKnowledgeEnabled, isLoading]);


    // save infusions learned to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveInfusionsLearnedToStorage = async () => {
                try {
                    await AsyncStorage.setItem(INFUSIONS_LEARNED_STORAGE_KEY, JSON.stringify(infusionsLearned));
                } catch (error) {
                    console.error('Error saving infusions learned to AsyncStorage:', error);
                }
            }
            saveInfusionsLearnedToStorage();
        }
    }, [infusionsLearned, isLoading]);


    // set infuse item spent boolean to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveInfuseItemSpentToStorage = async () => {
                try {
                    await AsyncStorage.setItem(INFUSE_ITEM_SPENT_STORAGE_KEY, infuseItemSpent.toString());
                } catch (error) {
                    console.error('Error saving infuse item spent to AsyncStorage:', error);
                }
            }
            saveInfuseItemSpentToStorage();
        }
    }, [infuseItemSpent, isLoading]);

    // set infuse item boolean to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveInfuseItemEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(INFUSE_ITEM_ENABLED_STORAGE_KEY, infuseItemEnabled.toString());
                } catch (error) {
                    console.error('Error saving infuse item enabled to AsyncStorage:', error);
                }
            };
            saveInfuseItemEnabledToStorage();
        }
    }, [infuseItemEnabled, isLoading]);


    // set magical tinkering boolean to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveMagicalTinkeringEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(MAGICAL_TINKERING_ENABLED_STORAGE_KEY, magicalTinkeringEnabled.toString());
                } catch (error) {
                    console.error('Error saving magical tinkering enabled to AsyncStorage:', error);
                }
            };
            saveMagicalTinkeringEnabledToStorage();
        }
    }, [magicalTinkeringEnabled, isLoading]);

    // set breath weapon boolean to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveBreathWeaponEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(BREATH_WEAPON_ENABLED_STORAGE_KEY, breathWeaponEnabled.toString());
                } catch (error) {
                    console.error('Error saving breath weapon enabled to AsyncStorage:', error);
                }
            }
            saveBreathWeaponEnabledToStorage();
        }
    }, [breathWeaponEnabled, isLoading]);

    // set draconic ancestry boolean to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveDraconicAncestryEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(DRACONIC_ANCESTRY_ENABLED_STORAGE_KEY, draconicAncestry ? JSON.stringify(draconicAncestry) : 'null');
                } catch (error) {
                    console.error('Error saving draconic ancestry enabled to AsyncStorage:', error);
                }
            };
            saveDraconicAncestryEnabledToStorage();
        }
    }, [draconicAncestry, isLoading]);


    // save infernal legacy enabled to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveInfernalLegacyEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(INFERNAL_LEGACY_ENABLED_STORAGE_KEY, infernalLegacyEnabled.toString());
                } catch (error) {
                    console.error('Error saving infernal legacy enabled to AsyncStorage:', error);
                }
            };
            saveInfernalLegacyEnabledToStorage();
        }
    }, [infernalLegacyEnabled, isLoading]);

    // save relentless endurance usable to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveRelentlessEnduranceUsableToStorage = async () => {
                try {
                    await AsyncStorage.setItem(RELLENTLESS_ENDURANCE_USABLE_STORAGE_KEY, relentlessEnduranceUsable.toString());
                } catch (error) {
                    console.error('Error saving relentless endurance usable to AsyncStorage:', error);
                }
            };
            saveRelentlessEnduranceUsableToStorage();
        }
    }, [relentlessEnduranceUsable, isLoading]);

    // Save weapons points to AsyncStorage whenever they change
    useEffect(() => {
        if (!isLoading) {
            const saveWeaponsToStorage = async () => {
                try {
                    await AsyncStorage.setItem(WEAPONS_STORAGE_KEY, JSON.stringify(weapons));
                } catch (error) {
                    console.error('Error saving weapons to AsyncStorage:', error);
                }
            };

            saveWeaponsToStorage();
        }
    }, [weapons, isLoading]);

    // Save lucky points to AsyncStorage whenever they change
    useEffect(() => {
        if (!isLoading) {
            const saveLuckyPointsToStorage = async () => {
                try {
                    if (luckyPoints === null || luckyPoints === -1) {
                        await AsyncStorage.removeItem(LUCKY_POINTS_STORAGE_KEY);
                    } else {
                        await AsyncStorage.setItem(LUCKY_POINTS_STORAGE_KEY, luckyPoints.toString());
                    }
                    await AsyncStorage.setItem(LUCKY_POINTS_MAX_STORAGE_KEY, luckyPointsMax.toString());
                } catch (error) {
                    console.error('Error saving lucky points to AsyncStorage:', error);
                }
            };

            saveLuckyPointsToStorage();
        }
    }, [luckyPoints, luckyPointsMax, isLoading]);


    // save lucky points enabled to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveLuckyPointsEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(LUCKY_POINTS_ENABLED_STORAGE_KEY, luckyPointsEnabled.toString());
                } catch (error) {
                    console.error('Error saving lucky points enabled to AsyncStorage:', error);
                }
            };
            saveLuckyPointsEnabledToStorage();
        }
    }, [luckyPointsEnabled, isLoading]);

    // save relentless endurance boolean to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveRelentlessEnduranceToStorage = async () => {
                try {
                    await AsyncStorage.setItem(RELLENTLESS_ENDURANCE_GAINED_STORAGE_KEY, relentlessEnduranceGained.toString());
                } catch (error) {
                    console.error('Error saving relentless endurance to AsyncStorage:', error);
                }
            };
            saveRelentlessEnduranceToStorage();
        }
    }, [relentlessEnduranceGained, isLoading]);


    // Update weapon slots when items change
    useEffect(() => {
        // Check if equipped weapons are still in items
        setWeapons((prevWeapons) => {
            const updatedWeapons = { ...prevWeapons };

            // Helper function to check if a weapon is in items
            const isWeaponInItems = (weapon: Item | null) => {
                if (!weapon) return false;
                return items.some((item) => item.id === weapon.id);
            };

            // Check mainHandWeapon
            if (prevWeapons.mainHandWeapon && !isWeaponInItems(prevWeapons.mainHandWeapon)) {
                updatedWeapons.mainHandWeapon = null;
            }

            // Check offHandWeapon
            if (prevWeapons.offHandWeapon && !isWeaponInItems(prevWeapons.offHandWeapon)) {
                updatedWeapons.offHandWeapon = null;
            }

            // Check rangedHandWeapon
            if (prevWeapons.rangedHandWeapon && !isWeaponInItems(prevWeapons.rangedHandWeapon)) {
                updatedWeapons.rangedHandWeapon = null;
            }

            return updatedWeapons;
        });
    }, [items]);



    const equipWeapon = (slot: WeaponSlot, weapon: Item | null) => {
        setWeapons((prevWeapons) => ({
            ...prevWeapons,
            [`${slot}Weapon`]: weapon,
        }));
    };

    const findWeaponInItems = (weaponName: string) => {
        return items.find((item) => item.name.toLowerCase() === weaponName.toLowerCase());
    };

    const findWeaponInData = (weaponName: string) => {
        for (const category of weaponsData.weapons) {
            const weaponItem = category.items.find(
                (item) => item.name.toLowerCase() === weaponName.toLowerCase()
            );
            if (weaponItem) {
                return weaponItem;
            }
        }
        return null;
    };

    const getWeaponDamage = (weapon: Item) => {
        const itemWeapon = findWeaponInItems(weapon.name);
        if (itemWeapon?.damage) {
            return itemWeapon.damage;
        }

        const weaponData = findWeaponInData(weapon.name);
        return weaponData?.damage || '1';
    };

    const getWeaponAttackBonus = (weapon: Item) => {
        const itemWeapon = findWeaponInItems(weapon.name);
        return itemWeapon?.attackBonus || '';
    };
    const getWeaponSkillModifiers = (weapon: Item): string[] => {
        const itemWeapon = findWeaponInItems(weapon.weaponType || '');
        if (itemWeapon && 'skill_modifiers' in itemWeapon) {
            return itemWeapon.skill_modifiers as string[];
        }
        const weaponData = findWeaponInData(weapon.weaponType || '');
        return weaponData && 'skill_modifiers' in weaponData ? weaponData.skill_modifiers as string[] : [];
    };

    const getWeaponProperties = (weapon: Item) => {
        // First, use the properties directly from the weapon object
        if (weapon.details !== undefined && weapon.details !== null && weapon.details !== '') {
            return weapon.details.split(',');
        }
        const itemWeapon = findWeaponInItems(weapon.name);
        if (itemWeapon?.properties) {
            return itemWeapon.properties;
        }

        const weaponData = findWeaponInData(weapon.name);
        return weaponData?.properties || [];
    };

    if (isLoading) {
        // Optionally render a loading indicator
        return null;
    }

    return (
        <CharacterContext.Provider
            value={{
                mainHandWeapon: weapons.mainHandWeapon,
                offHandWeapon: weapons.offHandWeapon,
                rangedHandWeapon: weapons.rangedHandWeapon,
                equipWeapon,
                getWeaponDamage,
                getWeaponSkillModifiers,
                getWeaponProperties,
                getWeaponAttackBonus,
                luckyPoints,
                setLuckyPoints,
                luckyPointsMax,
                setLuckyPointsMax,
                relentlessEnduranceGained,
                setRelentlessEnduranceGained,
                relentlessEnduranceUsable,
                setRelentlessEnduranceUsable,
                luckyPointsEnabled,
                setLuckyPointsEnabled,
                infernalLegacyEnabled,
                setInfernalLegacyEnabled,
                draconicAncestry,
                setDraconicAncestry,
                breathWeaponEnabled,
                setBreathWeaponEnabled,
                magicalTinkeringEnabled,
                setMagicalTinkeringEnabled,
                infuseItemEnabled,
                setInfuseItemEnabled,
                infuseItemSpent,
                setInfuseItemSpent,
                infusionsLearned,
                setInfusionsLearned,
                primalKnowledgeEnabled,
                setPrimalKnowledgeEnabled,
                primalKnowledgeEnabledAgain,
                setPrimalKnowledgeEnabledAgain,
                primalChampionEnabled,
                setPrimalChampionEnabled,
            }}
        >
            {children}
        </CharacterContext.Provider>
    );
};

export default CharacterContext;

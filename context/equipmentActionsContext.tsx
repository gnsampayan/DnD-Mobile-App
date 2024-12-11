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
    bardicInspirationEnabled: boolean;
    setBardicInspirationEnabled: (value: boolean) => void;
    expertiseEnabled: boolean;
    setExpertiseEnabled: (value: boolean) => void;
    expertiseEnabledAgain: boolean;
    setExpertiseEnabledAgain: (value: boolean) => void;
    fontOfInspirationEnabled: boolean;
    setFontOfInspirationEnabled: (value: boolean) => void;
    countercharmEnabled: boolean;
    setCountercharmEnabled: (value: boolean) => void;
    arcaneInitiateEnabled: boolean;
    setArcaneInitiateEnabled: (value: boolean) => void;
    arcaneInitiateCantrips: string[];
    setArcaneInitiateCantrips: (value: string[]) => void;
    channelDivinityEnabled: boolean;
    setChannelDivinityEnabled: (value: boolean) => void;
    arcaneMasteryEnabled: boolean;
    setArcaneMasteryEnabled: (value: boolean) => void;
    arcaneMasterySpellsLearned: string[];
    setArcaneMasterySpellsLearned: (value: string[]) => void;
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
    const [bardicInspirationEnabled, setBardicInspirationEnabled] = useState<boolean>(false);
    const [expertiseEnabled, setExpertiseEnabled] = useState<boolean>(false);
    const [expertiseEnabledAgain, setExpertiseEnabledAgain] = useState<boolean>(false);
    const [fontOfInspirationEnabled, setFontOfInspirationEnabled] = useState<boolean>(false);
    const [countercharmEnabled, setCountercharmEnabled] = useState<boolean>(false);
    const [arcaneInitiateEnabled, setArcaneInitiateEnabled] = useState<boolean>(false);
    const [arcaneInitiateCantrips, setArcaneInitiateCantrips] = useState<string[]>([]);
    const [channelDivinityEnabled, setChannelDivinityEnabled] = useState<boolean>(false);
    const [arcaneMasteryEnabled, setArcaneMasteryEnabled] = useState<boolean>(false);
    const [arcaneMasterySpellsLearned, setArcaneMasterySpellsLearned] = useState<string[]>([]);
    const [previousClass, setPreviousClass] = useState<string | null>(null);

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
    const BARDIC_INSPIRATION_ENABLED_STORAGE_KEY = '@bardic_inspiration_enabled';
    const EXPERTISE_ENABLED_STORAGE_KEY = '@expertise_enabled';
    const EXPERTISE_ENABLED_AGAIN_STORAGE_KEY = '@expertise_enabled_again';
    const FONT_OF_INSPIRATION_ENABLED_STORAGE_KEY = '@font_of_inspiration_enabled';
    const COUNTERCHARM_ENABLED_STORAGE_KEY = '@countercharm_enabled';
    const ARCANE_INITIATE_ENABLED_STORAGE_KEY = '@arcane_initiate_enabled';
    const ARCANE_INITIATE_CANTRIPS_STORAGE_KEY = '@arcane_initiate_cantrips';
    const CHANNEL_DIVINITY_ENABLED_STORAGE_KEY = '@channel_divinity_enabled';
    const ARCANE_MASTERY_ENABLED_STORAGE_KEY = '@arcane_mastery_enabled';
    const ARCANE_MASTERY_SPELLS_LEARNED_STORAGE_KEY = '@arcane_mastery_spells_learned';
    const PREVIOUS_CLASS_STORAGE_KEY = '@previous_class';


    // Load data from AsyncStorage on component mount
    useEffect(() => {
        const loadDataFromStorage = async () => {
            try {
                const storageItems = [
                    { key: WEAPONS_STORAGE_KEY, setter: setWeapons, parser: JSON.parse },
                    { key: LUCKY_POINTS_STORAGE_KEY, setter: setLuckyPoints, parser: parseInt },
                    { key: LUCKY_POINTS_MAX_STORAGE_KEY, setter: setLuckyPointsMax, parser: parseInt },
                    {
                        key: RELLENTLESS_ENDURANCE_GAINED_STORAGE_KEY,
                        setter: setRelentlessEnduranceGained,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: RELLENTLESS_ENDURANCE_USABLE_STORAGE_KEY,
                        setter: setRelentlessEnduranceUsable,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: LUCKY_POINTS_ENABLED_STORAGE_KEY,
                        setter: setLuckyPointsEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: INFERNAL_LEGACY_ENABLED_STORAGE_KEY,
                        setter: setInfernalLegacyEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: DRACONIC_ANCESTRY_ENABLED_STORAGE_KEY,
                        setter: setDraconicAncestry,
                        parser: JSON.parse
                    },
                    {
                        key: BREATH_WEAPON_ENABLED_STORAGE_KEY,
                        setter: setBreathWeaponEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: MAGICAL_TINKERING_ENABLED_STORAGE_KEY,
                        setter: setMagicalTinkeringEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: INFUSE_ITEM_ENABLED_STORAGE_KEY,
                        setter: setInfuseItemEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: INFUSE_ITEM_SPENT_STORAGE_KEY,
                        setter: setInfuseItemSpent,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: INFUSIONS_LEARNED_STORAGE_KEY,
                        setter: setInfusionsLearned,
                        parser: JSON.parse
                    },
                    {
                        key: PRIMAL_KNOWLEDGE_ENABLED_STORAGE_KEY,
                        setter: setPrimalKnowledgeEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: PRIMAL_KNOWLEDGE_ENABLED_AGAIN_STORAGE_KEY,
                        setter: setPrimalKnowledgeEnabledAgain,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: PRIMAL_CHAMPION_ENABLED_STORAGE_KEY,
                        setter: setPrimalChampionEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: BARDIC_INSPIRATION_ENABLED_STORAGE_KEY,
                        setter: setBardicInspirationEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: EXPERTISE_ENABLED_STORAGE_KEY,
                        setter: setExpertiseEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: EXPERTISE_ENABLED_AGAIN_STORAGE_KEY,
                        setter: setExpertiseEnabledAgain,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: FONT_OF_INSPIRATION_ENABLED_STORAGE_KEY,
                        setter: setFontOfInspirationEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: COUNTERCHARM_ENABLED_STORAGE_KEY,
                        setter: setCountercharmEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: ARCANE_INITIATE_ENABLED_STORAGE_KEY,
                        setter: setArcaneInitiateEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: ARCANE_INITIATE_CANTRIPS_STORAGE_KEY,
                        setter: setArcaneInitiateCantrips,
                        parser: JSON.parse
                    },
                    {
                        key: CHANNEL_DIVINITY_ENABLED_STORAGE_KEY,
                        setter: setChannelDivinityEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: ARCANE_MASTERY_ENABLED_STORAGE_KEY,
                        setter: setArcaneMasteryEnabled,
                        parser: (val: string) => val === 'true'
                    },
                    {
                        key: ARCANE_MASTERY_SPELLS_LEARNED_STORAGE_KEY,
                        setter: setArcaneMasterySpellsLearned,
                        parser: JSON.parse
                    },
                    {
                        key: PREVIOUS_CLASS_STORAGE_KEY,
                        setter: setPreviousClass,
                        parser: (val: string) => val || null
                    }
                ];

                await Promise.all(
                    storageItems.map(async ({ key, setter, parser }) => {
                        const storedValue = await AsyncStorage.getItem(key);
                        if (storedValue !== null) {
                            setter(parser(storedValue));
                        }
                    })
                );

            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDataFromStorage();
    }, []);


    // save arcane mastery spells learned to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveArcaneMasterySpellsLearnedToStorage = async () => {
                try {
                    await AsyncStorage.setItem(ARCANE_MASTERY_SPELLS_LEARNED_STORAGE_KEY, JSON.stringify(arcaneMasterySpellsLearned));
                } catch (error) {
                    console.error('Error saving arcane mastery spells learned to AsyncStorage:', error);
                }
            }
            saveArcaneMasterySpellsLearnedToStorage();
        }
    }, [arcaneMasterySpellsLearned, isLoading]);


    // save arcane mastery enabled to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveArcaneMasteryEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(ARCANE_MASTERY_ENABLED_STORAGE_KEY, arcaneMasteryEnabled.toString());
                } catch (error) {
                    console.error('Error saving arcane mastery enabled to AsyncStorage:', error);
                }
            }
            saveArcaneMasteryEnabledToStorage();
        }
    }, [arcaneMasteryEnabled, isLoading]);

    // save channel divinity enabled to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveChannelDivinityEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(CHANNEL_DIVINITY_ENABLED_STORAGE_KEY, channelDivinityEnabled.toString());
                } catch (error) {
                    console.error('Error saving channel divinity enabled to AsyncStorage:', error);
                }
            }
            saveChannelDivinityEnabledToStorage();
        }
    }, [channelDivinityEnabled, isLoading]);

    // save arcane initiate cantrips to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveArcaneInitiateCantripsToStorage = async () => {
                try {
                    await AsyncStorage.setItem(ARCANE_INITIATE_CANTRIPS_STORAGE_KEY, JSON.stringify(arcaneInitiateCantrips));
                } catch (error) {
                    console.error('Error saving arcane initiate cantrips to AsyncStorage:', error);
                }
            }
            saveArcaneInitiateCantripsToStorage();
        }
    }, [arcaneInitiateCantrips, isLoading]);

    // save arcane initiate enabled to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveArcaneInitiateEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(ARCANE_INITIATE_ENABLED_STORAGE_KEY, arcaneInitiateEnabled.toString());
                } catch (error) {
                    console.error('Error saving arcane initiate enabled to AsyncStorage:', error);
                }
            }
            saveArcaneInitiateEnabledToStorage();
        }
    }, [arcaneInitiateEnabled, isLoading]);

    // save countercharm enabled to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveCountercharmEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(COUNTERCHARM_ENABLED_STORAGE_KEY, countercharmEnabled.toString());
                } catch (error) {
                    console.error('Error saving countercharm enabled to AsyncStorage:', error);
                }
            }
            saveCountercharmEnabledToStorage();
        }
    }, [countercharmEnabled, isLoading]);

    // save font of inspiration enabled to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveFontOfInspirationEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(FONT_OF_INSPIRATION_ENABLED_STORAGE_KEY, fontOfInspirationEnabled.toString());
                } catch (error) {
                    console.error('Error saving font of inspiration enabled to AsyncStorage:', error);
                }
            }
            saveFontOfInspirationEnabledToStorage();
        }
    }, [fontOfInspirationEnabled, isLoading]);

    // save bardic inspiration enabled to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveBardicInspirationEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(BARDIC_INSPIRATION_ENABLED_STORAGE_KEY, bardicInspirationEnabled.toString());
                } catch (error) {
                    console.error('Error saving bardic inspiration enabled to AsyncStorage:', error);
                }
            }
            saveBardicInspirationEnabledToStorage();
        }
    }, [bardicInspirationEnabled, isLoading]);

    // save expertise enabled to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveExpertiseEnabledToStorage = async () => {
                try {
                    await AsyncStorage.setItem(EXPERTISE_ENABLED_STORAGE_KEY, expertiseEnabled.toString());
                } catch (error) {
                    console.error('Error saving expertise enabled to AsyncStorage:', error);
                }
            }
            saveExpertiseEnabledToStorage();
        }
    }, [expertiseEnabled, isLoading]);

    // save expertise enabled again to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            const saveExpertiseEnabledAgainToStorage = async () => {
                try {
                    await AsyncStorage.setItem(EXPERTISE_ENABLED_AGAIN_STORAGE_KEY, expertiseEnabledAgain.toString());
                } catch (error) {
                    console.error('Error saving expertise enabled again to AsyncStorage:', error);
                }
            }
            saveExpertiseEnabledAgainToStorage();
        }
    }, [expertiseEnabledAgain, isLoading]);

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
                bardicInspirationEnabled,
                setBardicInspirationEnabled,
                expertiseEnabled,
                setExpertiseEnabled,
                expertiseEnabledAgain,
                setExpertiseEnabledAgain,
                fontOfInspirationEnabled,
                setFontOfInspirationEnabled,
                countercharmEnabled,
                setCountercharmEnabled,
                arcaneInitiateEnabled,
                setArcaneInitiateEnabled,
                arcaneInitiateCantrips,
                setArcaneInitiateCantrips,
                channelDivinityEnabled,
                setChannelDivinityEnabled,
                arcaneMasteryEnabled,
                setArcaneMasteryEnabled,
                arcaneMasterySpellsLearned,
                setArcaneMasterySpellsLearned,
            }}
        >
            {children}
        </CharacterContext.Provider>
    );
};

export default CharacterContext;

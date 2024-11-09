import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Item, useItemEquipment } from './ItemEquipmentContext'; // Assuming you have an Item interface defined here.
import AsyncStorage from '@react-native-async-storage/async-storage';
import weaponsData from '../data/weapons.json';

export type WeaponSlot = 'mainHand' | 'offHand' | 'rangedHand';

interface CharacterContextProps {
    mainHandWeapon: Item | null;
    offHandWeapon: Item | null;
    rangedHandWeapon: Item | null;
    equipWeapon: (slot: WeaponSlot, weapon: Item | null) => void;
    getWeaponDamage: (weapon: Item) => string;
    getWeaponSkillModifiers: (weapon: Item) => string[];
    getWeaponProperties: (weapon: Item) => string[];
    getWeaponAttackBonus: (weapon: Item) => string;
    luckyPoints: number | null;
    setLuckyPoints: (points: number) => void;
    luckyPointsMax: number;
    setLuckyPointsMax: (points: number) => void;
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
    const { items } = useItemEquipment();
    const [isLoading, setIsLoading] = useState(true);
    const [luckyPoints, setLuckyPoints] = useState<number | null>(null);
    const [luckyPointsMax, setLuckyPointsMax] = useState<number>(1);

    const WEAPONS_STORAGE_KEY = '@equipped_weapons';
    const LUCKY_POINTS_STORAGE_KEY = '@lucky_points';
    const LUCKY_POINTS_MAX_STORAGE_KEY = '@lucky_points_max';

    // Load weapons and lucky points from AsyncStorage on component mount
    useEffect(() => {
        const loadWeaponsFromStorage = async () => {
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
            } catch (error) {
                console.error('Error loading weapons from AsyncStorage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWeaponsFromStorage();
    }, []);

    // Save weapons and lucky points to AsyncStorage whenever they change
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

    // Save lucky points and max to AsyncStorage whenever they change
    useEffect(() => {
        if (!isLoading) {
            const saveLuckyPointsToStorage = async () => {
                try {
                    if (luckyPoints === null || luckyPoints === -1) {
                        await AsyncStorage.removeItem(LUCKY_POINTS_STORAGE_KEY);
                        console.log("luckyPoints removed from AsyncStorage");
                    } else {
                        await AsyncStorage.setItem(LUCKY_POINTS_STORAGE_KEY, luckyPoints.toString());
                        console.log("luckyPoints saved to AsyncStorage");
                    }
                    await AsyncStorage.setItem(LUCKY_POINTS_MAX_STORAGE_KEY, luckyPointsMax.toString());
                    console.log("luckyPointsMax saved to AsyncStorage");
                } catch (error) {
                    console.error('Error saving lucky points to AsyncStorage:', error);
                }
            };

            saveLuckyPointsToStorage();
        }
    }, [luckyPoints, luckyPointsMax, isLoading]);



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
                setLuckyPointsMax
            }}
        >
            {children}
        </CharacterContext.Provider>
    );
};

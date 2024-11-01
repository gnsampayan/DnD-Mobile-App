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

    const WEAPONS_STORAGE_KEY = '@equipped_weapons';

    // Load weapons from AsyncStorage on component mount
    useEffect(() => {
        const loadWeaponsFromStorage = async () => {
            try {
                const storedWeapons = await AsyncStorage.getItem(WEAPONS_STORAGE_KEY);
                if (storedWeapons) {
                    setWeapons(JSON.parse(storedWeapons));
                }
            } catch (error) {
                console.error('Error loading weapons from AsyncStorage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWeaponsFromStorage();
    }, []);

    // Save weapons to AsyncStorage whenever they change
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

    const getWeaponSkillModifiers = (weapon: Item) => {
        const itemWeapon = findWeaponInItems(weapon.name);
        if (itemWeapon && 'skill_modifiers' in itemWeapon) {
            return itemWeapon.skill_modifiers;
        }

        const weaponData = findWeaponInData(weapon.name);
        return weaponData && 'skill_modifiers' in weaponData ? weaponData.skill_modifiers : [];
    };

    const getWeaponProperties = (weapon: Item) => {
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
                getWeaponSkillModifiers: (weapon: Item): string[] => {
                    const itemWeapon = findWeaponInItems(weapon.name);
                    if (itemWeapon && 'skill_modifiers' in itemWeapon) {
                        return itemWeapon.skill_modifiers as string[];
                    }
                    const weaponData = findWeaponInData(weapon.name);
                    return weaponData && 'skill_modifiers' in weaponData ? weaponData.skill_modifiers as string[] : [];
                },
                getWeaponProperties,
            }}
        >
            {children}
        </CharacterContext.Provider>
    );
};

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Item, useItemEquipment } from './ItemEquipmentContext'; // Assuming you have an Item interface defined here.
import AsyncStorage from '@react-native-async-storage/async-storage';
import weapons from '../data/weapons.json';

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

export const CharacterContext = createContext<CharacterContextProps>({
    mainHandWeapon: null,
    offHandWeapon: null,
    rangedHandWeapon: null,
    equipWeapon: () => { },
    getWeaponDamage: () => '1',
    getWeaponSkillModifiers: () => [],
    getWeaponProperties: () => [],
});

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
    const [mainHandWeapon, setMainHandWeapon] = useState<Item | null>(null);
    const [offHandWeapon, setOffHandWeapon] = useState<Item | null>(null);
    const [rangedHandWeapon, setRangedHandWeapon] = useState<Item | null>(null);
    const { items } = useItemEquipment();
    const [isLoading, setIsLoading] = useState(true);

    // Function to save weapons to AsyncStorage
    const saveWeaponsToStorage = async () => {
        try {
            await AsyncStorage.setItem('mainHandWeapon', JSON.stringify(mainHandWeapon));
            await AsyncStorage.setItem('offHandWeapon', JSON.stringify(offHandWeapon));
            await AsyncStorage.setItem('rangedHandWeapon', JSON.stringify(rangedHandWeapon));
        } catch (error) {
            console.error('Error saving weapons to AsyncStorage:', error);
        }
    };

    // Load weapons from AsyncStorage on component mount
    useEffect(() => {
        const loadWeaponsFromStorage = async () => {
            try {
                const storedMainHand = await AsyncStorage.getItem('mainHandWeapon');
                const storedOffHand = await AsyncStorage.getItem('offHandWeapon');
                const storedRangedHand = await AsyncStorage.getItem('rangedHandWeapon');
                if (storedMainHand) setMainHandWeapon(JSON.parse(storedMainHand));
                if (storedOffHand) setOffHandWeapon(JSON.parse(storedOffHand));
                if (storedRangedHand) setRangedHandWeapon(JSON.parse(storedRangedHand));
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
            saveWeaponsToStorage();
        }
    }, [mainHandWeapon, offHandWeapon, rangedHandWeapon, isLoading]);

    const equipWeapon = (slot: WeaponSlot, weapon: Item | null) => {
        if (slot === 'mainHand') {
            setMainHandWeapon(weapon);
        } else if (slot === 'offHand') {
            setOffHandWeapon(weapon);
        } else if (slot === 'rangedHand') {
            setRangedHandWeapon(weapon);
        }
    };

    const getWeaponDamage = (weapon: Item) => {
        // First check if weapon exists in items context
        const itemWeapon = items.find(item => item.name.toLowerCase() === weapon.name.toLowerCase());
        if (itemWeapon?.damage) {
            return itemWeapon.damage;
        }
        // If not found in items, check weapons data
        const weaponData = weapons.weapons.find(w => w.items.find(i => i.name.toLowerCase() === weapon.name.toLowerCase()));
        const weaponItem = weaponData?.items.find(i => i.name.toLowerCase() === weapon.name.toLowerCase());
        return weaponItem?.damage || '1';
    };

    const getWeaponSkillModifiers = (weapon: Item) => {
        const weaponData = weapons.weapons.find(w => w.items.find(i => i.name.toLowerCase() === weapon.name.toLowerCase()));
        const weaponItem = weaponData?.items.find(i => i.name.toLowerCase() === weapon.name.toLowerCase());
        return weaponItem?.skill_modifiers || [];
    };

    const getWeaponProperties = (weapon: Item) => {
        // First check if weapon exists in items context
        const itemWeapon = items.find(item => item.name.toLowerCase() === weapon.name.toLowerCase());
        if (itemWeapon?.details) {
            return itemWeapon.details.split(',').map(detail => detail.trim());
        }

        // If not found in items, check weapons data
        const weaponData = weapons.weapons.find(w => w.items.find(i => i.name.toLowerCase() === weapon.name.toLowerCase()));
        const weaponItem = weaponData?.items.find(i => i.name.toLowerCase() === weapon.name.toLowerCase());
        return weaponItem?.properties || [];
    };

    return (
        <CharacterContext.Provider value={{
            mainHandWeapon,
            offHandWeapon,
            rangedHandWeapon,
            equipWeapon,
            getWeaponDamage,
            getWeaponSkillModifiers,
            getWeaponProperties,
        }}>
            {children}
        </CharacterContext.Provider>
    );
};

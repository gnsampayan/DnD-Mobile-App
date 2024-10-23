import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Item } from './ItemEquipmentContext'; // Assuming you have an Item interface defined here.
import AsyncStorage from '@react-native-async-storage/async-storage';
import weapons from '../data/weapons.json';

interface CharacterContextProps {
    mainHandWeapon: Item | null;
    offHandWeapon: Item | null;
    equipWeapon: (slot: 'mainHand' | 'offHand', weapon: Item | null) => void;
    getWeaponDamage: (weapon: Item) => string;
    getWeaponSkillModifiers: (weapon: Item) => string[];
}

export const CharacterContext = createContext<CharacterContextProps>({
    mainHandWeapon: null,
    offHandWeapon: null,
    equipWeapon: () => { },
    getWeaponDamage: () => '1',
    getWeaponSkillModifiers: () => [],
});

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
    const [mainHandWeapon, setMainHandWeapon] = useState<Item | null>(null);
    const [offHandWeapon, setOffHandWeapon] = useState<Item | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to save weapons to AsyncStorage
    const saveWeaponsToStorage = async () => {
        try {
            await AsyncStorage.setItem('mainHandWeapon', JSON.stringify(mainHandWeapon));
            await AsyncStorage.setItem('offHandWeapon', JSON.stringify(offHandWeapon));
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

                if (storedMainHand) setMainHandWeapon(JSON.parse(storedMainHand));
                if (storedOffHand) setOffHandWeapon(JSON.parse(storedOffHand));
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
    }, [mainHandWeapon, offHandWeapon, isLoading]);

    const equipWeapon = (slot: 'mainHand' | 'offHand', weapon: Item | null) => {
        if (slot === 'mainHand') {
            setMainHandWeapon(weapon);
        } else {
            setOffHandWeapon(weapon);
        }
    };

    const getWeaponDamage = (weapon: Item) => {
        const weaponData = weapons.weapons.find(w => w.items.find(i => i.name === weapon.name));
        const weaponItem = weaponData?.items.find(i => i.name === weapon.name);
        return weaponItem?.damage || '1';
    };

    const getWeaponSkillModifiers = (weapon: Item) => {
        const weaponData = weapons.weapons.find(w => w.items.find(i => i.name === weapon.name));
        const weaponItem = weaponData?.items.find(i => i.name === weapon.name);
        return weaponItem?.skill_modifiers || [];
    };

    return (
        <CharacterContext.Provider value={{ mainHandWeapon, offHandWeapon, equipWeapon, getWeaponDamage, getWeaponSkillModifiers }}>
            {children}
        </CharacterContext.Provider>
    );
};

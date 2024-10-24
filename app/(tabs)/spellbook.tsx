// Start of Selection

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from '@/app/styles/spellbookStyles';
import classData from '@/app/data/classData.json';
import StatsDataContext from '../context/StatsDataContext';

export default function SpellbookScreen() {
    const [preparedSpellSlots, setPreparedSpellSlots] = useState<number | null>(null);
    const { statsData, isSpellCaster } = useContext(StatsDataContext);

    const handlePreparedSpellSlots = () => {
        const characterClass = classData.find(cls => cls.value === statsData.class);
        if (characterClass && isSpellCaster) {
            const preparedSlots = classBasedValues(characterClass);
            setPreparedSpellSlots(preparedSlots);
        }
    }


    const classBasedValues = (characterClass: any) => {
        switch (characterClass.value.toLowerCase()) {
            case 'artificer':
                return getIntelligenceModifier() + Math.floor(statsData.level / 2);
            case 'barbarian':
                return null;
            case 'bard':
                const bardClass = classData.find(cls => cls.value.toLowerCase() === 'bard');
                const bardClassSpellsKnown = bardClass?.spellsKnown && typeof bardClass.spellsKnown === 'object' ?
                    Object.entries(bardClass.spellsKnown).reduce((acc, [level, spells]) =>
                        Number(level) <= statsData.level ? spells : acc
                        , 0) : 0;
                console.log("bardClassSpellsKnown", bardClassSpellsKnown); // Delete Later
                return bardClassSpellsKnown ? bardClassSpellsKnown : null;
            case 'cleric':
            case 'druid':
            case 'fighter':
            case 'monk':
            case 'paladin':
            case 'ranger':
            case 'rogue':
            case 'sorcerer':
            case 'warlock':
            case 'wizard':
                return 1;
            default:
                return 0;
        }
    }

    const getIntelligenceModifier = () => {
        const intelligenceAbility = statsData.abilities.find(ability => ability.name.toLowerCase() === 'intelligence');
        return intelligenceAbility ? Math.floor((intelligenceAbility.value - 10) / 2) : 0;
    }

    useEffect(() => {
        handlePreparedSpellSlots();
    }, [isSpellCaster, statsData.level, statsData.abilities]);

    const renderPreparedSpellBlock = () => (
        <TouchableOpacity style={styles.addSpellButton}>
            <Text style={{ color: 'white' }}>Add Spell</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Spellbook</Text>
            <FlatList
                data={Array.from({ length: preparedSpellSlots || 0 }, (_, i) => i)}
                renderItem={renderPreparedSpellBlock}
                keyExtractor={(item) => item.toString()}
                contentContainerStyle={{ flexDirection: 'column' }}
            />
        </View>
    );
}

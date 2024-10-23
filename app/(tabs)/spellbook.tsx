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
        if (characterClass.value.toLowerCase() === 'artificer') {
            return 3;
        } else {
            return 0;
        }
    }

    useEffect(() => {
        handlePreparedSpellSlots();
    }, [isSpellCaster, statsData.level]);

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

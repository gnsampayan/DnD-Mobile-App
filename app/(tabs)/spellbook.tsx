// Start of Selection

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, ImageBackground } from 'react-native';
import styles from '@/app/styles/spellbookStyles';
import classData from '@/app/data/classData.json';
import StatsDataContext from '../context/StatsDataContext';

// TODO: Add learned spells from other wizards and scrolls
const learnedSpellsFromOtherWizards = 0;
const learnedSpellsFromScrolls = 0;

export default function SpellbookScreen() {
    const [preparedSpellSlots, setPreparedSpellSlots] = useState<number | null>(null);
    const [cantripSlots, setCantripSlots] = useState<number | null>(null);
    const [allKnownSpellsSlots, setAllKnownSpellsSlots] = useState<number | null>(null);
    const { statsData, isSpellCaster } = useContext(StatsDataContext);

    const characterClass = classData.find(cls => cls.value.toLowerCase() === statsData?.class?.toLowerCase());

    useEffect(() => {
        getPreparedSpellSlotsAmount();
        getCantripSlotsAmount();
        getAllKnownSpellsSlotsAmount();
    }, [isSpellCaster, statsData.level, statsData.abilities, statsData.class, statsData.race]);

    const getPreparedSpellSlotsAmount = () => {
        if (characterClass && isSpellCaster) {
            const preparedSlots = classFilterPreparedSpellBlocks();
            setPreparedSpellSlots(preparedSlots);
        }
    }

    const classFilterPreparedSpellBlocks = () => {
        const preparedSpellConfig: { [key: string]: { ability: string; levelModifier: (level: number) => number } } = {
            artificer: {
                ability: 'intelligence',
                levelModifier: (level) => Math.floor(level / 2),
            },
            cleric: {
                ability: 'wisdom',
                levelModifier: (level) => level,
            },
            druid: {
                ability: 'wisdom',
                levelModifier: (level) => level,
            },
            paladin: {
                ability: 'charisma',
                levelModifier: (level) => level,
            },
            wizard: {
                ability: 'intelligence',
                levelModifier: (level) => level,
            },
        };
        if (!characterClass) return null;
        const config = preparedSpellConfig[characterClass.value.toLowerCase()];
        if (!config) {
            // Not a spellcaster or spells are castable without preparation
            return null;
        }
        const preparedSlots = getAbilityModifier(config.ability) + config.levelModifier(statsData.level);
        return preparedSlots || 0;
    }


    const getAbilityModifier = (abilityName: string) => {
        const abilityValue = statsData.abilities.find(ability => ability.name.toLowerCase() === abilityName.toLowerCase());
        return abilityValue ? Math.floor((abilityValue.value - 10) / 2) : 0;
    }

    const numColumns = 6;
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = (windowWidth - (30 + (numColumns - 1) * 10)) / numColumns;

    const renderSpellBlock = () => (
        <TouchableOpacity style={[styles.addSpellButton, { width: itemWidth }]}>
            <ImageBackground
                style={styles.spellButtonBackground}
                source={{ uri: 'https://via.placeholder.com/150?text=&bg=EEEEEE' }}
                resizeMode="cover"
            >
                <View style={styles.spellBlock}>
                    <Text style={{ color: 'white' }}>Add Spell</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity >
    );

    const renderPreparedSpellBlocksForClass = () => {
        if (preparedSpellSlots === 0 && preparedSpellSlots !== null) {
            return (
                <View style={styles.section}>
                    <Text style={styles.label}>Prepared Spells</Text>
                    <Text style={styles.text}>You can't use any spells yet.</Text>
                </View>
            );
        } else if (preparedSpellSlots === null) {
            return null;
        } else {
            return (
                <View style={styles.section}>
                    <Text style={styles.label}>Prepared Spells</Text>
                    <FlatList
                        data={Array.from({ length: preparedSpellSlots || 0 }, (_, i) => i)}
                        renderItem={renderSpellBlock}
                        keyExtractor={(item) => item.toString()}
                        numColumns={numColumns}
                        key={numColumns}
                    />
                </View>
            )
        }
    }

    const getClassCantripsKnown = () => {
        const cantripsKnown = characterClass?.cantripsKnown && typeof characterClass.cantripsKnown === 'object' ?
            Object.entries(characterClass.cantripsKnown).reduce((acc, [level, cantrips]) =>
                Number(level) <= statsData.level ? cantrips : acc
                , 0) : 0;
        const cantripsAmount = cantripsKnown ? cantripsKnown : 0;
        return cantripsAmount;
    }
    const getCantripSlotsAmount = () => {
        if (characterClass && isSpellCaster) {
            const cantrips = getClassCantripsKnown();
            setCantripSlots(cantrips);
        }
    }




    const renderCantripBlock = () => (
        <TouchableOpacity style={[styles.addCantripButton, { width: itemWidth }]}>
            <ImageBackground
                style={styles.cantripButtonBackground}
                source={{ uri: 'https://via.placeholder.com/150?text=&bg=EEEEEE' }}
                resizeMode="cover"
            >
                <View style={styles.cantripBlock}>
                    <Text style={{ color: 'white' }}>Add Cantrip</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity >
    )

    const renderCantripBlocks = () => {
        if (cantripSlots === null || cantripSlots === 0) {
            return null;
        } else {
            return (
                <View style={styles.section}>
                    <Text style={styles.label}>Cantrips</Text>
                    <FlatList
                        data={Array.from({ length: cantripSlots || 0 }, (_, i) => i)}
                        renderItem={renderCantripBlock}
                        keyExtractor={(item) => item.toString()}
                        numColumns={numColumns}
                        key={numColumns}
                    />
                </View>
            )
        }
    }

    const getAllKnownSpellsSlotsAmount = () => {
        if (characterClass && isSpellCaster) {
            const allKnownSpells = classFilterAllKnownSpellsBlocks(characterClass?.value || null);
            setAllKnownSpellsSlots(allKnownSpells);
        }
    }

    const getClassPreparedSpellSlots = () => {
        const classSpellsKnown = characterClass?.spellsKnown && typeof characterClass.spellsKnown === 'object' ?
            Object.entries(characterClass.spellsKnown).reduce((acc, [level, spells]) =>
                Number(level) <= statsData.level ? spells : acc
                , 0) : 0;
        const classSpellsKnownAmount = classSpellsKnown ? classSpellsKnown : 0;
        return classSpellsKnownAmount;
    }

    const classFilterAllKnownSpellsBlocks = (characterClass: string | null) => {
        if (!characterClass) return 0;

        const lowerClass = characterClass.toLowerCase();

        const preparedSpellClasses = new Set(['bard', 'ranger', 'sorcerer', 'warlock']);
        const knownButNotPreparedClasses = new Set(['artificer', 'cleric', 'druid', 'paladin']);

        if (preparedSpellClasses.has(lowerClass)) {
            return getClassPreparedSpellSlots();
        }

        if (lowerClass === 'wizard') {
            return statsData.level + learnedSpellsFromOtherWizards + learnedSpellsFromScrolls;
        }

        if (knownButNotPreparedClasses.has(lowerClass)) {
            // All {Class} spells are known, but not prepared
            return null;
        }

        // Not a spellcaster
        return null;
    }

    const renderAllKnownSpells = () => {
        if (allKnownSpellsSlots !== null && preparedSpellSlots === null) {
            return null;
        } else {
            if (allKnownSpellsSlots === 0 && allKnownSpellsSlots !== null) {
                return (
                    <View style={styles.section}>
                        <Text style={styles.label}>Known Spells</Text>
                        <Text style={styles.text}>You can't learn any spells yet.</Text>
                    </View>
                )
            } else if (allKnownSpellsSlots === null) {
                return null;
            } else {
                return (
                    <View style={styles.section}>
                        <Text style={styles.label}>Known Spells</Text>
                        <FlatList
                            data={Array.from({ length: allKnownSpellsSlots || 0 }, (_, i) => i)}
                            renderItem={renderSpellBlock}
                            keyExtractor={(item) => item.toString()}
                            numColumns={numColumns}
                            key={numColumns}
                        />
                    </View>
                )
            }
        }
    }

    const renderCastableSpells = () => {
        if (allKnownSpellsSlots !== null && preparedSpellSlots === null) {
            if (allKnownSpellsSlots === 0 && allKnownSpellsSlots !== null) {
                return (
                    <View style={styles.section}>
                        <Text style={styles.label}>Spells</Text>
                        <Text style={styles.text}>You can't cast any spells yet.</Text>
                    </View>
                )
            } else if (allKnownSpellsSlots === null) {
                return null;
            } else {
                return (
                    <View style={styles.section}>
                        <Text style={styles.label}>Spells</Text>
                        <FlatList
                            data={Array.from({ length: allKnownSpellsSlots || 0 }, (_, i) => i)}
                            renderItem={renderSpellBlock}
                            keyExtractor={(item) => item.toString()}
                            numColumns={numColumns}
                            key={numColumns}
                        />
                    </View>
                )
            }
        } else {
            return null;
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{statsData.class} Spellbook</Text>
            {renderPreparedSpellBlocksForClass()}
            {renderCantripBlocks()}
            {renderAllKnownSpells()}
            {renderCastableSpells()}
        </View>
    );
}

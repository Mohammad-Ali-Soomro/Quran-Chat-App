import React, { useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { THEME } from '../constants/theme';

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

function SuggestionChip({ text, onPress }: { text: string; onPress: () => void }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={styles.chip}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Text style={styles.chipText}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {suggestions.map((suggestion, index) => (
        <SuggestionChip
          key={index}
          text={suggestion}
          onPress={() => onSelect(suggestion)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555555',
  },
});

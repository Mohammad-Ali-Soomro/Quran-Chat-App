import React, { useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { THEME } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TopicCardProps {
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

export default function TopicCard({ title, subtitle, color, onPress }: TopicCardProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
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
        style={[styles.card, { backgroundColor: color }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    padding: 16,
    width: (SCREEN_WIDTH - 32 - 12) / 2, // 16px horizontal padding on screen sides, 12px gap between items
    height: 100,
    justifyContent: 'flex-start',
    shadowColor: THEME.borders.color,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: THEME.typography.fontWeightBlack,
    color: THEME.colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: THEME.typography.fontWeightRegular,
    color: '#333333',
    lineHeight: 15,
  },
});

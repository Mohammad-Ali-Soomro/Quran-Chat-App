import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';

interface HeaderProps {
  title: string;
  onClear?: () => void;
  onSettings?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export default function Header({ title, onClear, onSettings, showBack, onBack }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <View style={styles.leftGroup}>
          {showBack && onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
              <Text style={styles.backArrow}>{'\u2190'}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.rightGroup}>
          {onClear && (
            <TouchableOpacity onPress={onClear} style={styles.clearButton} activeOpacity={0.7}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
          {onSettings && (
            <TouchableOpacity onPress={onSettings} activeOpacity={0.7}>
              <Text style={styles.gearText}>{'\u2699'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.headerBackground,
    borderBottomWidth: 3,
    borderBottomColor: THEME.colors.accentYellow,
  },
  inner: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.colors.headerText,
  },
  title: {
    fontSize: THEME.typography.fontSizeTitle,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.headerText,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: THEME.colors.headerText,
    backgroundColor: 'transparent',
  },
  clearText: {
    fontSize: THEME.typography.fontSizeSmall,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.headerText,
  },
  gearText: {
    fontSize: 20,
    color: THEME.colors.headerText,
  },
});

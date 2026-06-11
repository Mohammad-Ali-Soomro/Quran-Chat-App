import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  onClear: () => void;
  onSettings: () => void;
}

export default function Header({ title, onClear, onSettings }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightGroup}>
          <TouchableOpacity onPress={onClear} activeOpacity={0.6}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettings} activeOpacity={0.6}>
            <Text style={styles.gearText}>{'\u2699'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0D0D',
  },
  inner: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FAFAF0',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FAFAF0',
    opacity: 0.7,
  },
  gearText: {
    fontSize: 18,
    color: '#FAFAF0',
  },
});

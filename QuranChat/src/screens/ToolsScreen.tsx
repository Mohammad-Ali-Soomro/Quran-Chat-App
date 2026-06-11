import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../constants/theme';
import Header from '../components/Header';
import { ChatMode } from '../services/groqApi';

type ToolsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: ToolsScreenNavigationProp;
}

interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  mode: ChatMode;
}

const TOOLS: ToolItem[] = [
  {
    id: 'dua',
    title: 'Dua Generator',
    subtitle: 'Get personalized prayers from the Quran & Hadith',
    icon: '🤲',
    color: '#EAF7E2',
    mode: 'dua',
  },
  {
    id: 'surah',
    title: 'Surah Explorer',
    subtitle: 'Deep dive into themes, context, and key verses',
    icon: '🕌',
    color: '#DDF4FF',
    mode: 'surah',
  },
  {
    id: 'history',
    title: 'Islamic History',
    subtitle: 'Read stories of Prophets and Quranic events',
    icon: '📜',
    color: '#FFF2E0',
    mode: 'history',
  },
  {
    id: 'reflection',
    title: 'Daily Reflection',
    subtitle: 'Receive a daily spiritual lesson and practical task',
    icon: '✨',
    color: '#FFE8E8',
    mode: 'reflection',
  },
];

export default function ToolsScreen({ navigation }: Props) {
  const handlePress = (item: ToolItem) => {
    navigation.navigate('Chat', {
      mode: item.mode,
      title: item.title,
    });
  };

  const renderItem = ({ item }: { item: ToolItem }) => (
    <TouchableOpacity
      style={styles.rowItem}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
      </View>
      <Text style={styles.chevron}>{'\u203A'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Study Topics" />
      <FlatList
        data={TOOLS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.primary,
    marginBottom: 4,
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  chevron: {
    fontSize: 24,
    color: '#C7C7CC',
    marginLeft: 8,
    fontWeight: '300',
  },
  separator: {
    height: 1,
    backgroundColor: THEME.colors.cardBorder,
  },
});

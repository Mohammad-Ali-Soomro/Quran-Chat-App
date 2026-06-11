import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../constants/theme';
import HomeScreen from './HomeScreen';
import ChatbotTabScreen from './ChatbotTabScreen';
import ToolsScreen from './ToolsScreen';

type MainTabsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: MainTabsScreenNavigationProp;
}

export default function MainTabsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'study' | 'chat' | 'tools'>('study');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'study' && <HomeScreen navigation={navigation} />}
        {activeTab === 'chat' && <ChatbotTabScreen />}
        {activeTab === 'tools' && <ToolsScreen navigation={navigation} />}
      </View>

      {/* Sleek Custom Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('study')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabIcon,
              activeTab === 'study' ? styles.tabIconActive : styles.tabIconInactive,
            ]}
          >
            📖
          </Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'study' ? styles.tabLabelActive : styles.tabLabelInactive,
            ]}
          >
            Study
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('chat')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabIcon,
              activeTab === 'chat' ? styles.tabIconActive : styles.tabIconInactive,
            ]}
          >
            💬
          </Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'chat' ? styles.tabLabelActive : styles.tabLabelInactive,
            ]}
          >
            Chatbot
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('tools')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabIcon,
              activeTab === 'tools' ? styles.tabIconActive : styles.tabIconInactive,
            ]}
          >
            🛠️
          </Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'tools' ? styles.tabLabelActive : styles.tabLabelInactive,
            ]}
          >
            Topics
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.cardBorder,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabIconInactive: {
    opacity: 0.5,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: THEME.colors.accentBlue,
  },
  tabLabelInactive: {
    color: '#8E8E93',
  },
});

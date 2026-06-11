import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../constants/theme';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

export default function WelcomeScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleStart = async () => {
    try {
      await AsyncStorage.setItem('has_onboarded', 'true');
      navigation.replace('Tabs');
    } catch {
      navigation.replace('Tabs');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Bismillah */}
          <Text style={styles.bismillah}>{'\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646ِ \u0627\u0644\u0631\u0651ِ\u062dِيمِ'}</Text>
          
          {/* App Title */}
          <Text style={styles.title}>Quran Chat</Text>

          {/* Tagline */}
          <Text style={styles.tagline}>Your AI companion for exploring the Holy Quran</Text>

          {/* Decorative bar */}
          <View style={styles.divider} />

          {/* Feature List (Cardless) */}
          <View style={styles.featuresList}>
            {/* Feature 1 */}
            <View style={styles.featureItem}>
              <View style={[styles.iconBadge, { backgroundColor: THEME.colors.accentLight }]}>
                <Text style={styles.iconEmoji}>💬</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Ask about any Surah or Ayah</Text>
                <Text style={styles.featureSubtitle}>Get authentic scholarly answers with verse references</Text>
              </View>
            </View>

            {/* Feature 2 */}
            <View style={styles.featureItem}>
              <View style={[styles.iconBadge, { backgroundColor: '#FFF2E0' }]}>
                <Text style={styles.iconEmoji}>🤲</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Generate personalized Duas</Text>
                <Text style={styles.featureSubtitle}>Describe your situation and receive relevant prayers</Text>
              </View>
            </View>

            {/* Feature 3 */}
            <View style={styles.featureItem}>
              <View style={[styles.iconBadge, { backgroundColor: '#E0F2FE' }]}>
                <Text style={styles.iconEmoji}>📜</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Explore themes and stories</Text>
                <Text style={styles.featureSubtitle}>Dive into Islamic history, morals, and teachings</Text>
              </View>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleStart}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Start Exploring</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  content: {
    alignItems: 'stretch',
  },
  bismillah: {
    fontSize: 22,
    color: THEME.colors.accent,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Traditional Arabic' : 'sans-serif',
  },
  title: {
    fontSize: 32,
    fontWeight: THEME.typography.fontWeightBlack,
    color: THEME.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    fontWeight: THEME.typography.fontWeightRegular,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: THEME.colors.accent,
    alignSelf: 'center',
    marginBottom: 32,
    borderRadius: 2,
  },
  featuresList: {
    gap: 24,
    marginBottom: 44,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 20,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.primary,
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 12,
    fontWeight: THEME.typography.fontWeightRegular,
    color: '#666666',
    lineHeight: 16,
  },
  button: {
    backgroundColor: THEME.colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: THEME.typography.fontWeightBold,
    color: '#FFFFFF',
  },
});

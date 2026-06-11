import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../constants/theme';
import { getAyahOfTheDay, AyahData } from '../constants/ayahData';
import { saveBookmark, removeBookmark, isBookmarked } from '../services/bookmarkStorage';
import { loadMessages } from '../services/chatStorage';
import AyahCard from '../components/AyahCard';
import TopicCard from '../components/TopicCard';
import SuggestionChips from '../components/SuggestionChips';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [ayah] = useState<AyahData>(getAyahOfTheDay());
  const [bookmarked, setBookmarked] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkStatus = async () => {
        const bookmarkedStatus = await isBookmarked(ayah.id);
        setBookmarked(bookmarkedStatus);

        const saved = await loadMessages();
        setHasHistory(saved.length > 1);
      };
      checkStatus();
    }, [ayah.id])
  );

  const handleBookmark = async () => {
    if (bookmarked) {
      await removeBookmark(ayah.id);
      setBookmarked(false);
    } else {
      await saveBookmark(ayah);
      setBookmarked(true);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Ayah of the Day:\n"${ayah.translation}"\n- Surah ${ayah.surah} (${ayah.surahNumber}:${ayah.ayahNumber})`,
      });
    } catch {
      // Ignore
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    const isDua = prompt.toLowerCase().includes('dua');
    navigation.navigate('Chat', {
      mode: isDua ? 'dua' : 'quran',
      initialPrompt: prompt,
      title: isDua ? 'Dua Generator' : 'Quran Q&A',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Quran Chat</Text>
          <TouchableOpacity style={styles.gearButton} activeOpacity={0.7}>
            <Text style={styles.gearText}>{'\u2699'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>As-salamu alaykum</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Ayah of the Day */}
        <View style={styles.section}>
          <AyahCard
            ayah={ayah}
            onBookmark={handleBookmark}
            onShare={handleShare}
            isBookmarked={bookmarked}
          />
        </View>

        {/* Section 2: Explore Topics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Topics</Text>
          <View style={styles.grid}>
            <TopicCard
              title="Quran Q&A"
              subtitle="Ask anything about the Quran"
              color="#E8F5E9"
              onPress={() => navigation.navigate('Chat', { mode: 'quran', title: 'Quran Q&A' })}
            />
            <TopicCard
              title="Dua for Me"
              subtitle="Get personalized prayers"
              color="#FFF9C4"
              onPress={() => navigation.navigate('Chat', { mode: 'dua', title: 'Dua Generator' })}
            />
            <TopicCard
              title="Explain a Surah"
              subtitle="Deep dive into any Surah"
              color="#E3F2FD"
              onPress={() => navigation.navigate('Chat', { mode: 'surah', title: 'Surah Explorer' })}
            />
            <TopicCard
              title="Islamic History"
              subtitle="Stories of Prophets and events"
              color="#FFE0E0"
              onPress={() => navigation.navigate('Chat', { mode: 'history', title: 'Islamic History' })}
            />
          </View>
        </View>

        {/* Section 3: Read & Study Quran */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Read & Study</Text>
          <TouchableOpacity
            style={styles.studyCard}
            onPress={() => navigation.navigate('SurahList')}
            activeOpacity={0.85}
          >
            <View style={styles.studyCardLeft}>
              <Text style={styles.studyCardTitle}>Quran Reader & Tafsir</Text>
              <Text style={styles.studyCardSubtitle}>
                Browse all 114 Surahs, read translations, and view detailed exegesis
              </Text>
            </View>
            <View style={styles.studyCardButton}>
              <Text style={styles.studyCardArrow}>{'\u2192'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 4: Quick Questions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Questions</Text>
          <SuggestionChips
            suggestions={[
              'What is Surah Al-Fatiha about?',
              'Explain Ayat al-Kursi',
              'What does the Quran say about patience?',
              'Tell me about Prophet Yusuf',
              'Dua for anxiety and stress',
              'What are the five pillars of Islam?',
            ]}
            onSelect={handleSelectPrompt}
          />
        </View>

        {/* Section 5: Continue Chatting */}
        {hasHistory && (
          <TouchableOpacity
            style={styles.continueCard}
            onPress={() => navigation.navigate('Chat', {})}
            activeOpacity={0.85}
          >
            <Text style={styles.continueText}>Continue your last conversation</Text>
            <Text style={styles.continueArrow}>{'\u2192'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: THEME.typography.fontWeightBlack,
    color: THEME.colors.primary,
  },
  gearButton: {
    padding: 4,
  },
  gearText: {
    fontSize: 22,
    color: THEME.colors.primary,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: THEME.typography.fontWeightRegular,
    color: '#888888',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: THEME.typography.fontWeightBlack,
    color: THEME.colors.primary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  studyCard: {
    backgroundColor: THEME.colors.accentYellow,
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    padding: 20,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: THEME.borders.color,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  studyCardLeft: {
    flex: 1,
    paddingRight: 12,
  },
  studyCardTitle: {
    fontSize: 16,
    fontWeight: THEME.typography.fontWeightBlack,
    color: THEME.colors.primary,
    marginBottom: 6,
  },
  studyCardSubtitle: {
    fontSize: 12,
    fontWeight: THEME.typography.fontWeightRegular,
    color: '#333333',
    lineHeight: 16,
  },
  studyCardButton: {
    width: 36,
    height: 36,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studyCardArrow: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  continueCard: {
    backgroundColor: THEME.colors.surface,
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: THEME.borders.color,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  continueText: {
    fontSize: 14,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.primary,
  },
  continueArrow: {
    fontSize: 18,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.primary,
  },
});

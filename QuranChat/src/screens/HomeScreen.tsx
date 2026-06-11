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

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [ayah] = useState<AyahData>(getAyahOfTheDay());
  const [bookmarked, setBookmarked] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkStatus = async () => {
        const bookmarkedStatus = await isBookmarked(ayah.id);
        setBookmarked(bookmarkedStatus);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Sleek Minimalist Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Quran Study</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 3 Days</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>As-salamu alaykum. Welcome back.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quote Block for Ayah of the Day (Editorial Blockquote style - Cardless) */}
        <View style={styles.quoteBlock}>
          <Text style={styles.quoteLabel}>Ayah of the Day</Text>
          <Text style={styles.arabicText}>{ayah.arabic}</Text>
          <Text style={styles.translationText}>"{ayah.translation}"</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.referenceText}>
              Surah {ayah.surah} ({ayah.surahNumber}:{ayah.ayahNumber})
            </Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{ayah.theme}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleBookmark}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionButtonText, bookmarked && styles.actionButtonTextActive]}>
                {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare} activeOpacity={0.7}>
              <Text style={styles.actionButtonText}>🔗 Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Major Study Quran Action Row (List-based - Cardless) */}
        <View style={styles.studySection}>
          <TouchableOpacity
            style={styles.studyButton}
            onPress={() => navigation.navigate('SurahList')}
            activeOpacity={0.7}
          >
            <View style={styles.studyIconContainer}>
              <Text style={styles.studyIcon}>📖</Text>
            </View>
            <View style={styles.studyButtonContent}>
              <Text style={styles.studyTitle}>Read the Holy Quran</Text>
              <Text style={styles.studySubtitle}>
                Explore chapters, translations, and classical commentary inline
              </Text>
            </View>
            <Text style={styles.studyArrow}>{'\u203A'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.primary,
  },
  streakBadge: {
    backgroundColor: '#FFF2E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9600',
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  quoteBlock: {
    marginHorizontal: 24,
    marginTop: 28,
    marginBottom: 24,
    paddingLeft: 20,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.accent,
    alignItems: 'stretch',
  },
  quoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#888888',
    marginBottom: 14,
  },
  arabicText: {
    fontSize: 22,
    lineHeight: 38,
    color: THEME.colors.primary,
    textAlign: 'right',
    marginBottom: 14,
  },
  translationText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333333',
    textAlign: 'left',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  referenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.accentBlue,
  },
  tagContainer: {
    backgroundColor: THEME.colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accent,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 4,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.accentBlue,
  },
  actionButtonTextActive: {
    color: THEME.colors.accent,
  },
  studySection: {
    marginHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F3F5',
    paddingTop: 24,
  },
  studyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  studyIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  studyIcon: {
    fontSize: 20,
  },
  studyButtonContent: {
    flex: 1,
    paddingRight: 12,
  },
  studyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.primary,
    marginBottom: 4,
  },
  studySubtitle: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  studyArrow: {
    fontSize: 24,
    color: '#C7C7CC',
    fontWeight: '300',
  },
});

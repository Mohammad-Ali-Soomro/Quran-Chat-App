import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../constants/theme';
import Header from '../components/Header';

type SurahReaderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SurahReader'>;
type SurahReaderScreenRouteProp = RouteProp<RootStackParamList, 'SurahReader'>;

interface Props {
  navigation: SurahReaderScreenNavigationProp;
  route: SurahReaderScreenRouteProp;
}

interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translations: Array<{
    id: number;
    resource_id: number;
    text: string;
  }>;
}

const cleanHtmlText = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .trim();
};

export default function SurahReaderScreen({ navigation, route }: Props) {
  console.log('SurahReaderScreen route parameters:', route.params);
  
  const params = route.params || {};
  const chapterId = params.chapterId;
  const chapterName = params.chapterName || 'Surah';

  const [verses, setVerses] = useState<Verse[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tafsir state maps
  const [expandedTafsirs, setExpandedTafsirs] = useState<Record<number, boolean>>({});
  const [tafsirContents, setTafsirContents] = useState<Record<number, string>>({});
  const [tafsirLoading, setTafsirLoading] = useState<Record<number, boolean>>({});

  const fetchVerses = useCallback(async (pageNum: number, isRefresh: boolean = false) => {
    if (!chapterId) {
      setError('Invalid Surah: No ID was received.');
      setIsLoading(false);
      return;
    }

    if (isRefresh) {
      setIsLoading(true);
    } else if (pageNum > 1) {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const url = `https://api.quran.com/api/v4/verses/by_chapter/${chapterId}?language=en&translations=85&fields=text_uthmani&per_page=20&page=${pageNum}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to retrieve verses. Please check your internet connection.');
      }
      const data = await response.json();
      
      const newVerses = data.verses;
      setVerses((prev) => (isRefresh ? newVerses : [...prev, ...newVerses]));
      setHasMore(data.pagination.next_page !== null);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchVerses(1, true);
  }, [fetchVerses]);

  const loadMoreVerses = () => {
    if (hasMore && !isLoading && !isLoadingMore) {
      fetchVerses(page + 1);
    }
  };

  const handleToggleTafsir = async (verseNumber: number) => {
    const isExpanded = !!expandedTafsirs[verseNumber];
    
    // Toggle exegesis view
    setExpandedTafsirs((prev) => ({
      ...prev,
      [verseNumber]: !isExpanded,
    }));

    // If expanding and tafsir isn't loaded yet, fetch it
    if (!isExpanded && !tafsirContents[verseNumber]) {
      setTafsirLoading((prev) => ({ ...prev, [verseNumber]: true }));
      try {
        const url = `https://api.qurancdn.com/api/v4/tafsirs/en-tafisr-ibn-kathir/by_ayah/${chapterId}:${verseNumber}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Could not fetch Tafsir commentary.');
        }
        const data = await response.json();
        const cleaned = cleanHtmlText(data.tafsir.text);
        
        setTafsirContents((prev) => ({
          ...prev,
          [verseNumber]: cleaned,
        }));
      } catch {
        setTafsirContents((prev) => ({
          ...prev,
          [verseNumber]: 'Unable to load Tafsir. Please check your network and try again.',
        }));
      } finally {
        setTafsirLoading((prev) => ({ ...prev, [verseNumber]: false }));
      }
    }
  };

  const renderVerseItem = ({ item }: { item: Verse }) => {
    const verseNum = item.verse_number;
    const isExpanded = !!expandedTafsirs[verseNum];
    const isTafsirLoading = !!tafsirLoading[verseNum];
    const tafsirText = tafsirContents[verseNum];

    return (
      <View style={styles.verseCard}>
        {/* Header containing verse key badge */}
        <View style={styles.verseHeader}>
          <View style={styles.keyBadge}>
            <Text style={styles.keyBadgeText}>{item.verse_key}</Text>
          </View>
        </View>

        {/* Uthmani Arabic Text */}
        <Text style={styles.arabicText}>{item.text_uthmani}</Text>

        {/* English Translation */}
        <Text style={styles.translationText}>
          {item.translations?.[0]?.text || 'Translation missing.'}
        </Text>

        {/* Tafsir Action Button */}
        <TouchableOpacity
          style={[
            styles.tafsirButton,
            isExpanded && styles.tafsirButtonActive,
          ]}
          onPress={() => handleToggleTafsir(verseNum)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tafsirButtonText,
              isExpanded && styles.tafsirButtonTextActive,
            ]}
          >
            {isExpanded ? 'Hide Tafsir' : 'Tafsir Ibn Kathir'}
          </Text>
        </TouchableOpacity>

        {/* Expanded Tafsir Box */}
        {isExpanded && (
          <View style={styles.tafsirBox}>
            <Text style={styles.tafsirHeader}>Tafsir Ibn Kathir (English)</Text>
            {isTafsirLoading ? (
              <ActivityIndicator
                size="small"
                color={THEME.colors.accent}
                style={styles.tafsirLoader}
              />
            ) : (
              <Text style={styles.tafsirContentText}>{tafsirText}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={THEME.colors.accent} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={chapterName}
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      {isLoading && verses.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={THEME.colors.accent} />
          <Text style={styles.loadingText}>Fetching verses...</Text>
        </View>
      ) : error && verses.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchVerses(1, true)}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={verses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVerseItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreVerses}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  verseCard: {
    backgroundColor: THEME.colors.surface,
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    padding: 20,
    marginBottom: 20,
    shadowColor: THEME.borders.color,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  keyBadge: {
    backgroundColor: THEME.colors.accentLight,
    borderWidth: 1.5,
    borderColor: THEME.borders.color,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  keyBadgeText: {
    fontSize: 10,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.accent,
  },
  arabicText: {
    fontSize: 24,
    color: THEME.colors.primary,
    lineHeight: 44,
    textAlign: 'right',
    marginBottom: 16,
  },
  translationText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 22,
    textAlign: 'left',
    marginBottom: 16,
  },
  tafsirButton: {
    borderWidth: 1.5,
    borderColor: THEME.borders.color,
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  tafsirButtonActive: {
    backgroundColor: THEME.colors.accent,
    borderColor: THEME.borders.color,
  },
  tafsirButtonText: {
    fontSize: 12,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.primary,
  },
  tafsirButtonTextActive: {
    color: '#FFFFFF',
  },
  tafsirBox: {
    marginTop: 14,
    padding: 14,
    backgroundColor: '#E3F2FD', // soft blue tint for Tafsir context
    borderWidth: 1.5,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    shadowColor: THEME.borders.color,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  tafsirHeader: {
    fontSize: 12,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.accentBlue,
    marginBottom: 8,
  },
  tafsirLoader: {
    paddingVertical: 12,
  },
  tafsirContentText: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: THEME.colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: THEME.borders.color,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: THEME.typography.fontWeightBold,
  },
});

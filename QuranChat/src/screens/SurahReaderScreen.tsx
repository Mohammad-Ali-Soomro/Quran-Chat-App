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
      <View style={styles.verseRow}>
        {/* Header containing verse key */}
        <View style={styles.verseHeader}>
          <Text style={styles.keyText}>{item.verse_key}</Text>
        </View>

        {/* Uthmani Arabic Text */}
        <Text style={styles.arabicText}>{item.text_uthmani}</Text>

        {/* English Translation */}
        <Text style={styles.translationText}>
          {item.translations?.[0]?.text || 'Translation missing.'}
        </Text>

        {/* Tafsir Action Button */}
        <TouchableOpacity
          style={styles.tafsirButton}
          onPress={() => handleToggleTafsir(verseNum)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tafsirButtonText, isExpanded && styles.tafsirButtonTextActive]}>
            {isExpanded ? 'Hide Commentary' : 'Tafsir Ibn Kathir'}
          </Text>
        </TouchableOpacity>

        {/* Expanded Tafsir Box */}
        {isExpanded && (
          <View style={styles.tafsirBox}>
            <Text style={styles.tafsirHeader}>Tafsir Ibn Kathir (English)</Text>
            {isTafsirLoading ? (
              <ActivityIndicator
                size="small"
                color={THEME.colors.accentBlue}
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
        <ActivityIndicator size="small" color={THEME.colors.accentBlue} />
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
          <ActivityIndicator size="large" color={THEME.colors.accentBlue} />
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
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 40,
  },
  verseRow: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    backgroundColor: THEME.colors.cardBorder,
  },
  verseHeader: {
    marginBottom: 10,
  },
  keyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
  },
  arabicText: {
    fontSize: 22,
    color: THEME.colors.primary,
    lineHeight: 40,
    textAlign: 'right',
    marginBottom: 12,
  },
  translationText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 22,
    textAlign: 'left',
    marginBottom: 12,
  },
  tafsirButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  tafsirButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.accentBlue,
  },
  tafsirButtonTextActive: {
    color: '#8E8E93',
  },
  tafsirBox: {
    marginTop: 12,
    paddingLeft: 16,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.accentBlue,
  },
  tafsirHeader: {
    fontSize: 12,
    fontWeight: '700',
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
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

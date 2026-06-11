import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../constants/theme';
import Header from '../components/Header';

type SurahListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SurahList'>;

interface Props {
  navigation: SurahListScreenNavigationProp;
}

interface Chapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  revelation_place: string;
  verses_count: number;
  translated_name: {
    name: string;
  };
}

export default function SurahListScreen({ navigation }: Props) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChapters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.quran.com/api/v4/chapters?language=en');
      if (!response.ok) {
        throw new Error('Failed to load Surahs. Please check your internet connection.');
      }
      const data = await response.json();
      setChapters(data.chapters);
      setFilteredChapters(data.chapters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text) {
      setFilteredChapters(chapters);
      return;
    }

    const query = text.toLowerCase();
    const filtered = chapters.filter((chapter) => {
      return (
        chapter.name_simple.toLowerCase().includes(query) ||
        chapter.translated_name.name.toLowerCase().includes(query) ||
        chapter.name_arabic.includes(query) ||
        chapter.id.toString() === query
      );
    });
    setFilteredChapters(filtered);
  };

  const renderSurahItem = ({ item }: { item: Chapter }) => {
    const isMeccan = item.revelation_place === 'makkah';
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('SurahReader', { chapterId: item.id, chapterName: item.name_simple })}
        activeOpacity={0.85}
      >
        <View style={styles.cardLeft}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{item.id}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.englishName}>{item.name_simple}</Text>
            <Text style={styles.translatedName}>{item.translated_name.name}</Text>
            
            <View style={styles.metaRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isMeccan ? '#FFE0E0' : '#E3F2FD' },
                ]}
              >
                <Text style={styles.badgeText}>{isMeccan ? 'Meccan' : 'Medinan'}</Text>
              </View>
              <Text style={styles.metaText}>{item.verses_count} verses</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cardRight}>
          <Text style={styles.arabicName}>{item.name_arabic}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Explore Surahs"
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Surah by name or number..."
          placeholderTextColor={THEME.colors.placeholder}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={THEME.colors.accent} />
          <Text style={styles.loadingText}>Loading Holy Quran chapters...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchChapters} activeOpacity={0.7}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredChapters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSurahItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Surahs found matching "{searchQuery}"</Text>
            </View>
          }
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
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: THEME.colors.surface,
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: THEME.colors.primary,
    shadowColor: THEME.borders.color,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: THEME.borders.color,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  numberBadge: {
    width: 32,
    height: 32,
    backgroundColor: THEME.colors.primary,
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  numberText: {
    fontSize: 13,
    fontWeight: THEME.typography.fontWeightBold,
    color: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
  },
  englishName: {
    fontSize: 16,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.primary,
  },
  translatedName: {
    fontSize: 12,
    fontWeight: THEME.typography.fontWeightRegular,
    color: '#666666',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.primary,
  },
  metaText: {
    fontSize: 11,
    color: '#888888',
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  arabicName: {
    fontSize: 18,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.primary,
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
    shadowColor: THEME.borders.color,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: THEME.typography.fontWeightBold,
    fontSize: 13,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
  },
});

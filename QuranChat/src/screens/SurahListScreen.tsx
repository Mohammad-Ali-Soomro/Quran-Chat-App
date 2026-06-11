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
        style={styles.rowItem}
        onPress={() => navigation.navigate('SurahReader', { chapterId: item.id, chapterName: item.name_simple })}
        activeOpacity={0.7}
      >
        <View style={styles.rowLeft}>
          <View style={styles.numberCircle}>
            <Text style={styles.numberText}>{item.id}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.englishName}>{item.name_simple}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.translatedName}>{item.translated_name.name}</Text>
              <Text style={styles.bullet}>•</Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isMeccan ? '#FFEBEB' : '#E0F2FE' },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: isMeccan ? '#FF4B4B' : '#0284C7' },
                  ]}
                >
                  {isMeccan ? 'Meccan' : 'Medinan'}
                </Text>
              </View>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.metaText}>{item.verses_count} verses</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.rowRight}>
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
          <ActivityIndicator size="large" color={THEME.colors.accentBlue} />
          <Text style={styles.loadingText}>Loading Surahs...</Text>
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
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    backgroundColor: '#FFFFFF',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#F1F3F4',
    borderWidth: 1,
    borderColor: '#E5E9EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: THEME.colors.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  numberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F3F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  numberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555555',
  },
  infoContainer: {
    flex: 1,
  },
  englishName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  translatedName: {
    fontSize: 11,
    color: '#666666',
  },
  bullet: {
    fontSize: 8,
    color: '#AFAFAF',
    marginHorizontal: 6,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  metaText: {
    fontSize: 11,
    color: '#666666',
  },
  rowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  arabicName: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: THEME.colors.cardBorder,
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
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { THEME } from '../constants/theme';
import { AyahData } from '../constants/ayahData';

interface AyahCardProps {
  ayah: AyahData;
  onBookmark: (ayah: AyahData) => void;
  onShare: (ayah: AyahData) => void;
  isBookmarked: boolean;
}

export default function AyahCard({ ayah, onBookmark, onShare, isBookmarked }: AyahCardProps) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.badge}>Ayah of the Day</Text>
      
      <Text style={styles.arabicText}>{ayah.arabic}</Text>
      
      <Text style={styles.translationText}>"{ayah.translation}"</Text>
      
      <Text style={styles.referenceText}>
        Surah {ayah.surah} ({ayah.surahNumber}:{ayah.ayahNumber})
      </Text>
      
      <View style={styles.themeBadge}>
        <Text style={styles.themeText}>{ayah.theme}</Text>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.button,
            isBookmarked ? styles.bookmarkButtonActive : styles.bookmarkButtonInactive,
          ]}
          onPress={() => onBookmark(ayah)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.buttonText,
              isBookmarked ? styles.buttonTextActive : styles.buttonTextInactive,
            ]}
          >
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.shareButton]}
          onPress={() => onShare(ayah)}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.buttonTextInactive]}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: THEME.colors.accentLight,
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    padding: 24,
    marginHorizontal: 16,
    shadowColor: THEME.borders.color,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  badge: {
    fontSize: 10,
    fontWeight: THEME.typography.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: THEME.colors.accent,
    marginBottom: 16,
    textAlign: 'center',
  },
  arabicText: {
    fontSize: THEME.typography.fontSizeHeading,
    textAlign: 'center',
    color: THEME.colors.primary,
    lineHeight: 38,
    marginBottom: 16,
  },
  translationText: {
    fontSize: 14,
    fontWeight: THEME.typography.fontWeightRegular,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  referenceText: {
    fontSize: THEME.typography.fontSizeSmall,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.accent,
    textAlign: 'center',
  },
  themeBadge: {
    backgroundColor: THEME.colors.accentYellow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: THEME.borders.color,
    alignSelf: 'center',
    marginTop: 12,
  },
  themeText: {
    fontSize: 11,
    fontWeight: THEME.typography.fontWeightBold,
    color: THEME.colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
  },
  button: {
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: THEME.borders.radius,
  },
  bookmarkButtonActive: {
    backgroundColor: THEME.colors.accent,
  },
  bookmarkButtonInactive: {
    backgroundColor: '#FFFFFF',
  },
  shareButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: THEME.typography.fontWeightBold,
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
  buttonTextInactive: {
    color: THEME.colors.primary,
  },
});
